#!/usr/bin/env bun

/**
 * Network Analyzer - Professional Relationship Mapping & Intelligence
 * AI-powered network analysis, referral pathways, and relationship scoring
 */

import { readFile, writeFile, mkdir, access } from 'fs/promises';
import { join, basename } from 'path';

class NetworkAnalyzer {
  constructor(options = {}) {
    this.config = {
      analysisDepth: options.depth || 'standard',
      includeSecondDegree: options.includeSecondDegree !== false,
      clusterDetection: options.clusterDetection !== false,
      ...options
    };
    this.connections = [];
    this.clusters = {};
    this.pathways = {};
  }

  async analyzeNetwork(dataSource) {
    console.log('🕸️ Starting professional network analysis...');

    const analysis = {
      timestamp: new Date().toISOString(),
      network_health: {},
      composition: {},
      clusters: {},
      referral_pathways: {},
      growth_opportunities: {},
      action_plan: {}
    };

    try {
      // Load and parse network data
      console.log('📊 Loading network data...');
      this.connections = await this.loadNetworkData(dataSource);

      // Phase 1: Network health assessment
      console.log('📈 Assessing network health...');
      analysis.network_health = this.assessNetworkHealth();

      // Phase 2: Composition analysis
      console.log('👥 Analyzing network composition...');
      analysis.composition = this.analyzeComposition();

      // Phase 3: Cluster detection
      console.log('🎯 Detecting professional clusters...');
      analysis.clusters = this.detectClusters();

      // Phase 4: Referral pathway mapping
      console.log('🔗 Mapping referral pathways...');
      analysis.referral_pathways = this.mapReferralPathways();

      // Phase 5: Growth opportunity identification
      console.log('🚀 Identifying growth opportunities...');
      analysis.growth_opportunities = this.identifyGrowthOpportunities(analysis);

      // Phase 6: Strategic action plan
      console.log('📋 Generating strategic action plan...');
      analysis.action_plan = this.generateNetworkActionPlan(analysis);

      console.log('✅ Network analysis complete!');
      this.displayNetworkSummary(analysis);

      return analysis;
    } catch (error) {
      console.error('🚨 Network analysis failed:', error.message);
      return this.generateFallbackAnalysis();
    }
  }

  async loadNetworkData(dataSource) {
    if (typeof dataSource === 'string') {
      try {
        const raw = await readFile(dataSource, 'utf-8');
        const ext = dataSource.split('.').pop().toLowerCase();

        if (ext === 'json') return JSON.parse(raw);
        if (ext === 'csv') return this.parseCSV(raw);
        return this.parseTextConnections(raw);
      } catch {
        console.warn('⚠️ Could not load file, using sample data for demonstration');
        return this.generateSampleNetwork();
      }
    }
    if (Array.isArray(dataSource)) return dataSource;
    return this.generateSampleNetwork();
  }

  parseCSV(csvContent) {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const connection = {};
      headers.forEach((header, i) => { connection[header] = values[i] || ''; });
      return this.normalizeConnection(connection);
    });
  }

  normalizeConnection(raw) {
    return {
      name: raw.name || raw['first name'] + ' ' + (raw['last name'] || ''),
      company: raw.company || raw.organization || '',
      title: raw.title || raw.position || raw['job title'] || '',
      industry: raw.industry || this.inferIndustry(raw.company, raw.title),
      seniority: raw.seniority || this.inferSeniority(raw.title),
      connection_date: raw.connected_on || raw.connection_date || '',
      last_interaction: raw.last_interaction || null,
      interaction_count: parseInt(raw.interactions || raw.interaction_count) || 0,
      relationship_strength: raw.relationship_strength || this.calculateRelationshipStrength(raw),
      tags: raw.tags ? raw.tags.split(';') : [],
      email: raw.email || '',
      linkedin_url: raw.linkedin_url || raw.profile_url || ''
    };
  }

  generateSampleNetwork() {
    const sampleConnections = [
      { name: 'Sarah Chen', company: 'Google', title: 'PM Lead, Cloud AI', industry: 'Technology', seniority: 'senior', interaction_count: 8, relationship_strength: 0.85 },
      { name: 'Michael Torres', company: 'Google', title: 'Engineering Manager', industry: 'Technology', seniority: 'senior', interaction_count: 3, relationship_strength: 0.55 },
      { name: 'Lisa Park', company: 'Google', title: 'Director of Product', industry: 'Technology', seniority: 'director', interaction_count: 1, relationship_strength: 0.3 },
      { name: 'Alex Kim', company: 'Stripe', title: 'Senior PM', industry: 'Fintech', seniority: 'senior', interaction_count: 12, relationship_strength: 0.92 },
      { name: 'James Wright', company: 'Google', title: 'PM, Google AI', industry: 'Technology', seniority: 'mid', interaction_count: 0, relationship_strength: 0.1 },
      { name: 'Rachel Nguyen', company: 'Google', title: 'Technical Recruiter', industry: 'Technology', seniority: 'mid', interaction_count: 2, relationship_strength: 0.45 },
      { name: 'David Martinez', company: 'Anthropic', title: 'Product Lead', industry: 'AI', seniority: 'senior', interaction_count: 5, relationship_strength: 0.72 },
      { name: 'Emma Thompson', company: 'OpenAI', title: 'PM, ChatGPT', industry: 'AI', seniority: 'senior', interaction_count: 4, relationship_strength: 0.68 },
      { name: 'Kevin Lee', company: 'Meta', title: 'Group PM', industry: 'Technology', seniority: 'senior', interaction_count: 6, relationship_strength: 0.75 },
      { name: 'Ana Rodriguez', company: 'Meta', title: 'Engineering Director', industry: 'Technology', seniority: 'director', interaction_count: 2, relationship_strength: 0.4 },
      { name: 'Chris Patel', company: 'Amazon', title: 'Principal PM', industry: 'Technology', seniority: 'principal', interaction_count: 7, relationship_strength: 0.8 },
      { name: 'Priya Sharma', company: 'Microsoft', title: 'Senior PM, Azure AI', industry: 'Technology', seniority: 'senior', interaction_count: 3, relationship_strength: 0.6 },
      { name: 'Tom Zhang', company: 'Databricks', title: 'Head of Product', industry: 'Data/AI', seniority: 'vp', interaction_count: 4, relationship_strength: 0.65 },
      { name: 'Maria Garcia', company: 'Y Combinator', title: 'Partner', industry: 'Venture Capital', seniority: 'partner', interaction_count: 2, relationship_strength: 0.5 },
      { name: 'Ryan O\'Brien', company: 'Sequoia Capital', title: 'Talent Partner', industry: 'Venture Capital', seniority: 'senior', interaction_count: 1, relationship_strength: 0.35 },
    ];

    // Expand with generated connections to simulate larger network
    const industries = ['Technology', 'AI', 'Fintech', 'Healthcare', 'SaaS', 'E-commerce'];
    const seniorities = ['junior', 'mid', 'senior', 'director', 'vp', 'c-suite'];
    const companies = ['Apple', 'Netflix', 'Airbnb', 'Uber', 'Notion', 'Figma', 'Slack', 'Zoom', 'Coinbase', 'Robinhood'];

    for (let i = 0; i < 50; i++) {
      sampleConnections.push({
        name: `Connection ${i + 16}`,
        company: companies[i % companies.length],
        title: `${seniorities[i % seniorities.length].charAt(0).toUpperCase() + seniorities[i % seniorities.length].slice(1)} Professional`,
        industry: industries[i % industries.length],
        seniority: seniorities[i % seniorities.length],
        interaction_count: Math.floor(Math.random() * 10),
        relationship_strength: Math.random() * 0.8 + 0.1
      });
    }

    return sampleConnections;
  }

  assessNetworkHealth() {
    const total = this.connections.length;
    const active = this.connections.filter(c => c.interaction_count >= 2).length;
    const strong = this.connections.filter(c => c.relationship_strength >= 0.7).length;
    const dormant = this.connections.filter(c => c.interaction_count === 0).length;

    const diversityScore = this.calculateDiversityScore();
    const seniorityScore = this.calculateSeniorityScore();
    const engagementScore = total > 0 ? (active / total) : 0;

    const overallScore = Math.round(
      (diversityScore * 0.25 + seniorityScore * 0.25 + engagementScore * 0.3 + (strong / Math.max(total, 1)) * 0.2) * 100
    );

    return {
      overall_score: overallScore,
      total_connections: total,
      active_connections: active,
      strong_relationships: strong,
      dormant_connections: dormant,
      engagement_rate: Math.round(engagementScore * 100),
      diversity_score: Math.round(diversityScore * 100),
      seniority_score: Math.round(seniorityScore * 100),
      health_rating: overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : overallScore >= 40 ? 'Fair' : 'Needs Improvement'
    };
  }

  analyzeComposition() {
    const byIndustry = this.groupBy(this.connections, 'industry');
    const bySeniority = this.groupBy(this.connections, 'seniority');
    const byCompany = this.groupBy(this.connections, 'company');

    return {
      industry_distribution: this.calculateDistribution(byIndustry),
      seniority_distribution: this.calculateDistribution(bySeniority),
      top_companies: this.getTopEntries(byCompany, 10),
      strategic_connections: this.connections.filter(c => c.relationship_strength >= 0.7).length,
      hiring_access: this.connections.filter(c =>
        c.title.toLowerCase().includes('recruiter') ||
        c.title.toLowerCase().includes('hiring') ||
        c.title.toLowerCase().includes('talent')
      ).length
    };
  }

  detectClusters() {
    const clusters = {};

    // Industry-based clusters
    const industryGroups = this.groupBy(this.connections, 'industry');
    for (const [industry, connections] of Object.entries(industryGroups)) {
      if (connections.length >= 3) {
        clusters[`${industry}_cluster`] = {
          name: `${industry} Network`,
          size: connections.length,
          avg_strength: this.averageStrength(connections),
          key_members: connections
            .sort((a, b) => b.relationship_strength - a.relationship_strength)
            .slice(0, 5)
            .map(c => ({ name: c.name, company: c.company, title: c.title, strength: c.relationship_strength })),
          growth_potential: connections.length < 10 ? 'High' : connections.length < 25 ? 'Medium' : 'Maintain'
        };
      }
    }

    // Company-based clusters
    const companyGroups = this.groupBy(this.connections, 'company');
    for (const [company, connections] of Object.entries(companyGroups)) {
      if (connections.length >= 2) {
        clusters[`${company}_team`] = {
          name: `${company} Connections`,
          size: connections.length,
          avg_strength: this.averageStrength(connections),
          referral_potential: this.calculateReferralPotential(connections),
          key_members: connections
            .sort((a, b) => b.relationship_strength - a.relationship_strength)
            .slice(0, 3)
            .map(c => ({ name: c.name, title: c.title, strength: c.relationship_strength }))
        };
      }
    }

    return clusters;
  }

  mapReferralPathways(targetCompanies = ['Google', 'Anthropic', 'OpenAI', 'Meta', 'Apple']) {
    const pathways = {};

    for (const company of targetCompanies) {
      const directConnections = this.connections.filter(c =>
        c.company.toLowerCase() === company.toLowerCase()
      );

      const strongDirect = directConnections.filter(c => c.relationship_strength >= 0.6);
      const weakDirect = directConnections.filter(c => c.relationship_strength < 0.6);

      // Find bridge connections (people who know someone at the target)
      const bridgeConnections = this.findBridgeConnections(company, directConnections);

      pathways[company] = {
        direct_connections: directConnections.length,
        strong_direct: strongDirect.map(c => ({
          name: c.name,
          title: c.title,
          strength: c.relationship_strength,
          referral_likelihood: Math.round(c.relationship_strength * 100),
          recommended_approach: this.recommendApproach(c)
        })),
        weak_direct: weakDirect.map(c => ({
          name: c.name,
          title: c.title,
          strength: c.relationship_strength,
          reactivation_strategy: this.suggestReactivation(c)
        })),
        bridge_connections: bridgeConnections,
        recommended_sequence: this.generateOutreachSequence(strongDirect, weakDirect, bridgeConnections)
      };
    }

    return pathways;
  }

  identifyGrowthOpportunities(analysis) {
    const opportunities = {
      reactivation_candidates: [],
      expansion_targets: [],
      engagement_improvements: [],
      strategic_gaps: []
    };

    // Dormant connections worth reactivating
    opportunities.reactivation_candidates = this.connections
      .filter(c => c.interaction_count === 0 && c.relationship_strength > 0 &&
                   (c.seniority === 'senior' || c.seniority === 'director' || c.seniority === 'vp'))
      .sort((a, b) => b.relationship_strength - a.relationship_strength)
      .slice(0, 10)
      .map(c => ({ name: c.name, company: c.company, title: c.title, value: 'High-value dormant connection' }));

    // Industry gaps to fill
    const industryDist = analysis.composition.industry_distribution;
    const underrepresented = Object.entries(industryDist)
      .filter(([_, pct]) => pct < 10)
      .map(([industry]) => industry);

    opportunities.strategic_gaps = underrepresented.map(industry => ({
      gap: `${industry} industry connections`,
      recommendation: `Add 10-15 connections in ${industry}`,
      value: 'Expands career opportunity reach'
    }));

    // Seniority gaps
    const seniorConnections = this.connections.filter(c =>
      ['director', 'vp', 'c-suite', 'partner'].includes(c.seniority)
    ).length;

    if (seniorConnections < this.connections.length * 0.15) {
      opportunities.strategic_gaps.push({
        gap: 'Senior leadership connections',
        recommendation: 'Increase director+ connections by 50%',
        value: 'Access to decision-makers and mentorship'
      });
    }

    return opportunities;
  }

  generateNetworkActionPlan(analysis) {
    return {
      immediate: [
        { action: 'Optimize LinkedIn profile for target role positioning', timeline: '1 week', impact: 'High' },
        { action: 'Send personalized outreach to top 3 referral candidates', timeline: '3 days', impact: 'High' },
        { action: 'Engage with 5 industry leader posts this week', timeline: '1 week', impact: 'Medium' }
      ],
      short_term: [
        { action: 'Reactivate top 10 dormant senior connections', timeline: '2 weeks', impact: 'High' },
        { action: 'Request 3 warm introductions to target companies', timeline: '2 weeks', impact: 'High' },
        { action: 'Schedule 2 informational interviews', timeline: '3 weeks', impact: 'Medium' }
      ],
      ongoing: [
        { action: 'Publish thought leadership content 2x per week', timeline: 'Ongoing', impact: 'High' },
        { action: 'Maintain weekly outreach cadence of 3-5 messages', timeline: 'Ongoing', impact: 'High' },
        { action: 'Attend 1 industry event per month', timeline: 'Monthly', impact: 'Medium' }
      ],
      success_metrics: {
        outreach_response_rate: '40%+ target',
        meetings_per_month: '4+ informational interviews',
        referrals_per_quarter: '2+ activated referrals',
        profile_views_growth: '+50% within 30 days',
        content_engagement: '3%+ average engagement rate'
      }
    };
  }

  // Utility methods
  findBridgeConnections(targetCompany, directConnections) {
    // Identify connections who might know people at the target company
    return this.connections
      .filter(c => c.company !== targetCompany && c.relationship_strength >= 0.7)
      .slice(0, 5)
      .map(c => ({
        bridge: c.name,
        bridge_company: c.company,
        strength: c.relationship_strength,
        introduction_likelihood: Math.round(c.relationship_strength * 80)
      }));
  }

  recommendApproach(connection) {
    if (connection.relationship_strength >= 0.8) return 'Direct referral request with specific role';
    if (connection.relationship_strength >= 0.6) return 'Reconnect with value-add, then request';
    if (connection.relationship_strength >= 0.4) return 'Warm up with engagement, then ask';
    return 'Build relationship first through mutual value';
  }

  suggestReactivation(connection) {
    if (connection.interaction_count >= 1) return 'Reference previous interaction, share relevant insight';
    return 'New connection approach with shared context or mutual interest';
  }

  generateOutreachSequence(strong, weak, bridges) {
    const sequence = [];
    let week = 1;

    strong.forEach(c => {
      sequence.push({ week: week, contact: c.name, action: 'Direct referral outreach', priority: 'High' });
      week++;
    });

    bridges.slice(0, 2).forEach(b => {
      sequence.push({ week: week, contact: b.bridge, action: 'Request warm introduction', priority: 'Medium' });
    });

    weak.slice(0, 2).forEach(c => {
      sequence.push({ week: week + 1, contact: c.name, action: 'Reactivation outreach', priority: 'Medium' });
    });

    return sequence;
  }

  calculateDiversityScore() {
    const industries = new Set(this.connections.map(c => c.industry));
    return Math.min(industries.size / 6, 1.0);
  }

  calculateSeniorityScore() {
    const seniorPlus = this.connections.filter(c =>
      ['senior', 'director', 'vp', 'c-suite', 'partner', 'principal'].includes(c.seniority)
    ).length;
    return Math.min(seniorPlus / (this.connections.length * 0.3), 1.0);
  }

  calculateReferralPotential(connections) {
    const avgStrength = this.averageStrength(connections);
    if (avgStrength >= 0.7) return 'High';
    if (avgStrength >= 0.5) return 'Medium';
    return 'Low';
  }

  averageStrength(connections) {
    if (connections.length === 0) return 0;
    return connections.reduce((sum, c) => sum + c.relationship_strength, 0) / connections.length;
  }

  groupBy(arr, key) {
    return arr.reduce((acc, item) => {
      const group = item[key] || 'Unknown';
      acc[group] = acc[group] || [];
      acc[group].push(item);
      return acc;
    }, {});
  }

  calculateDistribution(groups) {
    const total = Object.values(groups).reduce((sum, g) => sum + g.length, 0);
    const dist = {};
    for (const [key, group] of Object.entries(groups)) {
      dist[key] = Math.round((group.length / total) * 100);
    }
    return dist;
  }

  getTopEntries(groups, limit) {
    return Object.entries(groups)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, limit)
      .map(([key, group]) => ({ name: key, count: group.length }));
  }

  inferIndustry(company, title) {
    const techCompanies = ['google', 'meta', 'apple', 'amazon', 'microsoft', 'netflix'];
    if (techCompanies.some(tc => (company || '').toLowerCase().includes(tc))) return 'Technology';
    if ((title || '').toLowerCase().includes('ai') || (title || '').toLowerCase().includes('ml')) return 'AI';
    return 'Other';
  }

  inferSeniority(title) {
    const t = (title || '').toLowerCase();
    if (t.includes('chief') || t.includes('ceo') || t.includes('cto') || t.includes('cpo')) return 'c-suite';
    if (t.includes('vp') || t.includes('vice president')) return 'vp';
    if (t.includes('director') || t.includes('head of')) return 'director';
    if (t.includes('principal') || t.includes('staff')) return 'principal';
    if (t.includes('senior') || t.includes('lead')) return 'senior';
    if (t.includes('junior') || t.includes('associate')) return 'junior';
    return 'mid';
  }

  calculateRelationshipStrength(raw) {
    let score = 0.3;
    if (raw.interaction_count > 5) score += 0.3;
    else if (raw.interaction_count > 2) score += 0.2;
    else if (raw.interaction_count > 0) score += 0.1;
    return Math.min(score + Math.random() * 0.3, 1.0);
  }

  displayNetworkSummary(analysis) {
    const health = analysis.network_health;
    console.log(`
🕸️ NETWORK INTELLIGENCE SUMMARY
================================

📊 Network Health Score: ${health.overall_score}/100 (${health.health_rating})
👥 Total Connections: ${health.total_connections}
⚡ Active: ${health.active_connections} (${health.engagement_rate}%)
💪 Strong Relationships: ${health.strong_relationships}
💤 Dormant: ${health.dormant_connections}

🎯 Top Referral Targets:
${Object.entries(analysis.referral_pathways).slice(0, 3).map(([company, data]) =>
  `• ${company}: ${data.direct_connections} direct, ${data.strong_direct.length} strong`
).join('\n')}

🚀 Priority Actions:
${analysis.action_plan.immediate.slice(0, 3).map(a => `• ${a.action}`).join('\n')}
`);
  }

  generateFallbackAnalysis() {
    return {
      fallback: true,
      message: 'Network analysis requires connection data — import from LinkedIn CSV or enter manually',
      basic_recommendations: [
        'Export your LinkedIn connections as CSV for full analysis',
        'Focus on building 10-15 strategic connections in target industry',
        'Engage weekly with industry content for visibility',
        'Request informational interviews with 2-3 target company employees'
      ]
    };
  }
}

// CLI interface
async function runNetworkAnalysis() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help') {
    console.log(`
🕸️ Network Analyzer

Usage:
  bun network-analyzer.js analyze [connections-file]
  bun network-analyzer.js referrals [connections-file] [target-company]
  bun network-analyzer.js health [connections-file]
  bun network-analyzer.js demo

Examples:
  bun network-analyzer.js analyze connections.csv
  bun network-analyzer.js referrals connections.json "Google"
  bun network-analyzer.js health connections.csv
  bun network-analyzer.js demo
`);
    return;
  }

  const analyzer = new NetworkAnalyzer();

  try {
    switch (command) {
      case 'analyze':
      case 'demo':
        const dataFile = args[1];
        const analysis = await analyzer.analyzeNetwork(dataFile);
        await writeFile(`network_analysis_${Date.now()}.json`, JSON.stringify(analysis, null, 2));
        break;

      case 'referrals':
        const refFile = args[1];
        const target = args[2] || 'Google';
        const refAnalysis = await analyzer.analyzeNetwork(refFile);
        console.log(`\n🔗 Referral Pathways to ${target}:`);
        const pathways = refAnalysis.referral_pathways[target];
        if (pathways) {
          console.log(`Direct: ${pathways.direct_connections} connections`);
          console.log(`Strong: ${pathways.strong_direct.length} high-confidence referrals`);
          pathways.strong_direct.forEach(c => {
            console.log(`  • ${c.name} (${c.title}) — ${c.referral_likelihood}% likelihood`);
          });
        } else {
          console.log('No direct connections found — consider bridge connections');
        }
        break;

      case 'health':
        const healthFile = args[1];
        const healthAnalysis = await analyzer.analyzeNetwork(healthFile);
        console.log(`\n📊 Network Health: ${healthAnalysis.network_health.overall_score}/100`);
        break;

      default:
        console.error(`❌ Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error(`🚨 Network analysis failed: ${error.message}`);
    process.exit(1);
  }
}

export { NetworkAnalyzer };

if (import.meta.main) {
  runNetworkAnalysis();
}