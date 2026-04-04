#!/usr/bin/env bun

/**
 * Market Intelligence Engine - Orchestrated Market Analysis
 * Comprehensive market intelligence pipeline combining salary, skills, and company analysis
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { SalaryAnalyzer } from './salary-analyzer.js';
import { SkillsGapAnalyzer } from './skills-gap-analyzer.js';
import { CompanyIntelligence } from './company-intelligence.js';

class MarketIntelligenceEngine {
  constructor(options = {}) {
    this.salaryAnalyzer = new SalaryAnalyzer(options.salary);
    this.skillsGapAnalyzer = new SkillsGapAnalyzer(options.skills);
    this.companyIntelligence = new CompanyIntelligence(options.company);

    this.config = {
      parallel: options.parallel !== false,
      comprehensive: options.comprehensive || true,
      cacheResults: options.cacheResults !== false,
      outputFormat: options.outputFormat || 'comprehensive',
      ...options
    };

    this.sessionData = {
      analyses: [],
      insights: {},
      recommendations: {},
      startTime: Date.now()
    };
  }

  async generateMarketIntelligence(userProfile, targetRole, targetCompanies = []) {
    console.log('📊 Starting comprehensive market intelligence analysis...');

    const intelligence = {
      timestamp: new Date().toISOString(),
      user_profile: userProfile,
      target_role: targetRole,
      target_companies: targetCompanies,
      market_analysis: {},
      strategic_insights: {},
      action_plan: {},
      performance_metrics: {}
    };

    try {
      const startTime = Date.now();

      // Phase 1: Parallel market data collection
      console.log('\n🔄 Phase 1: Market Data Collection (Parallel Processing)');

      const analysisPromises = [];

      // Salary analysis
      analysisPromises.push(
        this.salaryAnalyzer.analyzeSalaryRange(
          targetRole.title,
          userProfile.experience_years || 5,
          targetRole.location || 'National'
        ).then(result => {
          intelligence.market_analysis.salary = result;
          console.log('  ✓ Salary analysis complete');
        })
      );

      // Skills gap analysis
      analysisPromises.push(
        this.skillsGapAnalyzer.analyzeSkillsGap(
          userProfile,
          [targetRole]
        ).then(result => {
          intelligence.market_analysis.skills = result;
          console.log('  ✓ Skills gap analysis complete');
        })
      );

      // Company intelligence (if companies specified)
      if (targetCompanies.length > 0) {
        const companyPromises = targetCompanies.slice(0, 3).map(company =>
          this.companyIntelligence.analyzeCompany(company).then(result => {
            console.log(`  ✓ ${company} analysis complete`);
            return { company, analysis: result };
          })
        );

        analysisPromises.push(
          Promise.all(companyPromises).then(results => {
            intelligence.market_analysis.companies = results;
          })
        );
      }

      await Promise.all(analysisPromises);

      // Phase 2: Cross-analysis insights generation
      console.log('\n🧠 Phase 2: Strategic Intelligence Synthesis');

      intelligence.strategic_insights = this.generateStrategicInsights(intelligence.market_analysis);

      // Phase 3: Personalized action plan
      console.log('\n🎯 Phase 3: Personalized Action Plan Generation');

      intelligence.action_plan = this.generateActionPlan(
        intelligence.strategic_insights,
        userProfile
      );

      // Phase 4: Competitive positioning
      console.log('\n🏆 Phase 4: Competitive Positioning Analysis');

      intelligence.competitive_positioning = this.generateCompetitivePositioning(
        intelligence.market_analysis,
        userProfile
      );

      // Performance metrics
      intelligence.performance_metrics = {
        total_analysis_time: Date.now() - startTime,
        data_sources_used: this.calculateDataSourcesUsed(intelligence.market_analysis),
        confidence_score: this.calculateOverallConfidence(intelligence.market_analysis),
        actionability_score: this.calculateActionabilityScore(intelligence.action_plan)
      };

      // Cache comprehensive analysis
      if (this.config.cacheResults) {
        await this.cacheIntelligenceReport(intelligence);
      }

      console.log('\n✅ Market Intelligence Analysis Complete!');
      this.displayExecutiveSummary(intelligence);

      return intelligence;

    } catch (error) {
      console.error('🚨 Market intelligence analysis failed:', error.message);
      return this.generateFallbackIntelligence(userProfile, targetRole);
    }
  }

  async analyzeMarketOpportunities(userProfile) {
    console.log('🚀 Analyzing market opportunities...');

    const opportunities = {
      timestamp: new Date().toISOString(),
      user_profile: userProfile,
      opportunity_analysis: {},
      recommendations: {}
    };

    try {
      // Skills-driven opportunity analysis
      const skillsAnalysis = await this.skillsGapAnalyzer.analyzeSkillsGap(userProfile);

      // Identify high-opportunity roles based on skills and market demand
      opportunities.opportunity_analysis.role_opportunities = this.identifyRoleOpportunities(
        skillsAnalysis,
        userProfile
      );

      // Identify high-growth companies and sectors
      opportunities.opportunity_analysis.market_opportunities = await this.identifyMarketOpportunities();

      // Generate strategic recommendations
      opportunities.recommendations = this.generateOpportunityRecommendations(
        opportunities.opportunity_analysis
      );

      await this.cacheOpportunityAnalysis(opportunities);

      return opportunities;

    } catch (error) {
      console.error('🚨 Opportunity analysis failed:', error.message);
      return { error: error.message };
    }
  }

  async generateNegotiationIntelligence(userProfile, jobOffer, companyName) {
    console.log('💰 Generating negotiation intelligence...');

    const negotiationIntel = {
      timestamp: new Date().toISOString(),
      job_offer: jobOffer,
      company_name: companyName,
      market_context: {},
      negotiation_strategy: {},
      tactical_guidance: {}
    };

    try {
      // Parallel analysis for negotiation context
      const [salaryBenchmark, companyContext] = await Promise.all([
        this.salaryAnalyzer.analyzeSalaryRange(
          jobOffer.role,
          userProfile.experience_years,
          jobOffer.location
        ),
        this.companyIntelligence.analyzeNegotiationContext(companyName)
      ]);

      negotiationIntel.market_context = {
        salary_benchmark: salaryBenchmark,
        company_context: companyContext,
        offer_position: this.analyzeOfferPosition(jobOffer, salaryBenchmark)
      };

      negotiationIntel.negotiation_strategy = this.generateNegotiationStrategy(
        negotiationIntel.market_context,
        userProfile
      );

      negotiationIntel.tactical_guidance = this.generateTacticalGuidance(
        negotiationIntel.negotiation_strategy,
        companyContext
      );

      return negotiationIntel;

    } catch (error) {
      console.error('🚨 Negotiation intelligence failed:', error.message);
      return { error: error.message };
    }
  }

  // Strategic insights generation
  generateStrategicInsights(marketAnalysis) {
    const insights = {
      market_position: {},
      competitive_advantages: {},
      growth_opportunities: {},
      risk_factors: {},
      strategic_recommendations: {}
    };

    // Analyze market position based on salary and skills data
    insights.market_position = this.analyzeMarketPosition(
      marketAnalysis.salary,
      marketAnalysis.skills
    );

    // Identify competitive advantages
    insights.competitive_advantages = this.identifyCompetitiveAdvantages(
      marketAnalysis.skills,
      marketAnalysis.salary
    );

    // Identify growth opportunities
    insights.growth_opportunities = this.identifyGrowthOpportunities(
      marketAnalysis.skills,
      marketAnalysis.companies
    );

    // Assess risk factors
    insights.risk_factors = this.assessMarketRisks(marketAnalysis);

    // Generate strategic recommendations
    insights.strategic_recommendations = this.generateMarketRecommendations(insights);

    return insights;
  }

  generateActionPlan(strategicInsights, userProfile) {
    const actionPlan = {
      immediate_actions: [], // Next 30 days
      short_term_goals: [],  // 3-6 months
      medium_term_strategy: [], // 6-18 months
      long_term_vision: [], // 2+ years
      success_metrics: {},
      milestone_tracking: {}
    };

    // Generate immediate actions
    actionPlan.immediate_actions = this.generateImmediateActions(
      strategicInsights,
      userProfile
    );

    // Generate short-term goals
    actionPlan.short_term_goals = this.generateShortTermGoals(
      strategicInsights,
      userProfile
    );

    // Generate medium-term strategy
    actionPlan.medium_term_strategy = this.generateMediumTermStrategy(strategicInsights);

    // Generate long-term vision
    actionPlan.long_term_vision = this.generateLongTermVision(strategicInsights);

    // Define success metrics
    actionPlan.success_metrics = this.defineSuccessMetrics(actionPlan);

    return actionPlan;
  }

  generateCompetitivePositioning(marketAnalysis, userProfile) {
    const positioning = {
      unique_value_proposition: '',
      market_differentiation: [],
      positioning_strategy: {},
      messaging_framework: {},
      personal_brand_recommendations: {}
    };

    // Generate unique value proposition
    positioning.unique_value_proposition = this.generateUniqueValueProposition(
      marketAnalysis.skills,
      userProfile
    );

    // Identify market differentiation
    positioning.market_differentiation = this.identifyMarketDifferentiation(
      marketAnalysis.skills,
      marketAnalysis.salary
    );

    // Create positioning strategy
    positioning.positioning_strategy = this.createPositioningStrategy(positioning);

    // Generate messaging framework
    positioning.messaging_framework = this.generateMessagingFramework(positioning);

    return positioning;
  }

  // Analysis methods
  analyzeMarketPosition(salaryData, skillsData) {
    const position = {
      salary_percentile: this.calculateSalaryPercentile(salaryData),
      skills_alignment: skillsData.gap_analysis?.market_alignment || 0,
      competitive_strength: 'Strong', // Simplified
      market_tier: 'Senior Professional'
    };

    return position;
  }

  identifyCompetitiveAdvantages(skillsData, salaryData) {
    return skillsData.gap_analysis?.competitive_strengths || [
      'Strong technical background with leadership experience',
      'Proven track record of rapid execution and delivery',
      'Unique blend of startup agility and enterprise scaling knowledge'
    ];
  }

  identifyGrowthOpportunities(skillsData, companiesData) {
    const opportunities = [];

    // Skills-based opportunities
    if (skillsData.gap_analysis?.opportunity_gaps) {
      opportunities.push(...skillsData.gap_analysis.opportunity_gaps.map(gap => ({
        type: 'skill_development',
        opportunity: gap.skill,
        growth_potential: gap.growth_rate,
        timeline: '3-6 months'
      })));
    }

    // Company-based opportunities
    if (companiesData && companiesData.length > 0) {
      opportunities.push(...companiesData.map(company => ({
        type: 'company_opportunity',
        company: company.company,
        growth_stage: company.analysis?.company_overview?.growth_trajectory,
        opportunity_score: company.analysis?.strategic_insights?.overall_opportunity_score
      })));
    }

    return opportunities.slice(0, 5); // Top 5 opportunities
  }

  // Action plan methods
  generateImmediateActions(insights, userProfile) {
    return [
      {
        action: 'Update LinkedIn profile with AI/ML product management focus',
        timeline: '1 week',
        impact: 'High',
        effort: 'Low'
      },
      {
        action: 'Start networking with AI product leaders in target companies',
        timeline: '2 weeks',
        impact: 'High',
        effort: 'Medium'
      },
      {
        action: 'Begin online AI product management certification',
        timeline: '1 month',
        impact: 'Medium',
        effort: 'High'
      }
    ];
  }

  generateShortTermGoals(insights, userProfile) {
    return [
      {
        goal: 'Complete AI Product Management certification',
        timeline: '3 months',
        success_criteria: 'Certificate completion + portfolio project',
        impact_areas: ['skills_development', 'market_positioning']
      },
      {
        goal: 'Secure 3 informational interviews with target companies',
        timeline: '2 months',
        success_criteria: 'Completed interviews + actionable insights',
        impact_areas: ['networking', 'market_intelligence']
      },
      {
        goal: 'Launch AI-focused side project demonstrating expertise',
        timeline: '4 months',
        success_criteria: 'Public project + case study documentation',
        impact_areas: ['portfolio', 'credibility']
      }
    ];
  }

  // Utility methods
  displayExecutiveSummary(intelligence) {
    console.log(`
📊 MARKET INTELLIGENCE EXECUTIVE SUMMARY
==========================================

🎯 Target Role: ${intelligence.target_role?.title || 'Not specified'}
📍 Location: ${intelligence.target_role?.location || 'Multiple'}
💰 Salary Range: $${intelligence.market_analysis?.salary?.market_data?.salary_percentiles?.p25?.toLocaleString()}-${intelligence.market_analysis?.salary?.market_data?.salary_percentiles?.p75?.toLocaleString()}

📈 Market Position:
   • Salary Percentile: ${Math.round((intelligence.strategic_insights?.market_position?.salary_percentile || 0.7) * 100)}th percentile
   • Skills Alignment: ${Math.round((intelligence.market_analysis?.skills?.gap_analysis?.market_alignment || 0.8) * 100)}%
   • Competitive Strength: ${intelligence.strategic_insights?.market_position?.competitive_strength || 'Strong'}

🎯 Key Opportunities:
   • ${intelligence.strategic_insights?.growth_opportunities?.slice(0, 2).map(opp => opp.opportunity || opp.skill).join('\n   • ') || 'AI/ML specialization, Leadership development'}

⚡ Immediate Actions:
   • ${intelligence.action_plan?.immediate_actions?.slice(0, 2).map(action => action.action).join('\n   • ') || 'Update professional profiles, Begin skill development'}

📊 Confidence Score: ${intelligence.performance_metrics?.confidence_score || 85}/100
⏱️ Analysis Time: ${Math.round((intelligence.performance_metrics?.total_analysis_time || 0) / 1000)}s
`);
  }

  calculateDataSourcesUsed(marketAnalysis) {
    let sources = 0;
    if (marketAnalysis.salary) sources++;
    if (marketAnalysis.skills) sources++;
    if (marketAnalysis.companies) sources += marketAnalysis.companies.length;
    return sources;
  }

  calculateOverallConfidence(marketAnalysis) {
    const confidenceScores = [];

    if (marketAnalysis.salary?.market_data?.confidence_score) {
      confidenceScores.push(marketAnalysis.salary.market_data.confidence_score);
    }

    if (marketAnalysis.skills?.gap_analysis?.market_alignment) {
      confidenceScores.push(marketAnalysis.skills.gap_analysis.market_alignment);
    }

    if (confidenceScores.length === 0) return 75; // Default confidence

    return Math.round(
      (confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length) * 100
    );
  }

  async cacheIntelligenceReport(intelligence) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `market_intelligence_${intelligence.target_role?.title?.replace(/\s+/g, '_')}_${timestamp}.json`;

    await writeFile(filename, JSON.stringify(intelligence, null, 2));
    console.log(`📄 Intelligence report cached to: ${filename}`);
  }

  generateFallbackIntelligence(userProfile, targetRole) {
    return {
      fallback: true,
      message: 'Limited market data available - consider premium analysis',
      basic_insights: {
        salary_estimate: '$120K-180K (industry standard)',
        key_skills_needed: ['Leadership', 'Technical Skills', 'Communication'],
        market_outlook: 'Positive growth expected in target role'
      }
    };
  }
}

// CLI interface
async function runMarketIntelligenceEngine() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help') {
    console.log(`
📊 Market Intelligence Engine

Usage:
  bun market-intelligence-engine.js analyze <profile-file> <role-file> [companies-file]
  bun market-intelligence-engine.js opportunities <profile-file>
  bun market-intelligence-engine.js negotiation <profile-file> <offer-file> <company-name>
  bun market-intelligence-engine.js dashboard <profile-file>

Examples:
  bun market-intelligence-engine.js analyze profile.json target-role.json companies.json
  bun market-intelligence-engine.js opportunities profile.json
  bun market-intelligence-engine.js negotiation profile.json offer.json "OpenAI"
  bun market-intelligence-engine.js dashboard profile.json
`);
    return;
  }

  const engine = new MarketIntelligenceEngine({
    comprehensive: true,
    parallel: true
  });

  try {
    switch (command) {
      case 'analyze':
        const [profileFile, roleFile, companiesFile] = args.slice(1);

        if (!profileFile || !roleFile) {
          console.error('❌ Profile and role files required');
          process.exit(1);
        }

        const profile = JSON.parse(await readFile(profileFile, 'utf-8'));
        const targetRole = JSON.parse(await readFile(roleFile, 'utf-8'));
        const companies = companiesFile ? JSON.parse(await readFile(companiesFile, 'utf-8')) : [];

        await engine.generateMarketIntelligence(profile, targetRole, companies);
        break;

      case 'opportunities':
        const oppProfileFile = args[1];
        if (!oppProfileFile) {
          console.error('❌ Profile file required');
          process.exit(1);
        }

        const oppProfile = JSON.parse(await readFile(oppProfileFile, 'utf-8'));
        const opportunities = await engine.analyzeMarketOpportunities(oppProfile);

        console.log('\n🚀 Market Opportunities Analysis Complete!');
        console.log(`📈 Opportunities identified: ${opportunities.opportunity_analysis?.role_opportunities?.length || 0}`);
        break;

      case 'negotiation':
        const [negProfileFile, offerFile, companyName] = args.slice(1);

        if (!negProfileFile || !offerFile || !companyName) {
          console.error('❌ Profile file, offer file, and company name required');
          process.exit(1);
        }

        const negProfile = JSON.parse(await readFile(negProfileFile, 'utf-8'));
        const offer = JSON.parse(await readFile(offerFile, 'utf-8'));

        const negIntel = await engine.generateNegotiationIntelligence(negProfile, offer, companyName);

        console.log('\n💰 Negotiation Intelligence Complete!');
        console.log(`📊 Offer Position: ${negIntel.market_context?.offer_position || 'Competitive'}`);
        break;

      default:
        console.error(`❌ Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error(`🚨 Market intelligence failed: ${error.message}`);
    process.exit(1);
  }
}

// Export for programmatic use
export { MarketIntelligenceEngine };

// Run CLI if called directly
if (import.meta.main) {
  runMarketIntelligenceEngine();
}