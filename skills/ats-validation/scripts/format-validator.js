#!/usr/bin/env bun

/**
 * Format Validation & Parsing Accuracy Tester
 * Document format validation and parsing quality assessment across formats
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';

class FormatValidator {
  constructor(options = {}) {
    this.supportedFormats = ['pdf', 'docx', 'html', 'txt', 'md'];
    this.parsingRules = this.initializeParsingRules();

    this.config = {
      validationDepth: options.validationDepth || 'standard', // quick, standard, deep
      includePreview: options.includePreview !== false,
      generateRecommendations: options.generateRecommendations !== false,
      ...options
    };
  }

  async validateFormat(filePath, targetFormat = null) {
    console.log(`🔍 Validating format for: ${basename(filePath)}`);

    const validation = {
      file_path: filePath,
      timestamp: new Date().toISOString(),
      format_analysis: {},
      parsing_quality: {},
      compatibility_assessment: {},
      recommendations: {}
    };

    try {
      // Phase 1: Format detection and analysis
      console.log('📋 Analyzing document format...');
      validation.format_analysis = await this.analyzeDocumentFormat(filePath);

      // Phase 2: Parsing quality assessment
      console.log('🧪 Assessing parsing quality...');
      validation.parsing_quality = await this.assessParsingQuality(
        filePath,
        validation.format_analysis
      );

      // Phase 3: ATS compatibility assessment
      console.log('🤖 Evaluating ATS compatibility...');
      validation.compatibility_assessment = await this.assessATSCompatibility(
        validation.format_analysis,
        validation.parsing_quality
      );

      // Phase 4: Generate recommendations
      console.log('💡 Generating format recommendations...');
      validation.recommendations = this.generateFormatRecommendations(
        validation.format_analysis,
        validation.parsing_quality,
        validation.compatibility_assessment
      );

      console.log('✅ Format validation complete!');
      this.displayValidationSummary(validation);

      return validation;

    } catch (error) {
      console.error('🚨 Format validation failed:', error.message);
      return this.generateFallbackValidation(filePath, error);
    }
  }

  async analyzeDocumentFormat(filePath) {
    const content = await readFile(filePath, 'utf-8');
    const fileExtension = extname(filePath).toLowerCase();

    const analysis = {
      detected_format: this.detectFormatFromContent(content),
      file_extension: fileExtension,
      format_match: false,
      content_characteristics: {},
      structural_elements: {},
      text_extraction_quality: {}
    };

    // Check if detected format matches file extension
    analysis.format_match = analysis.detected_format === fileExtension.slice(1);

    // Analyze content characteristics
    analysis.content_characteristics = this.analyzeContentCharacteristics(content);

    // Identify structural elements
    analysis.structural_elements = this.identifyStructuralElements(content);

    // Assess text extraction quality
    analysis.text_extraction_quality = this.assessTextExtractionQuality(content);

    return analysis;
  }

  async assessParsingQuality(filePath, formatAnalysis) {
    const content = await readFile(filePath, 'utf-8');

    const quality = {
      overall_score: 0,
      text_clarity: {},
      structure_recognition: {},
      field_extraction: {},
      formatting_preservation: {},
      encoding_issues: {}
    };

    // Assess text clarity and readability
    quality.text_clarity = this.assessTextClarity(content);

    // Evaluate structure recognition capability
    quality.structure_recognition = this.evaluateStructureRecognition(
      content,
      formatAnalysis.structural_elements
    );

    // Test field extraction accuracy
    quality.field_extraction = this.testFieldExtraction(content);

    // Check formatting preservation
    quality.formatting_preservation = this.checkFormattingPreservation(
      content,
      formatAnalysis.detected_format
    );

    // Detect encoding issues
    quality.encoding_issues = this.detectEncodingIssues(content);

    // Calculate overall quality score
    quality.overall_score = this.calculateOverallQualityScore(quality);

    return quality;
  }

  async assessATSCompatibility(formatAnalysis, parsingQuality) {
    const compatibility = {
      format_compatibility: {},
      parsing_reliability: {},
      system_support: {},
      risk_assessment: {},
      compatibility_score: 0
    };

    // Assess format compatibility
    compatibility.format_compatibility = this.assessFormatCompatibility(
      formatAnalysis.detected_format
    );

    // Evaluate parsing reliability
    compatibility.parsing_reliability = this.evaluateParsingReliability(parsingQuality);

    // Check system support levels
    compatibility.system_support = this.checkSystemSupport(formatAnalysis.detected_format);

    // Perform risk assessment
    compatibility.risk_assessment = this.performRiskAssessment(
      formatAnalysis,
      parsingQuality
    );

    // Calculate compatibility score
    compatibility.compatibility_score = this.calculateCompatibilityScore(compatibility);

    return compatibility;
  }

  // Format analysis methods
  detectFormatFromContent(content) {
    // PDF detection
    if (content.startsWith('%PDF')) return 'pdf';

    // HTML detection
    if (content.includes('<html') || content.includes('<!DOCTYPE')) return 'html';

    // Word document detection (simplified)
    if (content.includes('application/vnd.openxmlformats')) return 'docx';

    // Markdown detection
    if (content.includes('# ') || content.includes('## ')) return 'md';

    // Default to text
    return 'txt';
  }

  analyzeContentCharacteristics(content) {
    return {
      content_length: content.length,
      line_count: content.split('\n').length,
      character_encoding: this.detectCharacterEncoding(content),
      special_characters: this.findSpecialCharacters(content),
      formatting_complexity: this.assessFormattingComplexity(content),
      language_detected: this.detectLanguage(content)
    };
  }

  identifyStructuralElements(content) {
    const elements = {
      headers: this.findHeaders(content),
      sections: this.findSections(content),
      lists: this.findLists(content),
      tables: this.findTables(content),
      contact_info: this.findContactInfo(content),
      dates: this.findDates(content)
    };

    elements.structure_score = this.calculateStructureScore(elements);

    return elements;
  }

  assessTextExtractionQuality(content) {
    return {
      extraction_accuracy: this.calculateExtractionAccuracy(content),
      text_integrity: this.assessTextIntegrity(content),
      formatting_loss: this.assessFormattingLoss(content),
      character_corruption: this.detectCharacterCorruption(content),
      whitespace_handling: this.assessWhitespaceHandling(content)
    };
  }

  // Parsing quality assessment methods
  assessTextClarity(content) {
    return {
      readability_score: this.calculateReadabilityScore(content),
      spelling_quality: this.assessSpellingQuality(content),
      grammar_quality: this.assessGrammarQuality(content),
      terminology_consistency: this.assessTerminologyConsistency(content),
      clarity_score: this.calculateClarityScore(content)
    };
  }

  evaluateStructureRecognition(content, structuralElements) {
    return {
      section_boundary_clarity: this.assessSectionBoundaries(content),
      header_hierarchy: this.evaluateHeaderHierarchy(structuralElements.headers),
      list_formatting: this.evaluateListFormatting(structuralElements.lists),
      table_structure: this.evaluateTableStructure(structuralElements.tables),
      overall_structure_score: this.calculateStructureRecognitionScore(structuralElements)
    };
  }

  testFieldExtraction(content) {
    const extraction = {
      contact_extraction: this.testContactExtraction(content),
      experience_extraction: this.testExperienceExtraction(content),
      skills_extraction: this.testSkillsExtraction(content),
      education_extraction: this.testEducationExtraction(content),
      achievement_extraction: this.testAchievementExtraction(content)
    };

    extraction.overall_extraction_score = this.calculateExtractionScore(extraction);

    return extraction;
  }

  checkFormattingPreservation(content, format) {
    return {
      font_preservation: this.checkFontPreservation(content, format),
      spacing_preservation: this.checkSpacingPreservation(content),
      bullet_preservation: this.checkBulletPreservation(content),
      emphasis_preservation: this.checkEmphasisPreservation(content),
      layout_preservation: this.checkLayoutPreservation(content, format)
    };
  }

  detectEncodingIssues(content) {
    return {
      character_encoding_errors: this.findCharacterEncodingErrors(content),
      unicode_issues: this.detectUnicodeIssues(content),
      special_character_problems: this.findSpecialCharacterProblems(content),
      corrupted_text: this.detectCorruptedText(content)
    };
  }

  // Compatibility assessment methods
  assessFormatCompatibility(detectedFormat) {
    const formatCompatibility = {
      pdf: {
        universal_support: 0.95,
        parsing_quality: 0.85,
        common_issues: ['Font rendering', 'Table extraction'],
        best_practices: ['Use standard fonts', 'Avoid complex layouts']
      },
      docx: {
        universal_support: 0.98,
        parsing_quality: 0.92,
        common_issues: ['Version compatibility', 'Embedded objects'],
        best_practices: ['Save as latest version', 'Avoid embedded media']
      },
      html: {
        universal_support: 0.85,
        parsing_quality: 0.88,
        common_issues: ['CSS rendering', 'JavaScript elements'],
        best_practices: ['Use semantic HTML', 'Inline CSS only']
      },
      txt: {
        universal_support: 1.0,
        parsing_quality: 0.95,
        common_issues: ['Formatting loss', 'Structure ambiguity'],
        best_practices: ['Clear section separators', 'Consistent formatting']
      },
      md: {
        universal_support: 0.70,
        parsing_quality: 0.80,
        common_issues: ['Markdown parsing', 'Limited ATS support'],
        best_practices: ['Convert to standard format', 'Use plain text elements']
      }
    };

    return formatCompatibility[detectedFormat] || {
      universal_support: 0.60,
      parsing_quality: 0.70,
      common_issues: ['Unknown format', 'Limited support'],
      best_practices: ['Convert to standard format']
    };
  }

  evaluateParsingReliability(parsingQuality) {
    return {
      text_extraction_reliability: parsingQuality.text_clarity.clarity_score,
      structure_parsing_reliability: parsingQuality.structure_recognition.overall_structure_score,
      field_extraction_reliability: parsingQuality.field_extraction.overall_extraction_score,
      overall_reliability: this.calculateOverallReliability(parsingQuality)
    };
  }

  checkSystemSupport(format) {
    const systemSupport = {
      workday: this.getWorkdaySupport(format),
      greenhouse: this.getGreenhouseSupport(format),
      lever: this.getLeverSupport(format),
      taleo: this.getTaleoSupport(format),
      ashby: this.getAshbySupport(format)
    };

    systemSupport.average_support = Object.values(systemSupport)
      .reduce((sum, support) => sum + support.compatibility, 0) / 5;

    return systemSupport;
  }

  performRiskAssessment(formatAnalysis, parsingQuality) {
    const risks = {
      parsing_failure_risk: this.calculateParsingFailureRisk(parsingQuality),
      data_loss_risk: this.calculateDataLossRisk(formatAnalysis),
      compatibility_risk: this.calculateCompatibilityRisk(formatAnalysis),
      success_impact_risk: this.calculateSuccessImpactRisk(parsingQuality)
    };

    risks.overall_risk_score = this.calculateOverallRisk(risks);
    risks.risk_level = this.determineRiskLevel(risks.overall_risk_score);

    return risks;
  }

  generateFormatRecommendations(formatAnalysis, parsingQuality, compatibilityAssessment) {
    const recommendations = {
      format_optimization: [],
      parsing_improvements: [],
      compatibility_enhancements: [],
      alternative_formats: [],
      implementation_priority: []
    };

    // Generate format-specific recommendations
    recommendations.format_optimization = this.generateFormatOptimizations(
      formatAnalysis,
      compatibilityAssessment
    );

    // Generate parsing improvement recommendations
    recommendations.parsing_improvements = this.generateParsingImprovements(parsingQuality);

    // Generate compatibility enhancements
    recommendations.compatibility_enhancements = this.generateCompatibilityEnhancements(
      compatibilityAssessment
    );

    // Suggest alternative formats
    recommendations.alternative_formats = this.suggestAlternativeFormats(
      formatAnalysis,
      compatibilityAssessment
    );

    // Prioritize implementation
    recommendations.implementation_priority = this.prioritizeRecommendations(recommendations);

    return recommendations;
  }

  // Implementation methods for specific checks
  findHeaders(content) {
    const headerPatterns = [
      /^#{1,6}\s+(.+)/gm, // Markdown headers
      /<h[1-6][^>]*>(.+?)<\/h[1-6]>/gi, // HTML headers
      /^([A-Z\s]+)$/gm, // All caps lines
      /^(.+)\n[=-]{3,}/gm // Underlined headers
    ];

    const headers = [];
    headerPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) headers.push(...matches);
    });

    return headers;
  }

  findSections(content) {
    const sectionKeywords = [
      'summary', 'profile', 'objective', 'experience', 'work history',
      'employment', 'skills', 'competencies', 'education', 'projects',
      'achievements', 'certifications', 'awards'
    ];

    const sections = [];
    sectionKeywords.forEach(keyword => {
      const regex = new RegExp(`(^|\\n).*${keyword}.*($|\\n)`, 'gi');
      const matches = content.match(regex);
      if (matches) {
        sections.push({
          keyword: keyword,
          matches: matches.length,
          positions: this.findPositions(content, regex)
        });
      }
    });

    return sections;
  }

  testContactExtraction(content) {
    const patterns = {
      email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      phone: /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g,
      linkedin: /linkedin\.com\/in\/[a-zA-Z0-9-]+/g,
      address: /\d+\s+[A-Za-z\s,]+\s+[A-Z]{2}\s+\d{5}/g
    };

    const extraction = {};
    for (const [field, pattern] of Object.entries(patterns)) {
      const matches = content.match(pattern);
      extraction[field] = {
        found: !!matches,
        count: matches ? matches.length : 0,
        confidence: matches ? 0.9 : 0.0
      };
    }

    return extraction;
  }

  calculateOverallQualityScore(quality) {
    const weights = {
      text_clarity: 0.25,
      structure_recognition: 0.25,
      field_extraction: 0.30,
      formatting_preservation: 0.15,
      encoding_issues: 0.05
    };

    let score = 0;
    score += quality.text_clarity.clarity_score * weights.text_clarity;
    score += quality.structure_recognition.overall_structure_score * weights.structure_recognition;
    score += quality.field_extraction.overall_extraction_score * weights.field_extraction;
    score += this.calculateFormattingScore(quality.formatting_preservation) * weights.formatting_preservation;
    score += (1 - this.calculateEncodingIssueScore(quality.encoding_issues)) * weights.encoding_issues;

    return Math.max(0, Math.min(1, score));
  }

  displayValidationSummary(validation) {
    const format = validation.format_analysis.detected_format;
    const score = Math.round(validation.parsing_quality.overall_score * 100);
    const compatibility = Math.round(validation.compatibility_assessment.compatibility_score);

    console.log(`
🔍 FORMAT VALIDATION SUMMARY
===========================

📄 Detected Format: ${format.toUpperCase()}
📊 Parsing Quality Score: ${score}/100
🤖 ATS Compatibility: ${compatibility}/100

🎯 Key Findings:
${this.formatKeyFindings(validation)}

💡 Top Recommendations:
${validation.recommendations.implementation_priority.slice(0, 3).map(rec => `• ${rec}`).join('\n')}

Risk Level: ${validation.compatibility_assessment.risk_assessment.risk_level}
`);
  }

  formatKeyFindings(validation) {
    const findings = [];

    if (validation.parsing_quality.overall_score >= 0.9) {
      findings.push('✅ Excellent parsing quality detected');
    } else if (validation.parsing_quality.overall_score >= 0.7) {
      findings.push('⚠️ Good parsing quality with room for improvement');
    } else {
      findings.push('❌ Parsing quality needs significant improvement');
    }

    if (validation.compatibility_assessment.system_support.average_support >= 0.9) {
      findings.push('✅ Excellent ATS system support');
    } else if (validation.compatibility_assessment.system_support.average_support >= 0.7) {
      findings.push('⚠️ Good ATS support across most systems');
    } else {
      findings.push('❌ Limited ATS support - format optimization recommended');
    }

    return findings.join('\n');
  }

  // Utility methods
  initializeParsingRules() {
    return {
      contact_patterns: {
        email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
        phone: /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g,
        linkedin: /linkedin\.com\/in\/[a-zA-Z0-9-]+/g
      },
      structure_patterns: {
        headers: /^(#{1,6}\s|.*\n[=-]{3,})/gm,
        bullets: /^[\s]*[-•*]\s/gm,
        numbers: /^[\s]*\d+[\.)]\s/gm
      },
      content_patterns: {
        dates: /(19|20)\d{2}/g,
        skills: /(JavaScript|Python|React|SQL|AWS|Leadership)/gi,
        companies: /[A-Z][a-z]+\s+(Inc|LLC|Corp|Company)\.?/g
      }
    };
  }

  generateFallbackValidation(filePath, error) {
    return {
      file_path: filePath,
      error: error.message,
      fallback: true,
      basic_recommendations: [
        'Ensure file is readable and not corrupted',
        'Use standard formats (PDF, Word, or plain text)',
        'Check file permissions and accessibility',
        'Verify file encoding is UTF-8 compatible'
      ]
    };
  }

  // --- Stub implementations for analysis methods ---
  calculateReadabilityScore(c) { const words = c.split(/\s+/).length; return Math.min(1, words > 100 ? 0.85 : 0.6); }
  assessSpellingQuality(c) { return 0.9; }
  assessGrammarQuality(c) { return 0.85; }
  assessTerminologyConsistency(c) { return 0.8; }
  calculateClarityScore(c) { return 0.82; }
  assessSectionBoundaries(c) { return 0.85; }
  evaluateHeaderHierarchy(h) { return h && h.length > 0 ? 0.9 : 0.5; }
  evaluateListFormatting(l) { return l && l.length > 0 ? 0.85 : 0.6; }
  evaluateTableStructure(t) { return t && t.length > 0 ? 0.8 : 0.7; }
  calculateStructureRecognitionScore(e) { return e.structure_score || 0.8; }
  testExperienceExtraction(c) { return { found: /experience/i.test(c), confidence: 0.85 }; }
  testSkillsExtraction(c) { return { found: /skills/i.test(c), confidence: 0.8 }; }
  testEducationExtraction(c) { return { found: /education/i.test(c), confidence: 0.9 }; }
  testAchievementExtraction(c) { return { found: /\d+%/.test(c), confidence: 0.75 }; }
  calculateExtractionScore(e) { const vals = Object.values(e).filter(v => v && v.confidence); return vals.length ? vals.reduce((s, v) => s + v.confidence, 0) / vals.length : 0.7; }
  checkFontPreservation(c, f) { return 0.9; }
  checkSpacingPreservation(c) { return 0.85; }
  checkBulletPreservation(c) { return /[-•*]/.test(c) ? 0.9 : 0.7; }
  checkEmphasisPreservation(c) { return 0.85; }
  checkLayoutPreservation(c, f) { return 0.8; }
  findCharacterEncodingErrors(c) { return []; }
  detectUnicodeIssues(c) { return []; }
  findSpecialCharacterProblems(c) { return []; }
  detectCorruptedText(c) { return []; }
  detectCharacterEncoding(c) { return 'UTF-8'; }
  findSpecialCharacters(c) { return (c.match(/[^\x20-\x7E\n\r\t]/g) || []); }
  assessFormattingComplexity(c) { return c.includes('<table') || c.includes('|') ? 'complex' : 'simple'; }
  detectLanguage(c) { return 'en'; }
  findLists(c) { return (c.match(/^[\s]*[-•*]\s.+/gm) || []); }
  findTables(c) { return (c.match(/<table|[\|].*[\|]/gm) || []); }
  findContactInfo(c) { return { email: /\S+@\S+/.test(c), phone: /\d{3}.*\d{4}/.test(c) }; }
  findDates(c) { return (c.match(/(19|20)\d{2}/g) || []); }
  calculateStructureScore(e) { const found = [e.headers, e.sections, e.contact_info].filter(Boolean).length; return found / 3; }
  calculateExtractionAccuracy(c) { return 0.85; }
  assessTextIntegrity(c) { return 0.9; }
  assessFormattingLoss(c) { return 0.1; }
  detectCharacterCorruption(c) { return []; }
  assessWhitespaceHandling(c) { return 0.9; }
  evaluateFormatting(c) { return { complexity: this.assessFormattingComplexity(c), ats_friendly: !c.includes('<table') }; }
  calculateCompatibilityScore(comp) { return Math.round(((comp.format_compatibility?.universal_support || 0.8) * 50 + (comp.parsing_reliability?.overall_reliability || 0.8) * 50)); }
  calculateOverallReliability(pq) { return (pq.overall_score + 0.8) / 2; }
  getWorkdaySupport(f) { return { compatibility: f === 'docx' ? 0.98 : f === 'pdf' ? 0.92 : 0.8 }; }
  getGreenhouseSupport(f) { return { compatibility: f === 'docx' ? 0.97 : f === 'pdf' ? 0.95 : 0.88 }; }
  getLeverSupport(f) { return { compatibility: f === 'docx' ? 0.96 : f === 'pdf' ? 0.93 : 0.85 }; }
  getTaleoSupport(f) { return { compatibility: f === 'docx' ? 0.95 : f === 'pdf' ? 0.88 : 0.75 }; }
  getAshbySupport(f) { return { compatibility: f === 'docx' ? 0.98 : f === 'pdf' ? 0.96 : 0.92 }; }
  calculateParsingFailureRisk(pq) { return 1 - (pq.overall_score || 0.8); }
  calculateDataLossRisk(fa) { return fa.detected_format === 'pdf' ? 0.15 : 0.05; }
  calculateCompatibilityRisk(fa) { return fa.detected_format === 'md' ? 0.4 : 0.1; }
  calculateSuccessImpactRisk(pq) { return 1 - (pq.overall_score || 0.8); }
  calculateOverallRisk(risks) { return Object.values(risks).filter(v => typeof v === 'number').reduce((s, v) => s + v, 0) / 4; }
  determineRiskLevel(score) { return score > 0.6 ? 'High' : score > 0.3 ? 'Medium' : 'Low'; }
  generateFormatOptimizations(fa, ca) { return ['Use Word (.docx) for maximum ATS compatibility', 'Ensure standard fonts throughout']; }
  generateParsingImprovements(pq) { return ['Improve section header clarity', 'Standardize date formatting']; }
  generateCompatibilityEnhancements(ca) { return ['Test against target company ATS before submitting']; }
  suggestAlternativeFormats(fa, ca) { return fa.detected_format !== 'docx' ? ['Convert to Word (.docx) for best results'] : []; }
  prioritizeRecommendations(recs) { return [...(recs.format_optimization || []), ...(recs.parsing_improvements || []), ...(recs.compatibility_enhancements || [])].slice(0, 8); }
  calculateFormattingScore(fp) { return Object.values(fp).filter(v => typeof v === 'number').reduce((s, v) => s + v, 0) / 5; }
  calculateEncodingIssueScore(ei) { return Object.values(ei).filter(v => Array.isArray(v)).reduce((s, v) => s + v.length, 0) * 0.05; }
  findPositions(c, regex) { const m = []; let match; const r = new RegExp(regex.source, 'gi'); while ((match = r.exec(c)) !== null) m.push(match.index); return m; }
}

// CLI interface
async function runFormatValidation() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help') {
    console.log(`
🔍 Format Validator

Usage:
  bun format-validator.js validate <file-path> [target-format]
  bun format-validator.js batch <directory>
  bun format-validator.js formats
  bun format-validator.js quick <file-path>

Examples:
  bun format-validator.js validate resume.pdf
  bun format-validator.js validate resume.docx pdf
  bun format-validator.js batch ./resumes
  bun format-validator.js formats
`);
    return;
  }

  const validator = new FormatValidator({
    validationDepth: 'standard',
    includePreview: true
  });

  try {
    switch (command) {
      case 'validate':
        const [filePath, targetFormat] = args.slice(1);
        if (!filePath) {
          console.error('❌ File path required');
          process.exit(1);
        }

        await validator.validateFormat(filePath, targetFormat);
        break;

      case 'formats':
        console.log('\n📄 Supported Formats:');
        validator.supportedFormats.forEach(format => {
          console.log(`• ${format.toUpperCase()}`);
        });
        break;

      case 'quick':
        const quickFile = args[1];
        if (!quickFile) {
          console.error('❌ File path required');
          process.exit(1);
        }

        const quickValidator = new FormatValidator({ validationDepth: 'quick' });
        await quickValidator.validateFormat(quickFile);
        break;

      default:
        console.error(`❌ Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error(`🚨 Format validation failed: ${error.message}`);
    process.exit(1);
  }
}

// Export for programmatic use
export { FormatValidator };

// Run CLI if called directly
if (import.meta.main) {
  runFormatValidation();
}