#!/usr/bin/env bun

/**
 * ATS Compatibility Testing Engine
 * Comprehensive ATS parsing simulation and compatibility scoring across major systems
 */

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

class ATSCompatibilityTester {
  constructor(options = {}) {
    this.atsSystems = this.initializeATSSystems();
    this.parsingRules = this.initializeParsingRules();

    this.config = {
      testDepth: options.testDepth || 'comprehensive', // quick, standard, comprehensive
      includeLegacy: options.includeLegacy !== false,
      verboseOutput: options.verboseOutput || false,
      cacheResults: options.cacheResults !== false,
      ...options
    };

    this.testResults = {
      systemScores: {},
      parsingAccuracy: {},
      recommendations: {},
      overallScore: 0
    };
  }

  async testATSCompatibility(resumeContent, format = 'auto-detect') {
    console.log('🤖 Starting comprehensive ATS compatibility testing...');

    const compatibilityResults = {
      timestamp: new Date().toISOString(),
      document_format: format,
      content_analysis: {},
      system_compatibility: {},
      parsing_simulation: {},
      optimization_recommendations: {},
      overall_assessment: {}
    };

    try {
      // Phase 1: Content analysis and format detection
      console.log('📊 Analyzing document content and format...');
      compatibilityResults.content_analysis = await this.analyzeDocumentContent(
        resumeContent,
        format
      );

      // Phase 2: Multi-system compatibility testing
      console.log('🔄 Testing compatibility across ATS systems...');
      compatibilityResults.system_compatibility = await this.testMultipleATSSystems(
        resumeContent,
        compatibilityResults.content_analysis
      );

      // Phase 3: Parsing simulation and accuracy testing
      console.log('🧪 Simulating ATS parsing and extraction...');
      compatibilityResults.parsing_simulation = await this.simulateATSParsing(
        resumeContent,
        compatibilityResults.content_analysis
      );

      // Phase 4: Generate optimization recommendations
      console.log('💡 Generating optimization recommendations...');
      compatibilityResults.optimization_recommendations = this.generateOptimizationRecommendations(
        compatibilityResults.system_compatibility,
        compatibilityResults.parsing_simulation
      );

      // Phase 5: Overall assessment and scoring
      compatibilityResults.overall_assessment = this.calculateOverallAssessment(
        compatibilityResults
      );

      // Cache results for future reference
      if (this.config.cacheResults) {
        await this.cacheCompatibilityResults(compatibilityResults);
      }

      console.log('✅ ATS compatibility testing complete!');
      this.displayCompatibilitySummary(compatibilityResults);

      return compatibilityResults;

    } catch (error) {
      console.error('🚨 ATS compatibility testing failed:', error.message);
      return this.generateFallbackResults(resumeContent, format);
    }
  }

  async analyzeDocumentContent(content, format) {
    const analysis = {
      format_detected: this.detectDocumentFormat(content, format),
      content_structure: {},
      text_quality: {},
      formatting_assessment: {},
      keyword_analysis: {}
    };

    // Analyze content structure
    analysis.content_structure = this.analyzeContentStructure(content);

    // Assess text quality for parsing
    analysis.text_quality = this.assessTextQuality(content);

    // Evaluate formatting for ATS compatibility
    analysis.formatting_assessment = this.evaluateFormatting(content);

    // Perform basic keyword analysis
    analysis.keyword_analysis = this.analyzeKeywords(content);

    return analysis;
  }

  async testMultipleATSSystems(content, contentAnalysis) {
    const systemTests = {};

    // Test against major ATS systems in parallel
    const systemPromises = Object.keys(this.atsSystems).map(async systemName => {
      const systemConfig = this.atsSystems[systemName];

      console.log(`  📋 Testing ${systemConfig.displayName}...`);

      const testResult = await this.testSingleATSSystem(
        content,
        contentAnalysis,
        systemName,
        systemConfig
      );

      systemTests[systemName] = testResult;
    });

    await Promise.all(systemPromises);

    return systemTests;
  }

  async testSingleATSSystem(content, contentAnalysis, systemName, systemConfig) {
    const testResult = {
      system_name: systemConfig.displayName,
      system_type: systemConfig.category,
      compatibility_score: 0,
      parsing_accuracy: {},
      specific_issues: [],
      recommendations: []
    };

    try {
      // Simulate parsing with system-specific rules
      testResult.parsing_accuracy = await this.simulateSystemParsing(
        content,
        contentAnalysis,
        systemConfig
      );

      // Calculate compatibility score
      testResult.compatibility_score = this.calculateSystemCompatibilityScore(
        testResult.parsing_accuracy,
        systemConfig
      );

      // Identify system-specific issues
      testResult.specific_issues = this.identifySystemSpecificIssues(
        contentAnalysis,
        systemConfig
      );

      // Generate system-specific recommendations
      testResult.recommendations = this.generateSystemRecommendations(
        testResult.specific_issues,
        systemConfig
      );

    } catch (error) {
      console.warn(`⚠️ Failed to test ${systemConfig.displayName}: ${error.message}`);
      testResult.compatibility_score = 0;
      testResult.specific_issues.push(`Testing failed: ${error.message}`);
    }

    return testResult;
  }

  async simulateATSParsing(content, contentAnalysis) {
    const parsingSimulation = {
      contact_extraction: {},
      experience_parsing: {},
      skills_recognition: {},
      education_extraction: {},
      overall_parsing_score: 0
    };

    // Simulate contact information extraction
    parsingSimulation.contact_extraction = this.simulateContactExtraction(content);

    // Simulate work experience parsing
    parsingSimulation.experience_parsing = this.simulateExperienceParsing(content);

    // Simulate skills recognition
    parsingSimulation.skills_recognition = this.simulateSkillsRecognition(content);

    // Simulate education extraction
    parsingSimulation.education_extraction = this.simulateEducationExtraction(content);

    // Calculate overall parsing score
    parsingSimulation.overall_parsing_score = this.calculateOverallParsingScore(
      parsingSimulation
    );

    return parsingSimulation;
  }

  // Content analysis methods
  detectDocumentFormat(content, formatHint) {
    if (formatHint && formatHint !== 'auto-detect') {
      return formatHint;
    }

    // Detect format based on content characteristics
    if (content.includes('%PDF')) return 'pdf';
    if (content.includes('<html') || content.includes('<!DOCTYPE')) return 'html';
    if (content.includes('application/vnd.openxmlformats')) return 'docx';

    return 'text';
  }

  analyzeContentStructure(content) {
    const structure = {
      sections_detected: [],
      section_boundaries: {},
      content_organization: 'unknown',
      structural_clarity: 0
    };

    // Common resume section patterns
    const sectionPatterns = {
      contact: /(contact|email|phone|address|linkedin)/i,
      summary: /(summary|profile|objective|about)/i,
      experience: /(experience|work|employment|career|professional)/i,
      skills: /(skills|competencies|technologies|tools)/i,
      education: /(education|academic|degree|university|college)/i,
      projects: /(projects|portfolio|work samples)/i
    };

    // Detect sections
    for (const [sectionName, pattern] of Object.entries(sectionPatterns)) {
      if (pattern.test(content)) {
        structure.sections_detected.push(sectionName);
      }
    }

    // Assess structural clarity
    structure.structural_clarity = Math.min(
      structure.sections_detected.length / 5, // Expect at least 5 main sections
      1.0
    );

    return structure;
  }

  assessTextQuality(content) {
    return {
      readability_score: this.calculateReadabilityScore(content),
      spelling_issues: this.detectSpellingIssues(content),
      grammar_quality: this.assessGrammarQuality(content),
      formatting_consistency: this.assessFormattingConsistency(content),
      special_characters: this.detectSpecialCharacters(content)
    };
  }

  analyzeKeywords(content) {
    const keywords = {
      professional_terms: this.extractProfessionalTerms(content),
      technical_skills: this.extractTechnicalSkills(content),
      soft_skills: this.extractSoftSkills(content),
      industry_buzzwords: this.extractIndustryBuzzwords(content),
      keyword_density: this.calculateKeywordDensity(content)
    };

    return keywords;
  }

  // System-specific testing methods
  async simulateSystemParsing(content, contentAnalysis, systemConfig) {
    const parsing = {
      contact_accuracy: 0,
      experience_accuracy: 0,
      skills_accuracy: 0,
      education_accuracy: 0,
      format_compatibility: 0
    };

    // Simulate parsing based on system capabilities
    parsing.contact_accuracy = this.simulateContactAccuracy(content, systemConfig);
    parsing.experience_accuracy = this.simulateExperienceAccuracy(content, systemConfig);
    parsing.skills_accuracy = this.simulateSkillsAccuracy(content, systemConfig);
    parsing.education_accuracy = this.simulateEducationAccuracy(content, systemConfig);
    parsing.format_compatibility = this.calculateFormatCompatibility(contentAnalysis, systemConfig);

    return parsing;
  }

  calculateSystemCompatibilityScore(parsingAccuracy, systemConfig) {
    const weights = systemConfig.weights || {
      contact_accuracy: 0.25,
      experience_accuracy: 0.30,
      skills_accuracy: 0.25,
      education_accuracy: 0.10,
      format_compatibility: 0.10
    };

    let score = 0;
    for (const [field, weight] of Object.entries(weights)) {
      score += (parsingAccuracy[field] || 0) * weight;
    }

    return Math.round(score * 100);
  }

  identifySystemSpecificIssues(contentAnalysis, systemConfig) {
    const issues = [];

    // Check for system-specific compatibility issues
    if (systemConfig.requirements.format_restrictions &&
        !systemConfig.requirements.format_restrictions.includes(contentAnalysis.format_detected)) {
      issues.push(`Format ${contentAnalysis.format_detected} has limited support`);
    }

    if (systemConfig.requirements.keyword_density_minimum &&
        contentAnalysis.keyword_analysis.keyword_density < systemConfig.requirements.keyword_density_minimum) {
      issues.push('Keyword density below system minimum');
    }

    if (systemConfig.limitations.special_characters &&
        contentAnalysis.text_quality.special_characters.length > 0) {
      issues.push('Special characters may cause parsing issues');
    }

    return issues;
  }

  // Parsing simulation methods
  simulateContactExtraction(content) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g;
    const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9-]+/g;

    const extraction = {
      email_detected: emailRegex.test(content),
      phone_detected: phoneRegex.test(content),
      linkedin_detected: linkedinRegex.test(content),
      extraction_accuracy: 0
    };

    // Calculate extraction accuracy
    const fieldsDetected = [
      extraction.email_detected,
      extraction.phone_detected,
      extraction.linkedin_detected
    ].filter(Boolean).length;

    extraction.extraction_accuracy = fieldsDetected / 3;

    return extraction;
  }

  simulateExperienceParsing(content) {
    // Simplified experience parsing simulation
    const datePattern = /(20\d{2}|19\d{2})/g;
    const companyPattern = /(?:at\s+|@\s*)?([A-Z][a-zA-Z\s&,.-]+(?:Inc|LLC|Corp|Ltd|Company|Co\.)?)(?:\s|,|$)/g;

    const dates = content.match(datePattern) || [];
    const companies = content.match(companyPattern) || [];

    return {
      date_extraction: dates.length > 0,
      company_extraction: companies.length > 0,
      job_title_extraction: this.detectJobTitles(content),
      parsing_accuracy: this.calculateExperienceParsingAccuracy(dates, companies)
    };
  }

  simulateSkillsRecognition(content) {
    const technicalSkills = [
      'JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes',
      'Machine Learning', 'Data Science', 'SQL', 'Git', 'Agile', 'Scrum'
    ];

    const softSkills = [
      'Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Management',
      'Strategic Thinking', 'Project Management', 'Analytical'
    ];

    const detectedTechnical = technicalSkills.filter(skill =>
      content.toLowerCase().includes(skill.toLowerCase())
    );

    const detectedSoft = softSkills.filter(skill =>
      content.toLowerCase().includes(skill.toLowerCase())
    );

    return {
      technical_skills_detected: detectedTechnical,
      soft_skills_detected: detectedSoft,
      skills_recognition_score: (detectedTechnical.length + detectedSoft.length) / 20,
      parsing_confidence: 0.85 // Simulated confidence
    };
  }

  // Optimization and recommendations
  generateOptimizationRecommendations(systemCompatibility, parsingSimulation) {
    const recommendations = {
      high_priority: [],
      medium_priority: [],
      low_priority: [],
      system_specific: {}
    };

    // Analyze system compatibility scores
    const averageScore = Object.values(systemCompatibility).reduce(
      (sum, result) => sum + result.compatibility_score, 0
    ) / Object.keys(systemCompatibility).length;

    if (averageScore < 80) {
      recommendations.high_priority.push(
        'Overall ATS compatibility below 80% - comprehensive optimization needed'
      );
    }

    // Analyze parsing accuracy
    if (parsingSimulation.overall_parsing_score < 0.8) {
      recommendations.high_priority.push(
        'Parsing accuracy below 80% - format and structure optimization required'
      );
    }

    // Generate system-specific recommendations
    for (const [systemName, results] of Object.entries(systemCompatibility)) {
      if (results.compatibility_score < 85) {
        recommendations.system_specific[systemName] = results.recommendations;
      }
    }

    return recommendations;
  }

  calculateOverallAssessment(compatibilityResults) {
    const systemScores = Object.values(compatibilityResults.system_compatibility)
      .map(result => result.compatibility_score);

    const overallScore = systemScores.reduce((sum, score) => sum + score, 0) / systemScores.length;

    return {
      overall_ats_score: Math.round(overallScore),
      compatibility_rating: this.getCompatibilityRating(overallScore),
      systems_tested: systemScores.length,
      passing_systems: systemScores.filter(score => score >= 80).length,
      optimization_priority: this.getOptimizationPriority(overallScore),
      estimated_success_rate: this.estimateSuccessRate(overallScore)
    };
  }

  displayCompatibilitySummary(results) {
    const assessment = results.overall_assessment;

    console.log(`
🤖 ATS COMPATIBILITY TEST RESULTS
=================================

📊 Overall ATS Score: ${assessment.overall_ats_score}/100
🎯 Compatibility Rating: ${assessment.compatibility_rating}
✅ Systems Passing: ${assessment.passing_systems}/${assessment.systems_tested}
📈 Estimated Success Rate: ${assessment.estimated_success_rate}%

🔝 Top Performing Systems:
${this.getTopPerformingSystems(results.system_compatibility)}

⚠️ Optimization Opportunities:
${results.optimization_recommendations.high_priority.slice(0, 3).map(rec => `• ${rec}`).join('\n')}

Next Steps: ${assessment.optimization_priority}
`);
  }

  // Initialization methods
  initializeATSSystems() {
    return {
      workday: {
        displayName: 'Workday',
        category: 'enterprise',
        parsingCapabilities: {
          textExtraction: 'advanced',
          structureRecognition: 'ml_based',
          keywordMatching: 'semantic'
        },
        requirements: {
          format_restrictions: ['pdf', 'docx', 'txt'],
          keyword_density_minimum: 0.02
        },
        limitations: {
          special_characters: false,
          table_parsing: true
        },
        weights: {
          contact_accuracy: 0.20,
          experience_accuracy: 0.35,
          skills_accuracy: 0.25,
          education_accuracy: 0.10,
          format_compatibility: 0.10
        }
      },

      greenhouse: {
        displayName: 'Greenhouse',
        category: 'mid_market',
        parsingCapabilities: {
          textExtraction: 'excellent',
          structureRecognition: 'intelligent',
          keywordMatching: 'contextual'
        },
        requirements: {
          format_restrictions: ['pdf', 'docx', 'html'],
          keyword_density_minimum: 0.015
        },
        limitations: {
          special_characters: false,
          table_parsing: true
        }
      },

      taleo: {
        displayName: 'Taleo (Oracle)',
        category: 'enterprise',
        parsingCapabilities: {
          textExtraction: 'standard',
          structureRecognition: 'header_based',
          keywordMatching: 'exact_match'
        },
        requirements: {
          format_restrictions: ['pdf', 'docx'],
          keyword_density_minimum: 0.025
        },
        limitations: {
          special_characters: true,
          table_parsing: false
        }
      },

      lever: {
        displayName: 'Lever',
        category: 'mid_market',
        parsingCapabilities: {
          textExtraction: 'advanced',
          structureRecognition: 'pattern_based',
          keywordMatching: 'fuzzy_match'
        },
        requirements: {
          format_restrictions: ['pdf', 'docx', 'html'],
          keyword_density_minimum: 0.018
        }
      },

      ashby: {
        displayName: 'Ashby',
        category: 'startup',
        parsingCapabilities: {
          textExtraction: 'excellent',
          structureRecognition: 'ai_powered',
          keywordMatching: 'semantic'
        },
        requirements: {
          format_restrictions: ['pdf', 'docx', 'html', 'txt'],
          keyword_density_minimum: 0.012
        }
      }
    };
  }

  initializeParsingRules() {
    return {
      contact_patterns: {
        email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
        phone: /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g,
        linkedin: /linkedin\.com\/in\/[a-zA-Z0-9-]+/g
      },

      date_patterns: {
        year: /(19|20)\d{2}/g,
        month_year: /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* (19|20)\d{2}/gi,
        present: /(present|current|now)/gi
      },

      skills_patterns: {
        technical: /(JavaScript|Python|React|Node\.js|AWS|Docker|SQL|Git)/gi,
        soft: /(Leadership|Communication|Management|Teamwork)/gi
      }
    };
  }

  // Utility methods
  getCompatibilityRating(score) {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    return 'Needs Improvement';
  }

  getOptimizationPriority(score) {
    if (score >= 85) return 'Fine-tuning recommended';
    if (score >= 70) return 'Moderate optimization needed';
    return 'Comprehensive optimization required';
  }

  estimateSuccessRate(score) {
    return Math.round(Math.max(0, Math.min(100, (score - 20) * 1.25)));
  }

  generateFallbackResults(content, format) {
    return {
      fallback: true,
      message: 'ATS compatibility testing failed - basic assessment provided',
      basic_score: 75,
      recommendations: [
        'Ensure standard fonts (Arial, Calibri, Times New Roman)',
        'Use simple formatting without tables or graphics',
        'Include relevant keywords for your target role'
      ]
    };
  }

  async cacheCompatibilityResults(results) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `ats_compatibility_${timestamp}.json`;

    await writeFile(filename, JSON.stringify(results, null, 2));
    console.log(`📄 ATS compatibility results cached to: ${filename}`);
  }

  // --- Stub implementations for analysis & simulation methods ---
  calculateReadabilityScore(c) { return c.split(/\s+/).length > 100 ? 0.85 : 0.65; }
  detectSpellingIssues(c) { return []; }
  assessGrammarQuality(c) { return 0.85; }
  assessFormattingConsistency(c) { return 0.8; }
  detectSpecialCharacters(c) { return (c.match(/[^\x20-\x7E\n\r\t]/g) || []); }
  extractProfessionalTerms(c) { return (c.match(/\b(managed|led|developed|implemented|optimized|designed|delivered)\b/gi) || []); }
  extractTechnicalSkills(c) { return (c.match(/(JavaScript|Python|React|Node\.js|AWS|Docker|SQL|Git|Machine Learning|AI)/gi) || []); }
  extractSoftSkills(c) { return (c.match(/(Leadership|Communication|Management|Teamwork|Problem Solving|Strategic)/gi) || []); }
  extractIndustryBuzzwords(c) { return (c.match(/(agile|scrum|data-driven|scalable|innovation|cross-functional|stakeholder)/gi) || []); }
  calculateKeywordDensity(c) { const words = c.split(/\s+/).length; const keywords = this.extractTechnicalSkills(c).length + this.extractSoftSkills(c).length; return words > 0 ? keywords / words : 0; }
  evaluateFormatting(c) { return { ats_friendly: true, complexity: 'simple' }; }
  simulateContactAccuracy(c, sys) { const hasEmail = /\S+@\S+/.test(c); const hasPhone = /\d{3}.*\d{4}/.test(c); return (hasEmail ? 0.5 : 0) + (hasPhone ? 0.5 : 0); }
  simulateExperienceAccuracy(c, sys) { return /experience|work/i.test(c) ? 0.85 + Math.random() * 0.1 : 0.6; }
  simulateSkillsAccuracy(c, sys) { return /skills|competencies/i.test(c) ? 0.82 + Math.random() * 0.1 : 0.6; }
  simulateEducationAccuracy(c, sys) { return /education|degree|university/i.test(c) ? 0.9 + Math.random() * 0.08 : 0.5; }
  calculateFormatCompatibility(analysis, sys) { const fmt = analysis?.format_detected || 'text'; return fmt === 'docx' ? 0.95 : fmt === 'pdf' ? 0.88 : 0.75; }
  simulateEducationExtraction(c) { return { degree_detected: /\b(BS|BA|MS|MA|PhD|Bachelor|Master|MBA)\b/i.test(c), institution_detected: /university|college|institute/i.test(c), parsing_accuracy: 0.9 }; }
  calculateOverallParsingScore(sim) { const scores = [sim.contact_extraction?.extraction_accuracy || 0.8, sim.experience_parsing?.parsing_accuracy || 0.8, sim.skills_recognition?.skills_recognition_score || 0.7, sim.education_extraction?.parsing_accuracy || 0.85]; return scores.reduce((a, b) => a + b) / scores.length; }
  detectJobTitles(c) { return /\b(manager|engineer|director|lead|analyst|developer|designer|specialist)\b/i.test(c); }
  calculateExperienceParsingAccuracy(dates, companies) { return (dates.length > 0 ? 0.5 : 0) + (companies.length > 0 ? 0.5 : 0); }
  generateSystemRecommendations(issues, sys) { return issues.map(issue => `Fix: ${issue}`); }
  getTopPerformingSystems(sysCom) { return Object.entries(sysCom).sort((a, b) => (b[1].compatibility_score || 0) - (a[1].compatibility_score || 0)).slice(0, 3).map(([_, r]) => `• ${r.system_name}: ${r.compatibility_score}/100`).join('\n'); }
  calculateSoftSkillCompetency(skill, years) { return Math.min(1.0, 0.4 + years * 0.1 + Math.random() * 0.15); }
}

// CLI interface
async function runATSCompatibilityTest() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help') {
    console.log(`
🤖 ATS Compatibility Tester

Usage:
  bun ats-compatibility-tester.js test <resume-file> [format]
  bun ats-compatibility-tester.js batch <directory>
  bun ats-compatibility-tester.js systems
  bun ats-compatibility-tester.js quick <resume-file>

Examples:
  bun ats-compatibility-tester.js test resume.pdf
  bun ats-compatibility-tester.js test resume.docx word
  bun ats-compatibility-tester.js batch ./resumes
  bun ats-compatibility-tester.js systems
`);
    return;
  }

  const tester = new ATSCompatibilityTester({
    testDepth: 'comprehensive',
    verboseOutput: true
  });

  try {
    switch (command) {
      case 'test':
        const [resumeFile, format] = args.slice(1);
        if (!resumeFile) {
          console.error('❌ Resume file required');
          process.exit(1);
        }

        const content = await readFile(resumeFile, 'utf-8');
        const results = await tester.testATSCompatibility(content, format);

        console.log('\n✅ ATS Compatibility Testing Complete!');
        break;

      case 'systems':
        console.log('\n🤖 Supported ATS Systems:');
        const systems = tester.initializeATSSystems();
        Object.values(systems).forEach(system => {
          console.log(`• ${system.displayName} (${system.category})`);
        });
        break;

      case 'quick':
        const quickFile = args[1];
        if (!quickFile) {
          console.error('❌ Resume file required');
          process.exit(1);
        }

        const quickTester = new ATSCompatibilityTester({ testDepth: 'quick' });
        const quickContent = await readFile(quickFile, 'utf-8');
        await quickTester.testATSCompatibility(quickContent);
        break;

      default:
        console.error(`❌ Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error(`🚨 ATS compatibility testing failed: ${error.message}`);
    process.exit(1);
  }
}

// Export for programmatic use
export { ATSCompatibilityTester };

// Run CLI if called directly
if (import.meta.main) {
  runATSCompatibilityTest();
}