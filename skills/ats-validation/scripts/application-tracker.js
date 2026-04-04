#!/usr/bin/env bun

/**
 * Application Success Tracker & ATS Performance Analytics
 * Track application submissions, responses, and success metrics across ATS systems
 */

import { readFile, writeFile, mkdir, access } from 'fs/promises';
import { join, dirname } from 'path';

class ApplicationTracker {
  constructor(options = {}) {
    this.dataPath = options.dataPath || './application_data';
    this.trackingFile = join(this.dataPath, 'applications.json');
    this.analyticsFile = join(this.dataPath, 'analytics.json');

    this.config = {
      autoSave: options.autoSave !== false,
      analytics: options.analytics !== false,
      emailIntegration: options.emailIntegration || false,
      calendarIntegration: options.calendarIntegration || false,
      ...options
    };

    this.applications = [];
    this.analytics = {};
  }

  async initialize() {
    console.log('📊 Initializing application tracking system...');

    try {
      // Create data directory if it doesn't exist
      await this.ensureDataDirectory();

      // Load existing applications
      await this.loadApplications();

      // Load analytics data
      await this.loadAnalytics();

      console.log(`✅ Application tracker initialized with ${this.applications.length} tracked applications`);

    } catch (error) {
      console.warn('⚠️ Failed to load existing data, starting fresh:', error.message);
      this.applications = [];
      this.analytics = {};
    }
  }

  async trackApplication(applicationData) {
    console.log(`📝 Tracking new application: ${applicationData.company} - ${applicationData.role}`);

    const application = {
      id: this.generateApplicationId(),
      timestamp: new Date().toISOString(),
      status: 'submitted',
      ...applicationData,
      tracking_history: [{
        timestamp: new Date().toISOString(),
        status: 'submitted',
        notes: 'Application submitted'
      }],
      ats_data: {
        system: applicationData.ats_system || 'unknown',
        score: applicationData.ats_score || null,
        parsing_success: applicationData.parsing_success !== false
      },
      metrics: {
        response_time: null,
        interview_count: 0,
        feedback_received: false,
        outcome: 'pending'
      }
    };

    this.applications.push(application);

    if (this.config.autoSave) {
      await this.saveApplications();
    }

    await this.updateAnalytics();

    console.log(`✅ Application tracked with ID: ${application.id}`);
    return application;
  }

  async updateApplicationStatus(applicationId, status, notes = '', additionalData = {}) {
    console.log(`🔄 Updating application ${applicationId} to status: ${status}`);

    const application = this.findApplicationById(applicationId);
    if (!application) {
      throw new Error(`Application with ID ${applicationId} not found`);
    }

    const previousStatus = application.status;
    application.status = status;

    // Add to tracking history
    application.tracking_history.push({
      timestamp: new Date().toISOString(),
      status: status,
      previous_status: previousStatus,
      notes: notes,
      ...additionalData
    });

    // Update metrics based on status change
    await this.updateApplicationMetrics(application, status, previousStatus);

    if (this.config.autoSave) {
      await this.saveApplications();
    }

    await this.updateAnalytics();

    console.log(`✅ Application ${applicationId} updated to ${status}`);
    return application;
  }

  async recordResponse(applicationId, responseData) {
    console.log(`📧 Recording response for application ${applicationId}`);

    const application = this.findApplicationById(applicationId);
    if (!application) {
      throw new Error(`Application with ID ${applicationId} not found`);
    }

    // Calculate response time
    const submissionDate = new Date(application.timestamp);
    const responseDate = new Date(responseData.timestamp || new Date());
    const responseTimeHours = Math.round((responseDate - submissionDate) / (1000 * 60 * 60));

    application.metrics.response_time = responseTimeHours;

    // Record response details
    application.response_data = {
      timestamp: responseData.timestamp || new Date().toISOString(),
      type: responseData.type || 'email', // email, phone, portal
      source: responseData.source || 'recruiter', // recruiter, hiring_manager, system
      content: responseData.content || '',
      positive: responseData.positive !== false
    };

    // Update status if response indicates progression
    let newStatus = application.status;
    if (responseData.type === 'interview_request') {
      newStatus = 'interview_scheduled';
    } else if (responseData.positive) {
      newStatus = 'response_received';
    } else {
      newStatus = 'rejected';
    }

    await this.updateApplicationStatus(
      applicationId,
      newStatus,
      `Response received: ${responseData.type || 'email'}`,
      { response_time_hours: responseTimeHours }
    );

    return application;
  }

  async recordInterview(applicationId, interviewData) {
    console.log(`🎯 Recording interview for application ${applicationId}`);

    const application = this.findApplicationById(applicationId);
    if (!application) {
      throw new Error(`Application with ID ${applicationId} not found`);
    }

    application.metrics.interview_count++;

    // Record interview details
    if (!application.interviews) {
      application.interviews = [];
    }

    const interview = {
      id: this.generateInterviewId(),
      timestamp: interviewData.timestamp || new Date().toISOString(),
      type: interviewData.type || 'phone', // phone, video, onsite, technical
      round: application.interviews.length + 1,
      duration: interviewData.duration || null,
      interviewers: interviewData.interviewers || [],
      feedback: interviewData.feedback || '',
      outcome: interviewData.outcome || 'pending', // positive, negative, pending
      notes: interviewData.notes || ''
    };

    application.interviews.push(interview);

    // Update application status
    let newStatus = 'interviewing';
    if (interview.outcome === 'positive' && interview.round > 1) {
      newStatus = 'final_round';
    } else if (interview.outcome === 'negative') {
      newStatus = 'rejected';
    }

    await this.updateApplicationStatus(
      applicationId,
      newStatus,
      `Interview ${interview.round} completed: ${interview.type}`,
      { interview_round: interview.round }
    );

    return application;
  }

  async recordFinalOutcome(applicationId, outcome, details = {}) {
    console.log(`🎯 Recording final outcome for application ${applicationId}: ${outcome}`);

    const application = this.findApplicationById(applicationId);
    if (!application) {
      throw new Error(`Application with ID ${applicationId} not found`);
    }

    application.metrics.outcome = outcome;
    application.final_outcome = {
      outcome: outcome,
      timestamp: new Date().toISOString(),
      salary_offered: details.salary_offered || null,
      equity_offered: details.equity_offered || null,
      rejection_reason: details.rejection_reason || null,
      feedback: details.feedback || '',
      notes: details.notes || ''
    };

    await this.updateApplicationStatus(
      applicationId,
      outcome,
      `Final outcome: ${outcome}`,
      details
    );

    return application;
  }

  async generateAnalytics(timeframe = 'all') {
    console.log(`📊 Generating analytics for timeframe: ${timeframe}`);

    await this.updateAnalytics();

    const analytics = {
      timeframe: timeframe,
      generated_at: new Date().toISOString(),
      summary: this.generateSummaryAnalytics(timeframe),
      ats_performance: this.generateATSPerformanceAnalytics(timeframe),
      response_analytics: this.generateResponseAnalytics(timeframe),
      interview_analytics: this.generateInterviewAnalytics(timeframe),
      success_patterns: this.identifySuccessPatterns(timeframe),
      recommendations: this.generateRecommendations()
    };

    return analytics;
  }

  // Analytics generation methods
  generateSummaryAnalytics(timeframe) {
    const applications = this.filterApplicationsByTimeframe(timeframe);

    const summary = {
      total_applications: applications.length,
      response_rate: 0,
      interview_rate: 0,
      success_rate: 0,
      average_response_time: 0,
      status_breakdown: {}
    };

    if (applications.length === 0) return summary;

    // Calculate response rate
    const responsesReceived = applications.filter(app =>
      app.status !== 'submitted' && app.status !== 'pending'
    ).length;
    summary.response_rate = responsesReceived / applications.length;

    // Calculate interview rate
    const interviewsScheduled = applications.filter(app =>
      app.metrics.interview_count > 0
    ).length;
    summary.interview_rate = interviewsScheduled / applications.length;

    // Calculate success rate (offers or accepted)
    const successfulApplications = applications.filter(app =>
      app.metrics.outcome === 'offer' || app.metrics.outcome === 'accepted'
    ).length;
    summary.success_rate = successfulApplications / applications.length;

    // Calculate average response time
    const responseTimes = applications
      .filter(app => app.metrics.response_time !== null)
      .map(app => app.metrics.response_time);

    if (responseTimes.length > 0) {
      summary.average_response_time = responseTimes.reduce((a, b) => a + b) / responseTimes.length;
    }

    // Status breakdown
    const statusCounts = {};
    applications.forEach(app => {
      statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    });
    summary.status_breakdown = statusCounts;

    return summary;
  }

  generateATSPerformanceAnalytics(timeframe) {
    const applications = this.filterApplicationsByTimeframe(timeframe);

    const atsPerformance = {
      system_breakdown: {},
      score_correlation: {},
      parsing_success_rate: 0,
      recommendations: []
    };

    // System breakdown
    const systemStats = {};
    applications.forEach(app => {
      const system = app.ats_data.system;
      if (!systemStats[system]) {
        systemStats[system] = {
          total: 0,
          responses: 0,
          interviews: 0,
          successes: 0,
          avg_score: 0,
          total_score: 0,
          parsing_failures: 0
        };
      }

      const stats = systemStats[system];
      stats.total++;

      if (app.status !== 'submitted' && app.status !== 'pending') {
        stats.responses++;
      }

      if (app.metrics.interview_count > 0) {
        stats.interviews++;
      }

      if (app.metrics.outcome === 'offer' || app.metrics.outcome === 'accepted') {
        stats.successes++;
      }

      if (app.ats_data.score) {
        stats.total_score += app.ats_data.score;
      }

      if (!app.ats_data.parsing_success) {
        stats.parsing_failures++;
      }
    });

    // Calculate rates for each system
    Object.keys(systemStats).forEach(system => {
      const stats = systemStats[system];
      stats.response_rate = stats.total > 0 ? stats.responses / stats.total : 0;
      stats.interview_rate = stats.total > 0 ? stats.interviews / stats.total : 0;
      stats.success_rate = stats.total > 0 ? stats.successes / stats.total : 0;
      stats.avg_score = stats.responses > 0 ? stats.total_score / stats.responses : 0;
      stats.parsing_success_rate = stats.total > 0 ? (stats.total - stats.parsing_failures) / stats.total : 0;
    });

    atsPerformance.system_breakdown = systemStats;

    // Score correlation analysis
    atsPerformance.score_correlation = this.analyzeScoreCorrelation(applications);

    // Overall parsing success rate
    const totalApplications = applications.length;
    const successfulParses = applications.filter(app => app.ats_data.parsing_success).length;
    atsPerformance.parsing_success_rate = totalApplications > 0 ? successfulParses / totalApplications : 0;

    return atsPerformance;
  }

  generateResponseAnalytics(timeframe) {
    const applications = this.filterApplicationsByTimeframe(timeframe);

    const responseAnalytics = {
      response_times: this.analyzeResponseTimes(applications),
      response_sources: this.analyzeResponseSources(applications),
      response_patterns: this.analyzeResponsePatterns(applications),
      seasonal_trends: this.analyzeSeasonalTrends(applications)
    };

    return responseAnalytics;
  }

  generateInterviewAnalytics(timeframe) {
    const applications = this.filterApplicationsByTimeframe(timeframe);
    const interviews = this.extractAllInterviews(applications);

    const interviewAnalytics = {
      interview_types: this.analyzeInterviewTypes(interviews),
      conversion_rates: this.analyzeInterviewConversions(applications),
      round_analysis: this.analyzeInterviewRounds(interviews),
      success_factors: this.analyzeInterviewSuccessFactors(interviews)
    };

    return interviewAnalytics;
  }

  identifySuccessPatterns(timeframe) {
    const applications = this.filterApplicationsByTimeframe(timeframe);
    const successfulApps = applications.filter(app =>
      app.metrics.outcome === 'offer' || app.metrics.outcome === 'accepted'
    );

    const patterns = {
      ats_score_patterns: this.analyzeSuccessfulATSScores(successfulApps),
      timing_patterns: this.analyzeSuccessfulTiming(successfulApps),
      company_patterns: this.analyzeSuccessfulCompanies(successfulApps),
      role_patterns: this.analyzeSuccessfulRoles(successfulApps),
      interview_patterns: this.analyzeSuccessfulInterviews(successfulApps)
    };

    return patterns;
  }

  generateRecommendations() {
    const analytics = this.analytics;

    const recommendations = {
      ats_optimization: [],
      application_strategy: [],
      interview_preparation: [],
      timing_optimization: []
    };

    // ATS optimization recommendations
    if (analytics.ats_performance?.parsing_success_rate < 0.8) {
      recommendations.ats_optimization.push(
        'Improve resume format compatibility - parsing success rate below 80%'
      );
    }

    // Application strategy recommendations
    const bestPerformingSystem = this.findBestPerformingATSSystem();
    if (bestPerformingSystem) {
      recommendations.application_strategy.push(
        `Focus more applications on ${bestPerformingSystem} (highest response rate)`
      );
    }

    // Interview preparation recommendations
    if (analytics.interview_analytics?.conversion_rates?.final_to_offer < 0.6) {
      recommendations.interview_preparation.push(
        'Improve final round interview preparation - conversion rate below 60%'
      );
    }

    return recommendations;
  }

  // Utility methods
  async ensureDataDirectory() {
    try {
      await access(this.dataPath);
    } catch {
      await mkdir(this.dataPath, { recursive: true });
    }
  }

  async loadApplications() {
    try {
      const data = await readFile(this.trackingFile, 'utf-8');
      this.applications = JSON.parse(data);
    } catch (error) {
      this.applications = [];
    }
  }

  async saveApplications() {
    await writeFile(this.trackingFile, JSON.stringify(this.applications, null, 2));
  }

  async loadAnalytics() {
    try {
      const data = await readFile(this.analyticsFile, 'utf-8');
      this.analytics = JSON.parse(data);
    } catch (error) {
      this.analytics = {};
    }
  }

  async saveAnalytics() {
    await writeFile(this.analyticsFile, JSON.stringify(this.analytics, null, 2));
  }

  async updateAnalytics() {
    this.analytics = await this.generateAnalytics('all');
    if (this.config.autoSave) {
      await this.saveAnalytics();
    }
  }

  generateApplicationId() {
    return `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateInterviewId() {
    return `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  findApplicationById(id) {
    return this.applications.find(app => app.id === id);
  }

  filterApplicationsByTimeframe(timeframe) {
    if (timeframe === 'all') return this.applications;

    const now = new Date();
    let cutoffDate;

    switch (timeframe) {
      case '7d':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        return this.applications;
    }

    return this.applications.filter(app => new Date(app.timestamp) >= cutoffDate);
  }

  async updateApplicationMetrics(application, newStatus, previousStatus) {
    // Update metrics based on status changes
    if (newStatus === 'response_received' && application.metrics.response_time === null) {
      const submissionDate = new Date(application.timestamp);
      const responseDate = new Date();
      application.metrics.response_time = Math.round((responseDate - submissionDate) / (1000 * 60 * 60));
    }

    if (newStatus.includes('interview') && !application.metrics.interview_count) {
      application.metrics.interview_count = 1;
    }

    if (newStatus === 'offer' || newStatus === 'accepted' || newStatus === 'rejected') {
      application.metrics.outcome = newStatus;
    }
  }

  displayTrackingSummary() {
    const summary = this.generateSummaryAnalytics('30d');

    console.log(`
📊 APPLICATION TRACKING SUMMARY (Last 30 Days)
=============================================

📈 Applications: ${summary.total_applications}
📧 Response Rate: ${Math.round(summary.response_rate * 100)}%
🎯 Interview Rate: ${Math.round(summary.interview_rate * 100)}%
🏆 Success Rate: ${Math.round(summary.success_rate * 100)}%
⏱️ Avg Response Time: ${Math.round(summary.average_response_time)} hours

📊 Status Breakdown:
${Object.entries(summary.status_breakdown).map(([status, count]) => `• ${status}: ${count}`).join('\n')}
`);
  }
}

// CLI interface
async function runApplicationTracker() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help') {
    console.log(`
📊 Application Tracker

Usage:
  bun application-tracker.js track <application-data.json>
  bun application-tracker.js update <app-id> <status> [notes]
  bun application-tracker.js response <app-id> <response-data.json>
  bun application-tracker.js interview <app-id> <interview-data.json>
  bun application-tracker.js analytics [timeframe]
  bun application-tracker.js summary

Examples:
  bun application-tracker.js track application.json
  bun application-tracker.js update app123 "interview_scheduled" "Phone screen scheduled"
  bun application-tracker.js analytics 30d
  bun application-tracker.js summary
`);
    return;
  }

  const tracker = new ApplicationTracker();
  await tracker.initialize();

  try {
    switch (command) {
      case 'track':
        const applicationFile = args[1];
        if (!applicationFile) {
          console.error('❌ Application data file required');
          process.exit(1);
        }

        const applicationData = JSON.parse(await readFile(applicationFile, 'utf-8'));
        const app = await tracker.trackApplication(applicationData);
        console.log(`✅ Application tracked: ${app.id}`);
        break;

      case 'update':
        const [appId, status, notes] = args.slice(1);
        if (!appId || !status) {
          console.error('❌ Application ID and status required');
          process.exit(1);
        }

        await tracker.updateApplicationStatus(appId, status, notes || '');
        break;

      case 'analytics':
        const timeframe = args[1] || 'all';
        const analytics = await tracker.generateAnalytics(timeframe);

        console.log('\n📊 Application Analytics:');
        console.log(`Response Rate: ${Math.round(analytics.summary.response_rate * 100)}%`);
        console.log(`Interview Rate: ${Math.round(analytics.summary.interview_rate * 100)}%`);
        console.log(`Success Rate: ${Math.round(analytics.summary.success_rate * 100)}%`);
        break;

      case 'summary':
        tracker.displayTrackingSummary();
        break;

      default:
        console.error(`❌ Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error(`🚨 Application tracking failed: ${error.message}`);
    process.exit(1);
  }
}

// Export for programmatic use
export { ApplicationTracker };

// Run CLI if called directly
if (import.meta.main) {
  runApplicationTracker();
}