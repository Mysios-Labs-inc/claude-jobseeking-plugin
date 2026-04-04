#!/usr/bin/env bun
// AI Content Enhancer - Intelligent content optimization for career materials

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

class AIContentEnhancer {
    constructor() {
        this.jobDescription = '';
        this.userContent = '';
        this.requirements = {};
        this.optimizations = [];
        this.industryPatterns = this.loadIndustryPatterns();
    }

    // Load industry-specific optimization patterns
    loadIndustryPatterns() {
        return {
            technology: {
                keywords: ['scalability', 'innovation', 'technical excellence', 'agile', 'data-driven', 'user-centric'],
                actionVerbs: ['architected', 'engineered', 'optimized', 'scaled', 'automated', 'launched'],
                metrics: ['performance improvement', 'user engagement', 'system reliability', 'development velocity'],
                tone: 'technical precision with business impact'
            },
            healthcare: {
                keywords: ['compliance', 'patient outcomes', 'clinical', 'regulatory', 'quality improvement'],
                actionVerbs: ['implemented', 'ensured', 'improved', 'standardized', 'coordinated'],
                metrics: ['patient satisfaction', 'cost reduction', 'quality scores', 'compliance rates'],
                tone: 'professional with impact focus'
            },
            finance: {
                keywords: ['risk management', 'regulatory', 'ROI', 'compliance', 'portfolio', 'analytics'],
                actionVerbs: ['analyzed', 'optimized', 'managed', 'mitigated', 'forecasted'],
                metrics: ['revenue impact', 'cost savings', 'risk reduction', 'portfolio performance'],
                tone: 'conservative professional with quantified results'
            },
            startup: {
                keywords: ['growth', 'scale', 'agile', 'innovation', 'MVP', '0-to-1', 'product-market fit'],
                actionVerbs: ['launched', 'built', 'grew', 'scaled', 'pivoted', 'iterated'],
                metrics: ['growth rates', 'user acquisition', 'market expansion', 'feature adoption'],
                tone: 'dynamic and impact-focused'
            }
        };
    }

    // Parse job description to extract requirements
    parseJobDescription(jobText) {
        console.log('🔍 Analyzing job description...\n');

        this.jobDescription = jobText;

        // Extract key requirements
        this.requirements = {
            requiredSkills: this.extractRequiredSkills(jobText),
            preferredSkills: this.extractPreferredSkills(jobText),
            keywords: this.extractKeywords(jobText),
            experience: this.extractExperience(jobText),
            education: this.extractEducation(jobText),
            companyInfo: this.extractCompanyInfo(jobText),
            culture: this.extractCultureIndicators(jobText),
            compensation: this.extractCompensationSignals(jobText)
        };

        return this.requirements;
    }

    // Extract required skills from job description
    extractRequiredSkills(jobText) {
        const skillPatterns = [
            // Technical skills
            /\b(?:JavaScript|Python|React|Node\.js|AWS|Docker|Kubernetes|SQL|Git)\b/gi,
            // Soft skills
            /\b(?:leadership|communication|collaboration|problem.solving|analytical)\b/gi,
            // Product Management skills
            /\b(?:product management|roadmap|stakeholder|user research|analytics|metrics|A\/B testing)\b/gi,
            // AI/ML skills
            /\b(?:AI|machine learning|ML|artificial intelligence|deep learning|neural networks|NLP)\b/gi
        ];

        const skills = new Set();
        skillPatterns.forEach(pattern => {
            const matches = jobText.match(pattern) || [];
            matches.forEach(match => skills.add(match.toLowerCase()));
        });

        return Array.from(skills);
    }

    // Extract preferred qualifications
    extractPreferredSkills(jobText) {
        const preferredSection = jobText.match(/(?:preferred|nice.to.have|bonus|plus)[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi);

        if (!preferredSection) return [];

        const skills = new Set();
        preferredSection.forEach(section => {
            const skillMatches = section.match(/\b(?:experience|knowledge|familiarity).*?(?:with|in)\s+([^\n.]+)/gi) || [];
            skillMatches.forEach(match => {
                const skill = match.replace(/.*(?:with|in)\s+/, '').trim();
                if (skill.length > 3) skills.add(skill);
            });
        });

        return Array.from(skills);
    }

    // Extract keywords for optimization
    extractKeywords(jobText) {
        // High-value keywords that should be naturally integrated
        const keywordPatterns = {
            technical: /\b(?:scalable|innovative|efficient|optimized|automated|streamlined)\b/gi,
            business: /\b(?:revenue|growth|ROI|KPIs|metrics|data.driven|results.oriented)\b/gi,
            leadership: /\b(?:led|managed|mentored|coached|influenced|collaborated|cross.functional)\b/gi,
            process: /\b(?:agile|scrum|lean|continuous.improvement|best.practices)\b/gi
        };

        const keywords = {};
        Object.entries(keywordPatterns).forEach(([category, pattern]) => {
            keywords[category] = [...new Set((jobText.match(pattern) || []).map(k => k.toLowerCase()))];
        });

        return keywords;
    }

    // Extract experience requirements
    extractExperience(jobText) {
        const experiencePatterns = [
            /(\d+)[\+\s]*years?\s+(?:of\s+)?experience/gi,
            /minimum\s+(\d+)\s+years/gi,
            /(\d+)[\+\s]*years?\s+(?:in|with|of)/gi
        ];

        const experiences = [];
        experiencePatterns.forEach(pattern => {
            const matches = jobText.matchAll(pattern);
            for (const match of matches) {
                experiences.push({
                    years: parseInt(match[1]),
                    context: match[0],
                    fullMatch: match.input.substring(Math.max(0, match.index - 50), match.index + match[0].length + 50)
                });
            }
        });

        return experiences.sort((a, b) => b.years - a.years);
    }

    // Extract company culture indicators
    extractCultureIndicators(jobText) {
        const cultureKeywords = {
            innovation: /\b(?:innovation|innovative|creative|cutting.edge|pioneering)\b/gi,
            collaboration: /\b(?:collaborative|teamwork|cross.functional|partnership)\b/gi,
            growth: /\b(?:growth|development|learning|career.advancement)\b/gi,
            impact: /\b(?:impact|meaningful|mission|purpose|change.the.world)\b/gi,
            fastPaced: /\b(?:fast.paced|dynamic|agile|startup|entrepreneurial)\b/gi,
            excellence: /\b(?:excellence|quality|best.in.class|world.class)\b/gi
        };

        const culture = {};
        Object.entries(cultureKeywords).forEach(([trait, pattern]) => {
            const matches = jobText.match(pattern) || [];
            culture[trait] = matches.length;
        });

        // Determine primary culture traits
        const primaryTraits = Object.entries(culture)
            .filter(([trait, count]) => count > 0)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([trait]) => trait);

        return { keywords: culture, primaryTraits };
    }

    // Optimize user content based on job requirements
    optimizeContent(userContent, targetRole = 'general') {
        console.log('✨ Optimizing content with AI enhancement...\n');

        this.userContent = userContent;
        this.optimizations = [];

        // Apply various optimization strategies
        this.optimizations.push(...this.optimizeKeywords());
        this.optimizations.push(...this.optimizeAchievements());
        this.optimizations.push(...this.optimizeActionVerbs());
        this.optimizations.push(...this.optimizeQuantification());
        this.optimizations.push(...this.optimizeIndustryLanguage(targetRole));

        return this.generateOptimizedContent();
    }

    // Optimize keyword integration
    optimizeKeywords() {
        const optimizations = [];

        if (!this.requirements.keywords) return optimizations;

        // Find opportunities to naturally integrate keywords
        Object.entries(this.requirements.keywords).forEach(([category, keywords]) => {
            keywords.forEach(keyword => {
                if (!this.userContent.toLowerCase().includes(keyword.toLowerCase())) {
                    optimizations.push({
                        type: 'keyword_integration',
                        category: category,
                        keyword: keyword,
                        priority: 'medium',
                        suggestion: `Consider naturally integrating "${keyword}" into relevant experience descriptions`
                    });
                }
            });
        });

        return optimizations;
    }

    // Optimize achievement statements
    optimizeAchievements() {
        const optimizations = [];

        // Find achievement patterns that can be enhanced
        const achievementPatterns = [
            /(?:improved|increased|reduced|enhanced|optimized|streamlined|delivered)\s+([^.]+)/gi,
            /(?:led|managed|developed|created|implemented|launched)\s+([^.]+)/gi
        ];

        achievementPatterns.forEach(pattern => {
            const matches = this.userContent.matchAll(pattern);
            for (const match of matches) {
                const achievement = match[0];
                const hasMetrics = /\d+%|\$[\d,]+|\d+x|\d+\s*(?:users|customers|team|projects)/.test(achievement);

                if (!hasMetrics) {
                    optimizations.push({
                        type: 'achievement_quantification',
                        original: achievement,
                        priority: 'high',
                        suggestion: `Add quantified metrics to: "${achievement}"`,
                        examples: [
                            `${achievement} by 35%`,
                            `${achievement}, resulting in $50K cost savings`,
                            `${achievement} across 3 teams (15 people)`
                        ]
                    });
                }
            }
        });

        return optimizations;
    }

    // Optimize action verbs for impact
    optimizeActionVerbs() {
        const optimizations = [];

        const weakVerbs = /\b(?:responsible for|duties included|worked on|helped with|involved in)\b/gi;
        const matches = this.userContent.matchAll(weakVerbs);

        for (const match of matches) {
            optimizations.push({
                type: 'action_verb_enhancement',
                original: match[0],
                priority: 'medium',
                suggestion: `Replace weak language: "${match[0]}"`,
                alternatives: ['led', 'developed', 'implemented', 'optimized', 'delivered', 'achieved']
            });
        }

        return optimizations;
    }

    // Add quantification to statements
    optimizeQuantification() {
        const optimizations = [];

        // Find statements that could benefit from quantification
        const quantifiablePatterns = [
            /improved\s+(?!.*\d)/gi,
            /increased\s+(?!.*\d)/gi,
            /reduced\s+(?!.*\d)/gi,
            /managed\s+(?!.*\d)/gi,
            /led\s+(?!.*team|.*people|\d)/gi
        ];

        quantifiablePatterns.forEach(pattern => {
            const matches = this.userContent.matchAll(pattern);
            for (const match of matches) {
                optimizations.push({
                    type: 'quantification_opportunity',
                    original: match[0],
                    priority: 'high',
                    suggestion: `Add specific metrics to quantify impact`,
                    examples: [
                        'percentage improvement (35% efficiency gain)',
                        'scope/scale (3 teams, 15 people, $2M budget)',
                        'timeline (reduced from 6 weeks to 4 weeks)',
                        'business impact ($50K cost savings, 25% revenue increase)'
                    ]
                });
            }
        });

        return optimizations;
    }

    // Apply industry-specific language optimization
    optimizeIndustryLanguage(industry) {
        const optimizations = [];

        if (!this.industryPatterns[industry]) return optimizations;

        const pattern = this.industryPatterns[industry];

        // Check for industry-appropriate keywords
        pattern.keywords.forEach(keyword => {
            if (!this.userContent.toLowerCase().includes(keyword.toLowerCase())) {
                optimizations.push({
                    type: 'industry_language',
                    industry: industry,
                    keyword: keyword,
                    priority: 'medium',
                    suggestion: `Consider using industry-relevant term: "${keyword}"`
                });
            }
        });

        return optimizations;
    }

    // Generate optimized content with suggestions applied
    generateOptimizedContent() {
        const results = {
            originalContent: this.userContent,
            optimizations: this.optimizations,
            prioritizedSuggestions: this.prioritizeOptimizations(),
            optimizedExamples: this.generateOptimizedExamples(),
            overallScore: this.calculateContentScore(),
            improvementPotential: this.calculateImprovementPotential()
        };

        return results;
    }

    // Prioritize optimizations by impact and effort
    prioritizeOptimizations() {
        const priorityWeights = { high: 3, medium: 2, low: 1 };

        return this.optimizations
            .sort((a, b) => priorityWeights[b.priority] - priorityWeights[a.priority])
            .slice(0, 10); // Top 10 recommendations
    }

    // Generate example optimizations
    generateOptimizedExamples() {
        const examples = [];

        // Find a few key achievements to demonstrate optimization
        const achievementMatches = this.userContent.match(/(?:led|managed|developed|improved|increased|reduced)[^.]+\./gi) || [];

        achievementMatches.slice(0, 3).forEach(original => {
            examples.push({
                original: original.trim(),
                enhanced: this.enhanceAchievementExample(original.trim()),
                improvements: this.identifyImprovements(original.trim())
            });
        });

        return examples;
    }

    // Enhance a single achievement example
    enhanceAchievementExample(achievement) {
        let enhanced = achievement;

        // Add quantification if missing
        if (!/\d+/.test(enhanced)) {
            enhanced = enhanced.replace(/improved/i, 'improved by 35%');
            enhanced = enhanced.replace(/increased/i, 'increased by 40%');
            enhanced = enhanced.replace(/reduced/i, 'reduced by 25%');
            enhanced = enhanced.replace(/led/i, 'led cross-functional team of 8');
            enhanced = enhanced.replace(/managed/i, 'managed $2M budget for');
        }

        // Add context and scope
        if (!/team|people|department/i.test(enhanced)) {
            enhanced = enhanced.replace(/project/i, 'enterprise-level project');
            enhanced = enhanced.replace(/system/i, 'company-wide system');
        }

        // Add business impact
        if (!/revenue|cost|savings|ROI/i.test(enhanced)) {
            enhanced += ', resulting in $150K annual cost savings';
        }

        return enhanced;
    }

    // Identify specific improvements made
    identifyImprovements(original) {
        const improvements = [];

        if (!/\d+/.test(original)) {
            improvements.push('Added quantified metrics');
        }

        if (!/team|people|department|cross-functional/i.test(original)) {
            improvements.push('Added scope and scale context');
        }

        if (!/revenue|cost|savings|ROI|impact/i.test(original)) {
            improvements.push('Connected to business impact');
        }

        return improvements;
    }

    // Calculate content quality score
    calculateContentScore() {
        let score = 0;
        const maxScore = 100;

        // Quantification score (30 points)
        const quantifiedStatements = (this.userContent.match(/\d+%|\$[\d,]+|\d+x|\d+\s*(?:users|people|team)/g) || []).length;
        const totalStatements = (this.userContent.match(/[.!]/g) || []).length;
        const quantificationScore = Math.min(30, (quantifiedStatements / Math.max(totalStatements, 1)) * 30);
        score += quantificationScore;

        // Action verb strength (20 points)
        const strongVerbs = (this.userContent.match(/\b(?:led|developed|implemented|optimized|achieved|delivered|launched|created)\b/gi) || []).length;
        const actionVerbScore = Math.min(20, (strongVerbs / Math.max(totalStatements, 1)) * 20);
        score += actionVerbScore;

        // Keyword integration (25 points)
        if (this.requirements.keywords) {
            const totalKeywords = Object.values(this.requirements.keywords).flat().length;
            const foundKeywords = Object.values(this.requirements.keywords).flat().filter(keyword =>
                this.userContent.toLowerCase().includes(keyword.toLowerCase())
            ).length;
            const keywordScore = totalKeywords > 0 ? (foundKeywords / totalKeywords) * 25 : 20;
            score += keywordScore;
        } else {
            score += 20; // Default score if no job description
        }

        // Content depth and specificity (25 points)
        const specificityIndicators = (this.userContent.match(/\b(?:enterprise|company-wide|cross-functional|strategic|technical|business)\b/gi) || []).length;
        const specificityScore = Math.min(25, (specificityIndicators / Math.max(totalStatements, 1)) * 25);
        score += specificityScore;

        return Math.round(score);
    }

    // Calculate improvement potential
    calculateImprovementPotential() {
        const currentScore = this.calculateContentScore();
        const highPriorityOptimizations = this.optimizations.filter(opt => opt.priority === 'high').length;
        const mediumPriorityOptimizations = this.optimizations.filter(opt => opt.priority === 'medium').length;

        const potentialGain = (highPriorityOptimizations * 8) + (mediumPriorityOptimizations * 4);
        const projectedScore = Math.min(100, currentScore + potentialGain);

        return {
            current: currentScore,
            projected: projectedScore,
            gain: projectedScore - currentScore,
            optimizationsCount: this.optimizations.length
        };
    }

    // Generate comprehensive report
    generateReport() {
        const optimizedContent = this.generateOptimizedContent();

        const report = {
            jobAnalysis: {
                requiredSkills: this.requirements.requiredSkills?.length || 0,
                keywords: Object.values(this.requirements.keywords || {}).flat().length,
                experienceYears: this.requirements.experience?.[0]?.years || 0,
                cultureTraits: this.requirements.culture?.primaryTraits || []
            },
            contentAnalysis: {
                originalScore: optimizedContent.overallScore,
                projectedScore: optimizedContent.improvementPotential.projected,
                improvementGain: optimizedContent.improvementPotential.gain,
                optimizationsCount: optimizedContent.optimizations.length
            },
            topRecommendations: optimizedContent.prioritizedSuggestions.slice(0, 5),
            optimizedExamples: optimizedContent.optimizedExamples,
            competitiveAnalysis: this.generateCompetitiveAnalysis(optimizedContent.overallScore)
        };

        return report;
    }

    // Generate competitive analysis
    generateCompetitiveAnalysis(score) {
        const benchmarks = {
            poor: { min: 0, max: 50, percentile: 20, message: "Below average - significant optimization needed" },
            fair: { min: 51, max: 65, percentile: 45, message: "Average - good foundation with room for improvement" },
            good: { min: 66, max: 80, percentile: 70, message: "Above average - strong content with optimization opportunities" },
            excellent: { min: 81, max: 100, percentile: 90, message: "Excellent - highly competitive content" }
        };

        const category = Object.values(benchmarks).find(b => score >= b.min && score <= b.max);

        return {
            score: score,
            percentile: category.percentile,
            category: category.message,
            competitiveAdvantage: score >= 80 ? 'Strong' : score >= 65 ? 'Moderate' : 'Needs Improvement'
        };
    }

    // Save optimization results
    saveResults(outputPath, results) {
        writeFileSync(outputPath, JSON.stringify(results, null, 2));
        return results;
    }

    // Interactive CLI display
    displayInteractiveResults(results) {
        console.clear();
        console.log('🤖 AI Content Optimization Results');
        console.log('═'.repeat(60));

        console.log(`\n📊 Content Quality Score: ${results.contentAnalysis.originalScore}/100`);
        console.log(`🎯 Projected Score: ${results.contentAnalysis.projectedScore}/100 (+${results.contentAnalysis.improvementGain} points)`);
        console.log(`🚀 Optimization Potential: ${results.contentAnalysis.optimizationsCount} improvements identified\n`);

        // Job analysis
        if (results.jobAnalysis.requiredSkills > 0) {
            console.log('📋 Job Analysis:');
            console.log(`   Required Skills: ${results.jobAnalysis.requiredSkills}`);
            console.log(`   Keywords Found: ${results.jobAnalysis.keywords}`);
            console.log(`   Experience Required: ${results.jobAnalysis.experienceYears}+ years`);
            console.log(`   Culture Traits: ${results.jobAnalysis.cultureTraits.join(', ')}\n`);
        }

        // Top recommendations
        console.log('💡 Priority Optimizations:');
        results.topRecommendations.forEach((rec, i) => {
            const icon = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
            console.log(`   ${i + 1}. ${icon} ${rec.suggestion}`);
        });

        // Example optimizations
        if (results.optimizedExamples.length > 0) {
            console.log('\n✨ Example Enhancements:');
            results.optimizedExamples.slice(0, 2).forEach((example, i) => {
                console.log(`\n   Example ${i + 1}:`);
                console.log(`   Before: ${example.original}`);
                console.log(`   After:  ${example.enhanced}`);
                console.log(`   Improvements: ${example.improvements.join(', ')}`);
            });
        }

        // Competitive analysis
        console.log(`\n📈 Competitive Analysis:`);
        console.log(`   Market Position: ${results.competitiveAnalysis.percentile}th percentile`);
        console.log(`   Competitive Advantage: ${results.competitiveAnalysis.competitiveAdvantage}`);
        console.log(`   Assessment: ${results.competitiveAnalysis.category}`);

        console.log('\n' + '═'.repeat(60));
        return results;
    }
}

// CLI interface
if (import.meta.main) {
    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.log(`
🤖 AI Content Optimizer - Career Intelligence Plugin

Usage:
  bun content-enhancer.js <content-file> [options]
  bun content-enhancer.js <content-file> <job-description-file> [options]

Options:
  --industry <tech|healthcare|finance|startup>   Industry-specific optimization
  --output <file>                                Save results to file
  --interactive                                  Interactive display mode
  --format <json|text>                          Output format

Examples:
  bun content-enhancer.js resume.md
  bun content-enhancer.js resume.md job-posting.txt --industry tech
  bun content-enhancer.js resume.md --interactive --output report.json

Features:
  ✅ AI-powered content analysis and optimization
  ✅ Job description parsing and requirement extraction
  ✅ Industry-specific language optimization
  ✅ Quantified achievement enhancement
  ✅ Keyword integration and ATS optimization
  ✅ Competitive analysis and benchmarking
        `);
        process.exit(1);
    }

    const contentFile = args[0];
    const jobDescFile = args[1] && !args[1].startsWith('--') ? args[1] : null;
    const industry = args.includes('--industry') ? args[args.indexOf('--industry') + 1] : 'tech';
    const interactive = args.includes('--interactive');
    const outputFile = args.includes('--output') ? args[args.indexOf('--output') + 1] : null;

    try {
        const enhancer = new AIContentEnhancer();

        // Load content
        const userContent = readFileSync(contentFile, 'utf8');

        // Load job description if provided
        if (jobDescFile && existsSync(jobDescFile)) {
            const jobDescription = readFileSync(jobDescFile, 'utf8');
            enhancer.parseJobDescription(jobDescription);
        }

        // Optimize content
        enhancer.optimizeContent(userContent, industry);
        const report = enhancer.generateReport();

        if (interactive) {
            enhancer.displayInteractiveResults(report);
        } else {
            console.log('🤖 AI Content Optimization Complete!');
            console.log(`📊 Quality Score: ${report.contentAnalysis.originalScore}/100`);
            console.log(`🎯 Potential: +${report.contentAnalysis.improvementGain} points with optimization`);
            console.log(`💡 Recommendations: ${report.contentAnalysis.optimizationsCount} improvements identified`);

            if (outputFile) {
                enhancer.saveResults(outputFile, report);
                console.log(`\n📁 Detailed report saved to: ${outputFile}`);
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

export default AIContentEnhancer;
export { AIContentEnhancer, AIContentEnhancer as ContentEnhancer };