#!/usr/bin/env bun

/**
 * ATS Validation Engine - Comprehensive Orchestration Pipeline
 * Complete ATS validation workflow combining compatibility testing, format validation, and success tracking
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname, basename, extname } from 'path';
import { ATSCompatibilityTester } from './ats-compatibility-tester.js';
import { FormatValidator } from './format-validator.js';
import { ApplicationTracker } from './application-tracker.js';

class ATSValidationEngine {
  constructor(options = {}) {
    this.compatibilityTester = new ATSCompatibilityTester(options.compatibility);
    this.formatValidator = new FormatValidator(options.format);
    this.applicationTracker = new ApplicationTracker(options.tracking);

    this.config = {
      comprehensive: options.comprehensive !== false,
      parallel: options.parallel !== false,
      cacheResults: options.cacheResults !== false,
      outputFormat: options.outputFormat || 'json',
      verboseOutput: options.verboseOutput || false,
      ...options
    };

    this.validationResults = {
      session_id: this.generateSessionId(),
      timestamp: new Date().toISOString(),
      validations: [],
      summary: {},
      recommendations: {}
    };
  }

  async runCompleteValidation(resumePath, jobDescription = null, targetCompanies = []) {
    console.log('🚀 Starting comprehensive ATS validation pipeline...');

    const validation = {
      session_id: this.validationResults.session_id,
      timestamp: new Date().toISOString(),
      resume_path: resumePath,
      job_description: jobDescription,
      target_companies: targetCompanies,
      validation_results: {},
      optimization_recommendations: {},
      performance_metrics: {}
    };

    try {
      const startTime = Date.now();

      // Initialize application tracker
      await this.applicationTracker.initialize();

      // Phase 1: Document analysis and format validation
      console.log('\n📋 Phase 1: Document Analysis & Format Validation');
      validation.validation_results.format_analysis = await this.runFormatValidation(resumePath);

      // Phase 2: ATS compatibility testing
      console.log('\n🤖 Phase 2: ATS Compatibility Testing');
      validation.validation_results.compatibility_analysis = await this.runCompatibilityTesting(
        resumePath,
        validation.validation_results.format_analysis
      );

      // Phase 3: Keyword optimization analysis (if job description provided)
      if (jobDescription) {
        console.log('\n🎯 Phase 3: Keyword Optimization Analysis');
        validation.validation_results.keyword_analysis = await this.runKeywordAnalysis(
          resumePath,
          jobDescription
        );
      }

      // Phase 4: Success prediction and tracking setup
      console.log('\n📊 Phase 4: Success Prediction & Tracking Setup');
      validation.validation_results.success_prediction = await this.generateSuccessPrediction(
        validation.validation_results
      );

      // Phase 5: Comprehensive optimization recommendations
      console.log('\n💡 Phase 5: Optimization Recommendations Generation');
      validation.optimization_recommendations = this.generateComprehensiveRecommendations(
        validation.validation_results
      );

      // Phase 6: Performance metrics and summary
      validation.performance_metrics = {
        total_validation_time: Date.now() - startTime,
        phases_completed: jobDescription ? 5 : 4,
        overall_score: this.calculateOverallValidationScore(validation.validation_results),
        confidence_level: this.calculateConfidenceLevel(validation.validation_results)
      };

      validation.summary = this.generateValidationSummary(validation);

      // Cache comprehensive results
      if (this.config.cacheResults) {
        await this.cacheValidationResults(validation);
      }

      console.log('\n✅ Comprehensive ATS validation complete!');
      this.displayValidationSummary(validation);

      return validation;

    } catch (error) {
      console.error('🚨 ATS validation pipeline failed:', error.message);
      return this.generateFallbackValidation(resumePath, error);
    }
  }

  async runFormatValidation(resumePath) {
    console.log(`📄 Validating document format: ${basename(resumePath)}`);

    const formatValidation = await this.formatValidator.validateFormat(resumePath);

    return {
      format_detected: formatValidation.format_analysis.detected_format,
      parsing_quality_score: Math.round(formatValidation.parsing_quality.overall_score * 100),
      compatibility_score: formatValidation.compatibility_assessment.compatibility_score,
      text_extraction_quality: formatValidation.parsing_quality.text_clarity,
      structure_recognition: formatValidation.parsing_quality.structure_recognition,
      recommendations: formatValidation.recommendations.implementation_priority.slice(0, 5),
      risk_level: formatValidation.compatibility_assessment.risk_assessment.risk_level
    };
  }

  async runCompatibilityTesting(resumePath, formatAnalysis) {
    console.log('🤖 Running comprehensive ATS compatibility testing...');

    const resumeContent = await readFile(resumePath, 'utf-8');
    const compatibilityResults = await this.compatibilityTester.testATSCompatibility(
      resumeContent,
      formatAnalysis.format_detected
    );

    return {
      overall_ats_score: compatibilityResults.overall_assessment.overall_ats_score,
      systems_tested: compatibilityResults.overall_assessment.systems_tested,
      passing_systems: compatibilityResults.overall_assessment.passing_systems,
      system_breakdown: this.extractSystemScores(compatibilityResults.system_compatibility),
      parsing_accuracy: compatibilityResults.parsing_simulation.overall_parsing_score * 100,
      contact_extraction: compatibilityResults.parsing_simulation.contact_extraction,
      experience_parsing: compatibilityResults.parsing_simulation.experience_parsing,
      skills_recognition: compatibilityResults.parsing_simulation.skills_recognition,
      optimization_opportunities: compatibilityResults.optimization_recommendations.high_priority
    };
  }

  async runKeywordAnalysis(resumePath, jobDescription) {
    console.log('🎯 Analyzing keyword optimization...');

    const resumeContent = await readFile(resumePath, 'utf-8');

    // Simulate keyword analysis (in real implementation, this would use advanced NLP)
    const keywordAnalysis = await this.analyzeKeywordOptimization(resumeContent, jobDescription);

    return keywordAnalysis;
  }

  async analyzeKeywordOptimization(resumeContent, jobDescription) {
    console.log('📊 Performing keyword analysis...');

    const analysis = {
      job_keywords_extracted: this.extractJobKeywords(jobDescription),
      resume_keywords_found: this.extractResumeKeywords(resumeContent),
      keyword_match_score: 0,
      keyword_density_analysis: {},
      missing_keywords: [],
      optimization_suggestions: []
    };

    // Calculate keyword match score
    const jobKeywords = analysis.job_keywords_extracted;
    const resumeKeywords = analysis.resume_keywords_found;

    const matches = jobKeywords.filter(keyword =>
      resumeKeywords.some(rKeyword =>
        rKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(rKeyword.toLowerCase())
      )
    );

    analysis.keyword_match_score = Math.round((matches.length / jobKeywords.length) * 100);

    // Identify missing keywords
    analysis.missing_keywords = jobKeywords.filter(keyword =>
      !resumeKeywords.some(rKeyword =>
        rKeyword.toLowerCase().includes(keyword.toLowerCase())
      )
    ).slice(0, 10); // Top 10 missing keywords

    // Generate optimization suggestions
    analysis.optimization_suggestions = this.generateKeywordOptimizations(
      analysis.missing_keywords,
      resumeContent
    );

    // Keyword density analysis
    analysis.keyword_density_analysis = this.analyzeKeywordDensity(
      resumeContent,
      jobKeywords
    );

    return analysis;
  }

  async generateSuccessPrediction(validationResults) {
    console.log('📈 Generating success prediction metrics...');

    const prediction = {
      estimated_ats_pass_rate: 0,
      estimated_response_rate: 0,
      estimated_interview_rate: 0,
      success_factors: [],
      risk_factors: [],
      confidence_score: 0
    };

    // Calculate ATS pass rate based on compatibility scores
    const avgATSScore = validationResults.compatibility_analysis.overall_ats_score;
    prediction.estimated_ats_pass_rate = Math.min(95, Math.max(20, avgATSScore));

    // Estimate response rate based on multiple factors
    const formatQuality = validationResults.format_analysis.parsing_quality_score;
    const keywordScore = validationResults.keyword_analysis?.keyword_match_score || 75;

    const responseRateFactors = [
      avgATSScore * 0.4,
      formatQuality * 0.3,
      keywordScore * 0.3
    ];

    const baseResponseRate = responseRateFactors.reduce((a, b) => a + b) / 100;
    prediction.estimated_response_rate = Math.round(Math.max(5, Math.min(50, baseResponseRate * 50)));

    // Estimate interview rate (typically 60-80% of response rate)
    prediction.estimated_interview_rate = Math.round(prediction.estimated_response_rate * 0.7);

    // Identify success factors
    prediction.success_factors = this.identifySuccessFactors(validationResults);

    // Identify risk factors
    prediction.risk_factors = this.identifyRiskFactors(validationResults);

    // Calculate confidence score
    prediction.confidence_score = this.calculatePredictionConfidence(validationResults);

    return prediction;
  }

  generateComprehensiveRecommendations(validationResults) {
    console.log('💡 Generating comprehensive optimization recommendations...');

    const recommendations = {
      immediate_actions: [], // Next 24 hours
      format_optimizations: [], // Document format improvements
      content_optimizations: [], // Content and keyword improvements
      ats_specific_fixes: [], // System-specific optimizations
      success_maximization: [], // Long-term success strategies
      implementation_priority: [] // Prioritized action plan
    };

    // Immediate actions (critical issues)
    recommendations.immediate_actions = this.generateImmediateActions(validationResults);

    // Format optimizations
    recommendations.format_optimizations = validationResults.format_analysis.recommendations;

    // Content optimizations
    if (validationResults.keyword_analysis) {
      recommendations.content_optimizations = validationResults.keyword_analysis.optimization_suggestions;
    }

    // ATS-specific fixes
    recommendations.ats_specific_fixes = validationResults.compatibility_analysis.optimization_opportunities;

    // Success maximization strategies
    recommendations.success_maximization = this.generateSuccessMaximizationStrategies(validationResults);

    // Prioritize all recommendations
    recommendations.implementation_priority = this.prioritizeRecommendations(recommendations);

    return recommendations;
  }

  // Analysis methods
  extractJobKeywords(jobDescription) {
    // Simplified keyword extraction
    const commonKeywords = [
      'leadership', 'management', 'strategy', 'analysis', 'development',
      'project management', 'communication', 'collaboration', 'innovation',
      'problem solving', 'team', 'results', 'growth', 'optimization'
    ];

    const technicalKeywords = [
      'javascript', 'python', 'react', 'node.js', 'aws', 'docker', 'sql',
      'machine learning', 'ai', 'data science', 'agile', 'scrum'
    ];

    const foundKeywords = [];
    const searchText = jobDescription.toLowerCase();

    [...commonKeywords, ...technicalKeywords].forEach(keyword => {
      if (searchText.includes(keyword.toLowerCase())) {
        foundKeywords.push(keyword);
      }
    });

    return foundKeywords.slice(0, 20); // Top 20 keywords
  }

  extractResumeKeywords(resumeContent) {
    // Simplified keyword extraction from resume
    const words = resumeContent.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3);

    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    return Object.keys(wordFreq)
      .sort((a, b) => wordFreq[b] - wordFreq[a])
      .slice(0, 50); // Top 50 words
  }

  generateKeywordOptimizations(missingKeywords, resumeContent) {
    return missingKeywords.map(keyword => ({
      keyword: keyword,
      suggestion: `Add "${keyword}" to relevant experience or skills section`,
      placement: this.suggestKeywordPlacement(keyword, resumeContent),
      priority: this.calculateKeywordPriority(keyword)
    })).slice(0, 8); // Top 8 suggestions
  }

  analyzeKeywordDensity(content, keywords) {
    const totalWords = content.split(/\s+/).length;
    const density = {};

    keywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      const matches = (content.match(regex) || []).length;
      density[keyword] = {
        count: matches,
        density: ((matches / totalWords) * 100).toFixed(2)
      };
    });

    return density;
  }

  identifySuccessFactors(validationResults) {
    const factors = [];

    if (validationResults.compatibility_analysis.overall_ats_score >= 90) {
      factors.push('Excellent ATS compatibility across all major systems');
    }

    if (validationResults.format_analysis.parsing_quality_score >= 85) {
      factors.push('High-quality document format with excellent parsing');
    }

    if (validationResults.keyword_analysis?.keyword_match_score >= 80) {
      factors.push('Strong keyword alignment with target role requirements');
    }

    if (validationResults.compatibility_analysis.passing_systems >= 14) {
      factors.push('Universal compatibility across enterprise and startup ATS');
    }

    return factors;
  }

  identifyRiskFactors(validationResults) {
    const risks = [];

    if (validationResults.compatibility_analysis.overall_ats_score < 80) {
      risks.push('Below-average ATS compatibility may reduce application success');
    }

    if (validationResults.format_analysis.parsing_quality_score < 70) {
      risks.push('Document format issues may cause parsing failures');
    }

    if (validationResults.keyword_analysis?.keyword_match_score < 60) {
      risks.push('Low keyword alignment may result in poor ATS ranking');
    }

    if (validationResults.format_analysis.risk_level === 'High') {
      risks.push('High-risk document format requires immediate optimization');
    }

    return risks;
  }

  generateImmediateActions(validationResults) {
    const actions = [];

    if (validationResults.format_analysis.parsing_quality_score < 60) {
      actions.push('URGENT: Convert document to ATS-friendly format (Word .docx recommended)');
    }

    if (validationResults.compatibility_analysis.overall_ats_score < 70) {
      actions.push('CRITICAL: Apply ATS optimization recommendations before submitting applications');
    }

    if (validationResults.keyword_analysis?.keyword_match_score < 50) {
      actions.push('HIGH PRIORITY: Add missing keywords to improve job relevance');
    }

    return actions;
  }

  generateSuccessMaximizationStrategies(validationResults) {
    return [
      'Target companies using high-scoring ATS systems for better compatibility',
      'A/B test different resume formats to optimize response rates',
      'Track application success metrics to identify optimization opportunities',
      'Continuously update keyword strategy based on market trends',
      'Leverage format validation for multi-format application strategies'
    ];
  }

  // Utility methods
  calculateOverallValidationScore(validationResults) {
    const scores = [
      validationResults.format_analysis.parsing_quality_score,
      validationResults.compatibility_analysis.overall_ats_score
    ];

    if (validationResults.keyword_analysis) {
      scores.push(validationResults.keyword_analysis.keyword_match_score);
    }

    return Math.round(scores.reduce((a, b) => a + b) / scores.length);
  }

  calculateConfidenceLevel(validationResults) {
    let confidence = 0.8; // Base confidence

    // Adjust based on data quality
    if (validationResults.compatibility_analysis.systems_tested >= 5) {
      confidence += 0.1;
    }

    if (validationResults.format_analysis.parsing_quality_score >= 85) {
      confidence += 0.05;
    }

    if (validationResults.keyword_analysis) {
      confidence += 0.05;
    }

    return Math.min(0.95, confidence);
  }

  extractSystemScores(systemCompatibility) {
    const scores = {};
    Object.entries(systemCompatibility).forEach(([systemName, results]) => {
      scores[results.system_name || systemName] = results.compatibility_score;
    });
    return scores;
  }

  generateValidationSummary(validation) {
    const results = validation.validation_results;

    return {
      overall_score: validation.performance_metrics.overall_score,
      ats_compatibility: results.compatibility_analysis.overall_ats_score,
      format_quality: results.format_analysis.parsing_quality_score,
      keyword_alignment: results.keyword_analysis?.keyword_match_score || 'N/A',
      estimated_success_rate: results.success_prediction.estimated_response_rate,
      confidence_level: Math.round(validation.performance_metrics.confidence_level * 100),
      validation_time: Math.round(validation.performance_metrics.total_validation_time / 1000),
      priority_actions: validation.optimization_recommendations.implementation_priority.slice(0, 3)
    };
  }

  displayValidationSummary(validation) {
    const summary = validation.summary;

    console.log(`
🤖 ATS VALIDATION COMPREHENSIVE REPORT
=====================================

📊 Overall Validation Score: ${summary.overall_score}/100
🤖 ATS Compatibility: ${summary.ats_compatibility}/100
📄 Format Quality: ${summary.format_quality}/100
🎯 Keyword Alignment: ${summary.keyword_alignment}${typeof summary.keyword_alignment === 'number' ? '/100' : ''}

📈 Success Prediction:
• Estimated Response Rate: ${summary.estimated_success_rate}%
• Confidence Level: ${summary.confidence_level}%
• Analysis Time: ${summary.validation_time}s

💡 Priority Actions:
${summary.priority_actions.map(action => `• ${action}`).join('\n')}

🎯 Next Steps: ${this.getNextStepsRecommendation(summary.overall_score)}
`);
  }

  getNextStepsRecommendation(overallScore) {
    if (overallScore >= 90) {
      return 'Excellent validation results - ready for application submission';
    } else if (overallScore >= 80) {
      return 'Good validation results - apply minor optimizations for best results';
    } else if (overallScore >= 70) {
      return 'Moderate validation results - implement recommended optimizations';
    } else {
      return 'Significant optimization needed before application submission';
    }
  }

  prioritizeRecommendations(recommendations) {
    const allRecommendations = [
      ...recommendations.immediate_actions.map(action => ({ action, priority: 1, category: 'immediate' })),
      ...recommendations.format_optimizations.slice(0, 3).map(action => ({ action, priority: 2, category: 'format' })),
      ...recommendations.content_optimizations.slice(0, 3).map(action => ({ action: action.suggestion, priority: 3, category: 'content' })),
      ...recommendations.ats_specific_fixes.slice(0, 2).map(action => ({ action, priority: 4, category: 'ats' }))
    ];

    return allRecommendations
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 10)
      .map(item => item.action);
  }

  async cacheValidationResults(validation) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `ats_validation_${validation.session_id}_${timestamp}.json`;

    await writeFile(filename, JSON.stringify(validation, null, 2));
    console.log(`📄 Validation results cached to: ${filename}`);
  }

  generateSessionId() {
    return `ats_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateFallbackValidation(resumePath, error) {
    return {
      error: error.message,
      fallback: true,
      basic_recommendations: [
        'Ensure resume is in standard format (PDF or Word)',
        'Use clear section headers and bullet points',
        'Include relevant keywords for target roles',
        'Test document readability manually'
      ]
    };
  }

  // Additional utility methods for keyword suggestions
  suggestKeywordPlacement(keyword, resumeContent) {
    if (resumeContent.toLowerCase().includes('skills')) {
      return 'skills_section';
    } else if (resumeContent.toLowerCase().includes('experience')) {
      return 'experience_section';
    } else {
      return 'summary_section';
    }
  }

  calculateKeywordPriority(keyword) {
    const highPriorityKeywords = ['leadership', 'management', 'strategy', 'python', 'javascript'];
    return highPriorityKeywords.includes(keyword.toLowerCase()) ? 'high' : 'medium';
  }

  calculatePredictionConfidence(validationResults) {
    // Simplified confidence calculation based on data completeness
    let confidence = 70; // Base confidence

    if (validationResults.compatibility_analysis.systems_tested >= 5) {
      confidence += 10;
    }

    if (validationResults.keyword_analysis) {
      confidence += 10;
    }

    if (validationResults.format_analysis.parsing_quality_score >= 80) {
      confidence += 10;
    }

    return Math.min(95, confidence);
  }
}

// CLI interface
async function runATSValidationEngine() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help') {
    console.log(`
🤖 ATS Validation Engine

Usage:
  bun ats-validation-engine.js validate <resume-path> [job-description-path]
  bun ats-validation-engine.js batch <directory>
  bun ats-validation-engine.js quick <resume-path>
  bun ats-validation-engine.js track <resume-path> <job-description-path>

Examples:
  bun ats-validation-engine.js validate resume.pdf job-description.txt
  bun ats-validation-engine.js batch ./resumes
  bun ats-validation-engine.js quick resume.docx
  bun ats-validation-engine.js track resume.pdf job.txt
`);
    return;
  }

  const engine = new ATSValidationEngine({
    comprehensive: true,
    parallel: true,
    verboseOutput: true
  });

  try {
    switch (command) {
      case 'validate':
        const [resumePath, jobDescPath] = args.slice(1);
        if (!resumePath) {
          console.error('❌ Resume path required');
          process.exit(1);
        }

        let jobDescription = null;
        if (jobDescPath) {
          jobDescription = await readFile(jobDescPath, 'utf-8');
        }

        const validation = await engine.runCompleteValidation(resumePath, jobDescription);

        console.log('\n✅ ATS Validation Complete!');
        console.log(`📊 Overall Score: ${validation.summary.overall_score}/100`);
        console.log(`📈 Estimated Success Rate: ${validation.summary.estimated_success_rate}%`);
        break;

      case 'quick':
        const quickPath = args[1];
        if (!quickPath) {
          console.error('❌ Resume path required');
          process.exit(1);
        }

        const quickEngine = new ATSValidationEngine({
          comprehensive: false,
          verboseOutput: false
        });

        await quickEngine.runCompleteValidation(quickPath);
        break;

      default:
        console.error(`❌ Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error(`🚨 ATS validation failed: ${error.message}`);
    process.exit(1);
  }
}

// Export for programmatic use
export { ATSValidationEngine };

// Run CLI if called directly
if (import.meta.main) {
  runATSValidationEngine();
}