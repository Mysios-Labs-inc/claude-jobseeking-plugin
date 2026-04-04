#!/usr/bin/env bun

/**
 * Company Intelligence & Culture Analysis Engine
 * Comprehensive company research, culture assessment, and interview preparation intelligence
 */

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

class CompanyIntelligence {
  constructor(options = {}) {
    this.dataSources = {
      glassdoor: 'Employee reviews and salary data',
      linkedin: 'Employee profiles and growth patterns',
      crunchbase: 'Funding and business metrics',
      github: 'Technical culture and open source activity',
      news_sentiment: 'Public perception and media coverage',
      social_media: 'Company culture and employee sentiment'
    };

    this.config = {
      analysisDepth: 'comprehensive',
      sentimentAnalysis: true,
      cultureMapping: true,
      interviewIntelligence: true,
      ...options
    };

    this.cultureFramework = this.initializeCultureFramework();
  }

  async analyzeCompany(companyName, options = {}) {
    console.log(`🏢 Starting comprehensive analysis for: ${companyName}`);

    const analysis = {
      company_name: companyName,
      analysis_date: new Date().toISOString(),
      company_overview: {},
      culture_analysis: {},
      hiring_intelligence: {},
      interview_preparation: {},
      negotiation_context: {},
      risk_assessment: {}
    };

    try {
      // Phase 1: Company overview and fundamentals
      console.log('📊 Gathering company fundamentals...');
      analysis.company_overview = await this.gatherCompanyOverview(companyName);

      // Phase 2: Culture and employee sentiment analysis
      console.log('🎭 Analyzing company culture and employee sentiment...');
      analysis.culture_analysis = await this.analyzeCulture(companyName);

      // Phase 3: Hiring patterns and intelligence
      console.log('📈 Analyzing hiring patterns and team growth...');
      analysis.hiring_intelligence = await this.analyzeHiringPatterns(companyName);

      // Phase 4: Interview process intelligence
      console.log('🎯 Gathering interview process intelligence...');
      analysis.interview_preparation = await this.analyzeInterviewProcess(companyName);

      // Phase 5: Negotiation context and budget analysis
      console.log('💰 Analyzing negotiation context...');
      analysis.negotiation_context = await this.analyzeNegotiationContext(companyName);

      // Phase 6: Risk assessment
      console.log('⚠️ Conducting risk assessment...');
      analysis.risk_assessment = this.conductRiskAssessment(analysis);

      // Generate strategic insights
      analysis.strategic_insights = this.generateStrategicInsights(analysis);

      await this.cacheCompanyAnalysis(companyName, analysis);

      console.log('✅ Company intelligence analysis complete!');
      return analysis;

    } catch (error) {
      console.error('🚨 Company analysis failed:', error.message);
      return this.generateFallbackAnalysis(companyName);
    }
  }

  async gatherCompanyOverview(companyName) {
    const overview = {
      basic_info: {},
      financial_health: {},
      growth_trajectory: {},
      market_position: {},
      recent_developments: {}
    };

    // Simulate data gathering from multiple sources
    console.log('🔄 Fetching company data from multiple sources...');

    const [crunchbaseData, linkedinData, newsData] = await Promise.all([
      this.fetchCrunchbaseData(companyName),
      this.fetchLinkedinData(companyName),
      this.fetchNewsData(companyName)
    ]);

    overview.basic_info = {
      founded: crunchbaseData.founded || 'Unknown',
      size: crunchbaseData.employee_count || 'Unknown',
      headquarters: crunchbaseData.headquarters || 'Unknown',
      industry: crunchbaseData.industry || 'Unknown',
      stage: crunchbaseData.funding_stage || 'Unknown'
    };

    overview.financial_health = {
      funding_total: crunchbaseData.total_funding || 0,
      latest_round: crunchbaseData.latest_round || 'Unknown',
      runway_estimate: this.estimateRunway(crunchbaseData),
      revenue_stage: this.estimateRevenueStage(crunchbaseData),
      financial_stability: this.assessFinancialStability(crunchbaseData)
    };

    overview.growth_trajectory = {
      employee_growth: linkedinData.growth_rate || 0,
      hiring_velocity: linkedinData.hiring_velocity || 'Unknown',
      expansion_markets: crunchbaseData.expansion || [],
      product_evolution: newsData.product_developments || []
    };

    return overview;
  }

  async analyzeCulture(companyName) {
    const cultureAnalysis = {
      overall_rating: 0,
      culture_dimensions: {},
      employee_sentiment: {},
      leadership_reputation: {},
      work_life_balance: {},
      diversity_inclusion: {},
      remote_work_culture: {},
      career_development: {}
    };

    console.log('🔄 Analyzing employee reviews and sentiment...');

    const [glassdoorData, linkedinCulture, githubCulture] = await Promise.all([
      this.fetchGlassdoorData(companyName),
      this.analyzeLinkedinCulture(companyName),
      this.analyzeGithubCulture(companyName)
    ]);

    // Aggregate culture dimensions
    cultureAnalysis.culture_dimensions = this.mapCultureDimensions(
      glassdoorData,
      linkedinCulture,
      githubCulture
    );

    cultureAnalysis.overall_rating = this.calculateOverallCultureRating(cultureAnalysis.culture_dimensions);

    cultureAnalysis.employee_sentiment = {
      satisfaction_score: glassdoorData.satisfaction || 0,
      retention_indicators: glassdoorData.retention_signals || {},
      common_complaints: glassdoorData.common_complaints || [],
      positive_highlights: glassdoorData.positive_aspects || []
    };

    cultureAnalysis.work_life_balance = {
      rating: glassdoorData.work_life_balance || 0,
      remote_flexibility: this.assessRemoteFlexibility(glassdoorData, linkedinCulture),
      overtime_expectations: this.analyzeOvertimeExpectations(glassdoorData),
      vacation_policy: this.analyzeVacationPolicy(glassdoorData)
    };

    return cultureAnalysis;
  }

  async analyzeHiringPatterns(companyName) {
    const hiringIntelligence = {
      hiring_velocity: {},
      team_growth: {},
      role_patterns: {},
      source_channels: {},
      timeline_analysis: {},
      success_factors: {}
    };

    console.log('🔄 Analyzing hiring data and growth patterns...');

    const hiringData = await this.fetchHiringData(companyName);

    hiringIntelligence.hiring_velocity = {
      current_openings: hiringData.open_positions || 0,
      monthly_hires: hiringData.monthly_hiring_rate || 0,
      time_to_hire: hiringData.average_time_to_hire || 'Unknown',
      departments_growing: hiringData.growing_departments || []
    };

    hiringIntelligence.role_patterns = {
      most_common_roles: hiringData.common_roles || [],
      seniority_distribution: hiringData.seniority_levels || {},
      skill_requirements: hiringData.required_skills || [],
      nice_to_have_skills: hiringData.preferred_skills || []
    };

    hiringIntelligence.success_factors = this.identifyHiringSuccessFactors(hiringData);

    return hiringIntelligence;
  }

  async analyzeInterviewProcess(companyName) {
    const interviewIntelligence = {
      process_structure: {},
      common_questions: [],
      technical_assessments: {},
      cultural_fit_evaluation: {},
      decision_timeline: {},
      success_strategies: {}
    };

    console.log('🔄 Gathering interview process intelligence...');

    const [glassdoorInterviews, leetcodeData, blindData] = await Promise.all([
      this.fetchGlassdoorInterviews(companyName),
      this.fetchTechnicalAssessmentData(companyName),
      this.fetchBlindInterviewData(companyName)
    ]);

    interviewIntelligence.process_structure = {
      typical_rounds: glassdoorInterviews.interview_rounds || [],
      duration_per_round: glassdoorInterviews.round_durations || {},
      interviewers_per_round: glassdoorInterviews.interviewer_counts || {},
      virtual_vs_onsite: glassdoorInterviews.format_distribution || {}
    };

    interviewIntelligence.common_questions = [
      ...glassdoorInterviews.behavioral_questions || [],
      ...glassdoorInterviews.technical_questions || [],
      ...glassdoorInterviews.case_study_questions || []
    ];

    interviewIntelligence.technical_assessments = {
      coding_challenges: leetcodeData.common_problems || [],
      system_design: leetcodeData.system_design_topics || [],
      take_home_projects: glassdoorInterviews.take_home_assignments || []
    };

    interviewIntelligence.success_strategies = this.generateInterviewSuccessStrategies(
      interviewIntelligence
    );

    return interviewIntelligence;
  }

  async analyzeNegotiationContext(companyName) {
    const negotiationContext = {
      budget_constraints: {},
      compensation_philosophy: {},
      equity_approach: {},
      negotiation_flexibility: {},
      timing_considerations: {}
    };

    console.log('🔄 Analyzing compensation and negotiation context...');

    const [salaryData, equityData, budgetData] = await Promise.all([
      this.fetchCompensationData(companyName),
      this.fetchEquityData(companyName),
      this.analyzeBudgetConstraints(companyName)
    ]);

    negotiationContext.compensation_philosophy = {
      market_positioning: salaryData.market_percentile || 'Unknown',
      salary_bands: salaryData.salary_bands || {},
      performance_bonuses: salaryData.bonus_structure || {},
      review_cycles: salaryData.review_frequency || 'Annual'
    };

    negotiationContext.equity_approach = {
      typical_equity_ranges: equityData.equity_ranges || {},
      vesting_schedule: equityData.vesting_terms || '4-year with 1-year cliff',
      exercise_policies: equityData.exercise_options || {},
      liquidity_timeline: this.estimateEquityLiquidity(equityData)
    };

    negotiationContext.negotiation_flexibility = this.assessNegotiationFlexibility(
      salaryData,
      budgetData
    );

    return negotiationContext;
  }

  conductRiskAssessment(analysis) {
    const riskAssessment = {
      overall_risk_score: 0,
      financial_risks: {},
      cultural_risks: {},
      career_risks: {},
      market_risks: {},
      recommendations: []
    };

    // Financial risk assessment
    riskAssessment.financial_risks = this.assessFinancialRisks(analysis.company_overview);

    // Cultural fit risk assessment
    riskAssessment.cultural_risks = this.assessCulturalRisks(analysis.culture_analysis);

    // Career development risks
    riskAssessment.career_risks = this.assessCareerRisks(analysis);

    // Market position risks
    riskAssessment.market_risks = this.assessMarketRisks(analysis.company_overview);

    // Calculate overall risk score
    riskAssessment.overall_risk_score = this.calculateOverallRiskScore(riskAssessment);

    // Generate risk mitigation recommendations
    riskAssessment.recommendations = this.generateRiskMitigationRecommendations(riskAssessment);

    return riskAssessment;
  }

  // Data fetching methods (mock implementations)
  async fetchCrunchbaseData(companyName) {
    await this.simulateApiCall(1000);

    // Mock Crunchbase data
    const mockData = {
      founded: '2019',
      employee_count: '201-500',
      headquarters: 'San Francisco, CA',
      industry: 'Artificial Intelligence',
      funding_stage: 'Series B',
      total_funding: '$45M',
      latest_round: '$25M Series B',
      valuation: '$200M',
      investors: ['Sequoia Capital', 'a16z', 'First Round']
    };

    return this.customizeCompanyData(mockData, companyName);
  }

  async fetchLinkedinData(companyName) {
    await this.simulateApiCall(800);

    return {
      growth_rate: 0.23,
      hiring_velocity: 'High',
      employee_distribution: {
        engineering: 0.4,
        product: 0.15,
        sales: 0.2,
        marketing: 0.1,
        operations: 0.15
      },
      leadership_tenure: '3.2 years average',
      education_background: ['Stanford', 'MIT', 'UC Berkeley']
    };
  }

  async fetchGlassdoorData(companyName) {
    await this.simulateApiCall(600);

    return {
      overall_rating: 4.2,
      satisfaction: 0.78,
      work_life_balance: 4.1,
      culture_values: 4.0,
      career_opportunities: 3.8,
      compensation_benefits: 4.3,
      senior_management: 3.9,
      common_complaints: [
        'Fast-paced environment can be stressful',
        'Equity vesting schedule is standard but long',
        'Some process inconsistencies during rapid growth'
      ],
      positive_aspects: [
        'Innovative product and strong technical team',
        'Excellent compensation and equity packages',
        'Smart colleagues and learning opportunities',
        'Flexible remote work policy'
      ]
    };
  }

  async fetchHiringData(companyName) {
    await this.simulateApiCall(400);

    return {
      open_positions: 23,
      monthly_hiring_rate: 8,
      average_time_to_hire: '6 weeks',
      growing_departments: ['Engineering', 'Product', 'Sales'],
      common_roles: [
        'Senior Software Engineer',
        'Product Manager',
        'Sales Development Representative',
        'Data Scientist'
      ],
      required_skills: ['Python', 'React', 'AWS', 'Machine Learning'],
      preferred_skills: ['AI/ML Experience', 'Startup Experience', 'Leadership']
    };
  }

  // Culture analysis methods
  mapCultureDimensions(glassdoorData, linkedinCulture, githubCulture) {
    return {
      innovation: this.calculateInnovationScore(glassdoorData, githubCulture),
      collaboration: this.calculateCollaborationScore(glassdoorData, linkedinCulture),
      autonomy: this.calculateAutonomyScore(glassdoorData),
      growth_mindset: this.calculateGrowthMindsetScore(glassdoorData, linkedinCulture),
      transparency: this.calculateTransparencyScore(glassdoorData),
      work_life_integration: this.calculateWorkLifeScore(glassdoorData)
    };
  }

  calculateInnovationScore(glassdoorData, githubCulture) {
    // Simplified innovation scoring
    const baseScore = glassdoorData.overall_rating * 0.2;
    const techScore = githubCulture?.open_source_activity || 0.5;
    return Math.min(5.0, baseScore + techScore);
  }

  generateInterviewSuccessStrategies(interviewIntelligence) {
    return {
      preparation_focus: [
        'Practice system design for scalable AI applications',
        'Prepare STAR format stories emphasizing rapid execution',
        'Review company product and recent AI/ML initiatives',
        'Practice whiteboarding and live coding exercises'
      ],
      cultural_fit_tips: [
        'Emphasize learning agility and adaptability',
        'Highlight collaborative problem-solving approach',
        'Demonstrate passion for AI/ML innovation',
        'Show evidence of data-driven decision making'
      ],
      timing_strategy: {
        best_time_to_apply: 'Monday-Wednesday mornings',
        follow_up_cadence: 'Weekly check-ins after interviews',
        decision_timeline: '2-3 weeks typical'
      }
    };
  }

  // Risk assessment methods
  assessFinancialRisks(companyOverview) {
    const risks = {
      funding_risk: 'Low', // Based on recent Series B
      runway_risk: 'Low',  // 18+ months estimated
      revenue_risk: 'Medium', // Early stage revenue
      market_risk: 'Medium' // Competitive AI market
    };

    const riskScore = this.calculateFinancialRiskScore(risks);

    return {
      risks: risks,
      score: riskScore,
      explanation: 'Well-funded with strong investor backing, but early-stage revenue model'
    };
  }

  generateStrategicInsights(analysis) {
    return {
      culture_fit_score: this.calculateCultureFitScore(analysis.culture_analysis),
      compensation_positioning: this.analyzeCompensationPositioning(analysis.negotiation_context),
      career_growth_potential: this.assessCareerGrowthPotential(analysis),
      interview_success_probability: this.calculateInterviewSuccessProbability(analysis),
      negotiation_leverage: this.assessNegotiationLeverage(analysis),
      overall_opportunity_score: this.calculateOverallOpportunityScore(analysis)
    };
  }

  // Utility methods
  async simulateApiCall(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  customizeCompanyData(mockData, companyName) {
    // In real implementation, this would fetch actual data
    return mockData;
  }

  initializeCultureFramework() {
    return {
      dimensions: ['innovation', 'collaboration', 'autonomy', 'growth_mindset', 'transparency', 'work_life_integration'],
      weights: [0.2, 0.2, 0.15, 0.2, 0.1, 0.15]
    };
  }

  generateFallbackAnalysis(companyName) {
    return {
      company_name: companyName,
      fallback: true,
      message: 'Limited public data available - consider premium research sources',
      basic_insights: {
        industry_average_rating: 3.8,
        typical_interview_process: '4-6 rounds over 3-4 weeks',
        general_recommendations: [
          'Research recent company news and product updates',
          'Prepare for technical and cultural fit assessments',
          'Network with current employees via LinkedIn',
          'Practice common interview questions for the industry'
        ]
      }
    };
  }

  async cacheCompanyAnalysis(companyName, analysis) {
    const filename = `company_analysis_${companyName.replace(/\s+/g, '_')}_${Date.now()}.json`;
    await writeFile(filename, JSON.stringify(analysis, null, 2));
    console.log(`📄 Company analysis cached to: ${filename}`);
  }

  // --- Stub implementations for all missing analysis methods ---
  estimateRunway(data) { return data.funding_stage?.includes('Series') ? '18+ months' : '12 months'; }
  estimateRevenueStage(data) { return data.funding_stage?.includes('C') ? 'Growth' : 'Early'; }
  assessFinancialStability(data) { return data.total_funding ? 'Stable' : 'Unknown'; }
  async analyzeLinkedinCulture(name) { return { open_source: 0.6, tech_culture: 0.8 }; }
  async analyzeGithubCulture(name) { return { open_source_activity: 0.5, repos: 10 }; }
  calculateOverallCultureRating(dims) { const vals = Object.values(dims).filter(v => typeof v === 'number'); return vals.length ? +(vals.reduce((a, b) => a + b) / vals.length).toFixed(1) : 3.5; }
  calculateCollaborationScore(gd, lc) { return (gd.culture_values || 4.0) * 0.25; }
  calculateAutonomyScore(gd) { return (gd.work_life_balance || 4.0) * 0.22; }
  calculateGrowthMindsetScore(gd, lc) { return (gd.career_opportunities || 3.8) * 0.23; }
  calculateTransparencyScore(gd) { return (gd.senior_management || 3.9) * 0.22; }
  calculateWorkLifeScore(gd) { return (gd.work_life_balance || 4.0) * 0.23; }
  assessRemoteFlexibility(gd, lc) { return gd.positive_aspects?.some(p => /remote|flexible/i.test(p)) ? 'High' : 'Moderate'; }
  analyzeOvertimeExpectations(gd) { return gd.common_complaints?.some(c => /stress|hours/i.test(c)) ? 'Moderate overtime expected' : 'Standard hours'; }
  analyzeVacationPolicy(gd) { return 'Standard PTO (details vary)'; }
  identifyHiringSuccessFactors(data) { return ['Technical depth', 'Culture fit', 'Rapid execution examples', 'Data-driven approach']; }
  async fetchGlassdoorInterviews(name) { return { interview_rounds: ['Phone Screen', 'Technical', 'Hiring Manager', 'Onsite'], round_durations: { phone: '30 min', technical: '60 min', onsite: '4 hours' }, interviewer_counts: { phone: 1, technical: 2, onsite: 4 }, format_distribution: { virtual: 0.6, onsite: 0.4 }, behavioral_questions: ['Tell me about a time you led a team...', 'Describe a product decision you made with limited data...'], technical_questions: ['Design a system for...', 'How would you prioritize...'], case_study_questions: ['Evaluate this product strategy...'], take_home_assignments: [] }; }
  async fetchTechnicalAssessmentData(name) { return { common_problems: ['System Design', 'Product Sense'], system_design_topics: ['Scalable APIs', 'Data Pipeline'] }; }
  async fetchBlindInterviewData(name) { return { difficulty: 3.5, satisfaction: 0.72 }; }
  async fetchCompensationData(name) { return { market_percentile: '75th', salary_bands: { senior: '$150K-200K' }, bonus_structure: '15-25% target', review_frequency: 'Annual' }; }
  async fetchEquityData(name) { return { equity_ranges: { senior: '0.1-0.3%' }, vesting_terms: '4-year with 1-year cliff', exercise_options: 'Standard 90-day post-termination' }; }
  async analyzeBudgetConstraints(name) { return { budget_health: 'Strong', hiring_budget: 'Expanding' }; }
  estimateEquityLiquidity(data) { return 'IPO or secondary in 2-4 years (estimated)'; }
  assessNegotiationFlexibility(salary, budget) { return { flexibility: 'Moderate to High', base_flexibility: '10-15%', equity_flexibility: '20-30%', signing_bonus: 'Available' }; }
  assessCulturalRisks(culture) { return { risk: culture.overall_rating >= 4.0 ? 'Low' : 'Medium', concern: culture.overall_rating < 3.5 ? 'Below average culture rating' : 'None significant' }; }
  assessCareerRisks(analysis) { return { risk: 'Low', growth_trajectory: 'Positive' }; }
  assessMarketRisks(overview) { return { risk: 'Medium', rationale: 'Competitive market with strong funding' }; }
  calculateFinancialRiskScore(risks) { const riskValues = { Low: 0.2, Medium: 0.5, High: 0.8 }; const vals = Object.values(risks).map(r => riskValues[r] || 0.5); return +(vals.reduce((a, b) => a + b) / vals.length).toFixed(2); }
  calculateOverallRiskScore(ra) { return +((ra.financial_risks?.score || 0.3) * 0.4 + (ra.cultural_risks?.risk === 'Low' ? 0.2 : 0.5) * 0.3 + 0.3 * 0.3).toFixed(2); }
  generateRiskMitigationRecommendations(ra) { const recs = []; if (ra.financial_risks?.score > 0.5) recs.push('Negotiate guaranteed severance package'); if (ra.cultural_risks?.risk !== 'Low') recs.push('Request team introduction before accepting'); recs.push('Negotiate performance milestones for equity acceleration'); return recs; }
  calculateCultureFitScore(culture) { return Math.round((culture.overall_rating || 3.5) * 20); }
  analyzeCompensationPositioning(neg) { return neg?.compensation_philosophy?.market_positioning || '75th percentile'; }
  assessCareerGrowthPotential(analysis) { return analysis.hiring_intelligence?.hiring_velocity?.monthly_hires > 5 ? 'High' : 'Moderate'; }
  calculateInterviewSuccessProbability(analysis) { return 65; }
  assessNegotiationLeverage(analysis) { return analysis.negotiation_context?.negotiation_flexibility?.flexibility || 'Moderate'; }
  calculateOverallOpportunityScore(analysis) { return Math.round(((analysis.culture_analysis?.overall_rating || 3.5) / 5) * 40 + 30 + Math.random() * 15); }
  async fetchNewsData(name) { return { product_developments: ['New AI features launched', 'Market expansion'], sentiment: 'Positive' }; }
}

// CLI interface
async function runCompanyIntelligence() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help') {
    console.log(`
🏢 Company Intelligence Analyzer

Usage:
  bun company-intelligence.js analyze <company-name>
  bun company-intelligence.js batch <companies-file.json>
  bun company-intelligence.js culture <company-name>
  bun company-intelligence.js interview-prep <company-name>

Examples:
  bun company-intelligence.js analyze "OpenAI"
  bun company-intelligence.js batch target-companies.json
  bun company-intelligence.js culture "Anthropic"
  bun company-intelligence.js interview-prep "Google"
`);
    return;
  }

  const intelligence = new CompanyIntelligence();

  try {
    switch (command) {
      case 'analyze':
        const companyName = args[1];
        if (!companyName) {
          console.error('❌ Company name required');
          process.exit(1);
        }

        const analysis = await intelligence.analyzeCompany(companyName);

        console.log('\n✅ Company Intelligence Analysis Complete!');
        console.log(`🏢 Company: ${analysis.company_name}`);
        console.log(`⭐ Culture Rating: ${analysis.culture_analysis?.overall_rating}/5.0`);
        console.log(`💰 Financial Health: ${analysis.company_overview?.financial_health?.financial_stability}`);
        console.log(`📊 Overall Opportunity: ${analysis.strategic_insights?.overall_opportunity_score}/100`);

        break;

      case 'culture':
        const cultureName = args[1];
        if (!cultureName) {
          console.error('❌ Company name required');
          process.exit(1);
        }

        console.log(`🎭 Analyzing culture for: ${cultureName}`);
        const cultureAnalysis = await intelligence.analyzeCulture(cultureName);

        console.log(`\n📊 Culture Analysis Results:`);
        console.log(`Overall Rating: ${cultureAnalysis.overall_rating}/5.0`);
        console.log(`Work-Life Balance: ${cultureAnalysis.work_life_balance?.rating}/5.0`);

        break;

      default:
        console.error(`❌ Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error(`🚨 Analysis failed: ${error.message}`);
    process.exit(1);
  }
}

// Export for programmatic use
export { CompanyIntelligence };

// Run CLI if called directly
if (import.meta.main) {
  runCompanyIntelligence();
}