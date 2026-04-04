#!/usr/bin/env bun
// Resume Analyzer - Interactive resume optimization and ATS scoring

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

class ResumeAnalyzer {
    constructor() {
        this.resume = '';
        this.analysis = {};
        this.recommendations = [];
    }

    // Load and parse resume file
    loadResume(filePath) {
        if (!existsSync(filePath)) {
            throw new Error(`Resume file not found: ${filePath}`);
        }

        this.resume = readFileSync(filePath, 'utf8');
        console.log(`📄 Loaded resume: ${filePath} (${this.resume.length} characters)`);
        return this.resume;
    }

    // Comprehensive resume analysis
    analyzeResume() {
        console.log('🔍 Analyzing resume content...\n');

        this.analysis = {
            structure: this.analyzeStructure(),
            content: this.analyzeContent(),
            ats: this.analyzeATS(),
            keywords: this.analyzeKeywords(),
            achievements: this.analyzeAchievements(),
            formatting: this.analyzeFormatting()
        };

        this.generateRecommendations();
        return this.analysis;
    }

    // Analyze resume structure
    analyzeStructure() {
        const sections = this.resume.match(/^##?\s+.+$/gm) || [];
        const sectionTitles = sections.map(s => s.replace(/^##?\s+/, '').trim());

        const expectedSections = [
            'Experience', 'Work Experience', 'Professional Experience',
            'Skills', 'Technical Skills', 'Core Skills',
            'Education',
            'Contact', 'Summary', 'About'
        ];

        const foundSections = sectionTitles.filter(title =>
            expectedSections.some(expected =>
                title.toLowerCase().includes(expected.toLowerCase())
            )
        );

        const wordCount = this.resume.split(/\s+/).length;
        const recommendedLength = wordCount >= 200 && wordCount <= 800;

        return {
            score: Math.min(100, (foundSections.length / 4) * 100),
            sections: sectionTitles,
            foundSections,
            missingSections: expectedSections.filter(expected =>
                !sectionTitles.some(title =>
                    title.toLowerCase().includes(expected.toLowerCase())
                )
            ).slice(0, 3),
            wordCount,
            lengthAppropriate: recommendedLength,
            details: {
                totalSections: sectionTitles.length,
                expectedSections: 4,
                recommendation: wordCount < 200 ? 'Too short - add more detail' :
                              wordCount > 800 ? 'Too long - consider condensing' :
                              'Good length'
            }
        };
    }

    // Analyze content quality
    analyzeContent() {
        const bullets = this.resume.match(/^\s*[-*•]\s+.+$/gm) || [];
        const quantifiedBullets = bullets.filter(bullet =>
            /\d+/.test(bullet) || /%/.test(bullet) || /\$/.test(bullet)
        );

        const actionVerbs = [
            'led', 'managed', 'developed', 'implemented', 'created', 'designed',
            'optimized', 'improved', 'increased', 'reduced', 'achieved', 'delivered',
            'built', 'launched', 'established', 'drove', 'executed', 'streamlined'
        ];

        const strongBullets = bullets.filter(bullet =>
            actionVerbs.some(verb =>
                bullet.toLowerCase().includes(verb)
            )
        );

        const passiveBullets = bullets.filter(bullet =>
            bullet.toLowerCase().includes('responsible for') ||
            bullet.toLowerCase().includes('duties included') ||
            bullet.toLowerCase().includes('was involved')
        );

        return {
            score: Math.min(100,
                (quantifiedBullets.length / Math.max(bullets.length, 1)) * 50 +
                (strongBullets.length / Math.max(bullets.length, 1)) * 30 +
                (passiveBullets.length === 0 ? 20 : 0)
            ),
            totalBullets: bullets.length,
            quantifiedBullets: quantifiedBullets.length,
            strongActionVerbs: strongBullets.length,
            passiveLanguage: passiveBullets.length,
            quantificationRate: bullets.length > 0 ? (quantifiedBullets.length / bullets.length * 100).toFixed(1) : 0,
            details: {
                recommendation: quantifiedBullets.length < bullets.length * 0.5 ?
                    'Add more quantified achievements (metrics, percentages, dollar amounts)' :
                    'Good use of quantified results'
            }
        };
    }

    // ATS compatibility analysis
    analyzeATS() {
        let score = 100;
        const issues = [];

        // Check for ATS-unfriendly elements
        if (this.resume.includes('│') || this.resume.includes('┌') || this.resume.includes('═')) {
            score -= 20;
            issues.push('Remove table borders and special characters');
        }

        if (this.resume.match(/\t/g)?.length > 10) {
            score -= 15;
            issues.push('Excessive tab usage - use consistent spacing');
        }

        if (!this.resume.includes('@') || !this.resume.match(/\d{3}[\-\s]?\d{3}[\-\s]?\d{4}/)) {
            score -= 25;
            issues.push('Missing contact information in body text');
        }

        // Check for standard section headers
        const standardHeaders = ['experience', 'education', 'skills'];
        const foundHeaders = standardHeaders.filter(header =>
            this.resume.toLowerCase().includes(header)
        );

        if (foundHeaders.length < 3) {
            score -= 20;
            issues.push('Use standard section headers (Experience, Education, Skills)');
        }

        return {
            score: Math.max(0, score),
            issues,
            compatibility: score >= 80 ? 'Excellent' :
                          score >= 60 ? 'Good' :
                          score >= 40 ? 'Fair' : 'Poor',
            details: {
                contactInBody: this.resume.includes('@'),
                standardSections: foundHeaders.length,
                specialCharacters: (this.resume.match(/[│┌═]/g) || []).length
            }
        };
    }

    // Keyword analysis for common roles
    analyzeKeywords() {
        const techKeywords = [
            'javascript', 'python', 'react', 'node', 'aws', 'docker', 'kubernetes',
            'api', 'database', 'sql', 'git', 'agile', 'scrum', 'ci/cd'
        ];

        const pmKeywords = [
            'product management', 'roadmap', 'stakeholder', 'user research',
            'analytics', 'metrics', 'a/b testing', 'feature', 'launch'
        ];

        const aiKeywords = [
            'ai', 'machine learning', 'ml', 'artificial intelligence', 'llm',
            'deep learning', 'neural network', 'nlp', 'computer vision'
        ];

        const leadershipKeywords = [
            'led', 'managed', 'leadership', 'team', 'mentor', 'coach',
            'strategy', 'vision', 'culture', 'hiring'
        ];

        const resumeLower = this.resume.toLowerCase();

        const keywordSets = {
            technical: techKeywords.filter(kw => resumeLower.includes(kw)),
            productManagement: pmKeywords.filter(kw => resumeLower.includes(kw)),
            aiMl: aiKeywords.filter(kw => resumeLower.includes(kw)),
            leadership: leadershipKeywords.filter(kw => resumeLower.includes(kw))
        };

        const totalFound = Object.values(keywordSets).flat().length;
        const totalPossible = techKeywords.length + pmKeywords.length + aiKeywords.length + leadershipKeywords.length;

        return {
            score: Math.min(100, (totalFound / totalPossible) * 200),
            keywordSets,
            totalFound,
            coverage: {
                technical: `${keywordSets.technical.length}/${techKeywords.length}`,
                productManagement: `${keywordSets.productManagement.length}/${pmKeywords.length}`,
                aiMl: `${keywordSets.aiMl.length}/${aiKeywords.length}`,
                leadership: `${keywordSets.leadership.length}/${leadershipKeywords.length}`
            },
            strongestArea: Object.entries(keywordSets).reduce((a, b) =>
                keywordSets[a] > keywordSets[b[0]] ? a : b[0]
            )
        };
    }

    // Achievement analysis
    analyzeAchievements() {
        const achievements = this.resume.match(/^\s*[-*•]\s+.+$/gm) || [];

        const patterns = {
            metrics: /\d+%|\d+x|\$[\d,]+|[\d,]+\s*(users|customers|employees|clients)/gi,
            timeframes: /\d+\s*(months?|years?|weeks?|days?)/gi,
            scale: /(enterprise|global|nationwide|company-wide|team|department)/gi,
            improvements: /(improved|increased|reduced|optimized|enhanced|streamlined)/gi
        };

        const analysisResults = {};
        let totalMatches = 0;

        Object.entries(patterns).forEach(([category, pattern]) => {
            const matches = achievements.map(achievement =>
                (achievement.match(pattern) || []).length
            ).reduce((a, b) => a + b, 0);

            analysisResults[category] = matches;
            totalMatches += matches;
        });

        return {
            score: Math.min(100, (totalMatches / achievements.length) * 30),
            totalAchievements: achievements.length,
            patternMatches: analysisResults,
            averageImpactPerBullet: achievements.length > 0 ? (totalMatches / achievements.length).toFixed(2) : 0,
            strongAchievements: achievements.filter(achievement =>
                /\d+/.test(achievement) && /(improved|increased|reduced|led|managed)/.test(achievement.toLowerCase())
            ).length
        };
    }

    // Formatting analysis
    analyzeFormatting() {
        let score = 100;
        const issues = [];

        // Check consistency
        const bulletTypes = (this.resume.match(/^\s*[-*•]\s+/gm) || [])
            .map(bullet => bullet.trim()[0]);
        const uniqueBulletTypes = [...new Set(bulletTypes)];

        if (uniqueBulletTypes.length > 1) {
            score -= 10;
            issues.push('Inconsistent bullet point styles');
        }

        // Check date formatting
        const dates = this.resume.match(/\d{4}/g) || [];
        const dateFormats = this.resume.match(/\d{4}[-–—]\d{4}|\d{4}\s*-\s*\d{4}/g) || [];

        if (dates.length > 0 && dateFormats.length === 0) {
            score -= 15;
            issues.push('Inconsistent or missing date ranges');
        }

        // Check for excessive blank lines
        const excessiveSpacing = this.resume.match(/\n\s*\n\s*\n/g);
        if (excessiveSpacing && excessiveSpacing.length > 5) {
            score -= 10;
            issues.push('Excessive blank lines - tighten spacing');
        }

        return {
            score: Math.max(0, score),
            issues,
            consistency: {
                bulletPoints: uniqueBulletTypes.length === 1,
                dateFormats: dateFormats.length > 0,
                spacing: !excessiveSpacing || excessiveSpacing.length <= 5
            }
        };
    }

    // Generate recommendations
    generateRecommendations() {
        this.recommendations = [];

        // Structure recommendations
        if (this.analysis.structure.score < 70) {
            this.recommendations.push({
                priority: 'high',
                category: 'structure',
                issue: 'Missing key sections',
                action: `Add missing sections: ${this.analysis.structure.missingSections.join(', ')}`,
                impact: 'Improves ATS scanning and recruiter review'
            });
        }

        // Content recommendations
        if (this.analysis.content.quantificationRate < 50) {
            this.recommendations.push({
                priority: 'high',
                category: 'content',
                issue: 'Insufficient quantified achievements',
                action: 'Add metrics, percentages, and dollar amounts to at least 50% of bullet points',
                impact: 'Demonstrates measurable impact and results'
            });
        }

        // ATS recommendations
        if (this.analysis.ats.score < 70) {
            this.recommendations.push({
                priority: 'critical',
                category: 'ats',
                issue: 'Poor ATS compatibility',
                action: this.analysis.ats.issues.join('; '),
                impact: 'Ensures resume can be properly parsed by ATS systems'
            });
        }

        // Keyword recommendations
        if (this.analysis.keywords.score < 60) {
            this.recommendations.push({
                priority: 'medium',
                category: 'keywords',
                issue: 'Low keyword density',
                action: 'Add more relevant industry and role-specific keywords',
                impact: 'Improves match rates for target roles'
            });
        }

        // Sort by priority
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        this.recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }

    // Generate comprehensive report
    generateReport() {
        const overallScore = Math.round(
            (this.analysis.structure.score * 0.2 +
             this.analysis.content.score * 0.3 +
             this.analysis.ats.score * 0.25 +
             this.analysis.keywords.score * 0.15 +
             this.analysis.achievements.score * 0.1)
        );

        return {
            overallScore,
            grade: overallScore >= 90 ? 'A' :
                   overallScore >= 80 ? 'B' :
                   overallScore >= 70 ? 'C' :
                   overallScore >= 60 ? 'D' : 'F',
            analysis: this.analysis,
            recommendations: this.recommendations,
            summary: {
                strengths: this.getStrengths(),
                weaknesses: this.getWeaknesses(),
                quickWins: this.getQuickWins()
            }
        };
    }

    getStrengths() {
        const strengths = [];
        if (this.analysis.structure.score >= 80) strengths.push('Well-organized structure');
        if (this.analysis.content.quantificationRate >= 50) strengths.push('Good use of metrics');
        if (this.analysis.ats.score >= 80) strengths.push('ATS-friendly format');
        if (this.analysis.keywords.totalFound >= 10) strengths.push('Strong keyword presence');
        return strengths;
    }

    getWeaknesses() {
        const weaknesses = [];
        if (this.analysis.structure.score < 70) weaknesses.push('Missing key sections');
        if (this.analysis.content.quantificationRate < 30) weaknesses.push('Lacks quantified achievements');
        if (this.analysis.ats.score < 70) weaknesses.push('ATS compatibility issues');
        if (this.analysis.keywords.totalFound < 5) weaknesses.push('Insufficient keywords');
        return weaknesses;
    }

    getQuickWins() {
        const quickWins = [];
        if (this.analysis.content.passiveLanguage > 0) quickWins.push('Remove passive language');
        if (this.analysis.formatting.issues.length > 0) quickWins.push('Fix formatting consistency');
        if (this.analysis.ats.issues.length > 0) quickWins.push('Address ATS compatibility');
        return quickWins;
    }

    // Save analysis results
    saveReport(outputPath) {
        const report = this.generateReport();
        writeFileSync(outputPath, JSON.stringify(report, null, 2));
        return report;
    }

    // Interactive CLI display
    displayInteractiveReport() {
        console.clear();
        const report = this.generateReport();

        console.log('📋 Resume Analysis Report');
        console.log('═'.repeat(50));
        console.log(`\n🎯 Overall Score: ${report.overallScore}/100 (Grade: ${report.grade})\n`);

        // Score breakdown
        console.log('📊 Score Breakdown:');
        console.log(`   Structure:    ${this.analysis.structure.score.toFixed(0)}/100`);
        console.log(`   Content:      ${this.analysis.content.score.toFixed(0)}/100`);
        console.log(`   ATS Compat:   ${this.analysis.ats.score.toFixed(0)}/100`);
        console.log(`   Keywords:     ${this.analysis.keywords.score.toFixed(0)}/100`);
        console.log(`   Achievements: ${this.analysis.achievements.score.toFixed(0)}/100\n`);

        // Quick stats
        console.log('📈 Quick Stats:');
        console.log(`   Word Count:           ${this.analysis.structure.wordCount}`);
        console.log(`   Quantified Bullets:   ${this.analysis.content.quantificationRate}%`);
        console.log(`   Keyword Coverage:     ${this.analysis.keywords.totalFound} found`);
        console.log(`   ATS Compatibility:    ${this.analysis.ats.compatibility}\n`);

        // Top recommendations
        if (this.recommendations.length > 0) {
            console.log('💡 Priority Recommendations:');
            this.recommendations.slice(0, 3).forEach((rec, i) => {
                const icon = rec.priority === 'critical' ? '🔴' :
                           rec.priority === 'high' ? '🟡' : '🟢';
                console.log(`   ${i + 1}. ${icon} ${rec.action}`);
            });
        }

        console.log('\n' + '═'.repeat(50));
        return report;
    }
}

// CLI interface
if (import.meta.main) {
    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.log(`
📋 Resume Analyzer - Career Intelligence Plugin

Usage:
  bun resume-analyzer.js <resume-file> [options]

Options:
  --output, -o     Save report to file
  --interactive    Interactive display mode
  --format json    Output format (json, text)

Examples:
  bun resume-analyzer.js resume.md
  bun resume-analyzer.js resume.md --output report.json
  bun resume-analyzer.js resume.md --interactive

Features:
  ✅ Comprehensive resume analysis
  ✅ ATS compatibility scoring
  ✅ Content quality assessment
  ✅ Keyword optimization analysis
  ✅ Actionable improvement recommendations
        `);
        process.exit(1);
    }

    const resumeFile = args[0];
    const interactive = args.includes('--interactive');
    const outputIndex = args.indexOf('--output') || args.indexOf('-o');
    const outputFile = outputIndex > -1 ? args[outputIndex + 1] : null;

    try {
        const analyzer = new ResumeAnalyzer();
        analyzer.loadResume(resumeFile);
        analyzer.analyzeResume();

        if (interactive) {
            analyzer.displayInteractiveReport();
        } else {
            const report = analyzer.generateReport();
            console.log(`📋 Resume Analysis Complete!`);
            console.log(`🎯 Overall Score: ${report.overallScore}/100 (Grade: ${report.grade})`);

            if (report.recommendations.length > 0) {
                console.log('\n💡 Top Recommendations:');
                report.recommendations.slice(0, 3).forEach((rec, i) => {
                    console.log(`  ${i + 1}. ${rec.action}`);
                });
            }

            if (outputFile) {
                analyzer.saveReport(outputFile);
                console.log(`\n📁 Detailed report saved to: ${outputFile}`);
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

export default ResumeAnalyzer;