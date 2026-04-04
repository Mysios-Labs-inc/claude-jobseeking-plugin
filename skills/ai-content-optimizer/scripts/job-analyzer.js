#!/usr/bin/env bun
// Job Description Analyzer - Extract requirements and generate optimization insights

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

class JobDescriptionAnalyzer {
    constructor() {
        this.jobText = '';
        this.analysis = {};
        this.companyPatterns = this.loadCompanyPatterns();
        this.industryKeywords = this.loadIndustryKeywords();
    }

    // Load company-specific patterns for analysis
    loadCompanyPatterns() {
        return {
            faang: {
                companies: ['google', 'facebook', 'meta', 'amazon', 'apple', 'netflix'],
                keywords: ['scale', 'impact', 'innovation', 'technical excellence', 'leadership principles'],
                culture: 'data-driven, high-performance, innovation-focused',
                expectations: 'high bar for technical and leadership competency'
            },
            startups: {
                indicators: ['equity', 'stock options', '0-to-1', 'early stage', 'series a', 'series b'],
                keywords: ['agile', 'fast-paced', 'wear many hats', 'startup', 'growth'],
                culture: 'entrepreneurial, flexible, high-growth',
                expectations: 'adaptability, ownership mentality, broad skill set'
            },
            enterprise: {
                indicators: ['fortune 500', 'global', 'enterprise', 'established'],
                keywords: ['compliance', 'governance', 'process', 'scale', 'enterprise'],
                culture: 'structured, process-oriented, stability-focused',
                expectations: 'process adherence, risk management, stakeholder management'
            }
        };
    }

    // Load industry-specific keywords
    loadIndustryKeywords() {
        return {
            technology: {
                core: ['software', 'engineering', 'development', 'technical', 'platform', 'system'],
                emerging: ['AI', 'ML', 'machine learning', 'artificial intelligence', 'blockchain', 'IoT'],
                processes: ['agile', 'scrum', 'devops', 'ci/cd', 'microservices', 'cloud']
            },
            product: {
                core: ['product management', 'roadmap', 'strategy', 'user experience', 'stakeholder'],
                metrics: ['analytics', 'metrics', 'KPIs', 'A/B testing', 'user research', 'data-driven'],
                leadership: ['cross-functional', 'collaboration', 'influence', 'prioritization']
            },
            data: {
                core: ['data science', 'analytics', 'machine learning', 'statistics', 'modeling'],
                tools: ['python', 'sql', 'pandas', 'scikit-learn', 'tensorflow', 'tableau'],
                business: ['insights', 'recommendations', 'decision-making', 'business intelligence']
            },
            design: {
                core: ['user experience', 'user interface', 'design', 'prototyping', 'wireframes'],
                tools: ['figma', 'sketch', 'adobe', 'invision', 'principle'],
                process: ['design thinking', 'user research', 'usability', 'accessibility']
            }
        };
    }

    // Analyze complete job description
    analyzeJobDescription(jobText) {
        console.log('🔍 Analyzing job description comprehensively...\n');

        this.jobText = jobText;

        this.analysis = {
            basicInfo: this.extractBasicInfo(),
            requirements: this.extractRequirements(),
            skills: this.extractSkills(),
            experience: this.extractExperienceRequirements(),
            education: this.extractEducationRequirements(),
            compensation: this.extractCompensationInfo(),
            companyAnalysis: this.analyzeCompanyType(),
            cultureAnalysis: this.analyzeCulture(),
            competitionAnalysis: this.analyzeCompetitiveness(),
            optimizationStrategy: this.generateOptimizationStrategy(),
            matchingStrategy: this.generateMatchingStrategy()
        };

        return this.analysis;
    }

    // Extract basic job information
    extractBasicInfo() {
        const titleMatch = this.jobText.match(/(?:position|role|job title):\s*(.+)/i) ||
                          this.jobText.match(/^(.+?)(?:\n|$)/);

        const locationMatch = this.jobText.match(/location[:\s]+(.+?)(?:\n|$)/i);
        const remoteMatch = this.jobText.match(/\b(remote|hybrid|on-site|distributed)\b/i);

        return {
            title: titleMatch ? titleMatch[1].trim() : 'Not specified',
            location: locationMatch ? locationMatch[1].trim() : 'Not specified',
            workMode: remoteMatch ? remoteMatch[1].toLowerCase() : 'not specified',
            jobType: this.determineJobType()
        };
    }

    // Determine job type/category
    determineJobType() {
        const jobTypePatterns = {
            'product_management': /product manager|pm|product owner/i,
            'engineering': /software engineer|developer|swe|backend|frontend|fullstack/i,
            'data_science': /data scientist|data analyst|ml engineer|machine learning/i,
            'design': /designer|ux|ui|product design|user experience/i,
            'marketing': /marketing|growth|demand generation|content/i,
            'sales': /sales|business development|account manager/i,
            'leadership': /director|vp|head of|chief|ceo|cto|cpo/i
        };

        for (const [type, pattern] of Object.entries(jobTypePatterns)) {
            if (pattern.test(this.jobText)) {
                return type;
            }
        }

        return 'general';
    }

    // Extract detailed requirements
    extractRequirements() {
        const requirements = {
            must_have: this.extractMustHaveRequirements(),
            preferred: this.extractPreferredRequirements(),
            responsibilities: this.extractResponsibilities(),
            success_metrics: this.extractSuccessMetrics()
        };

        return requirements;
    }

    // Extract must-have requirements
    extractMustHaveRequirements() {
        const mustHavePatterns = [
            /(?:required|must have|essential)[:\s]+([\s\S]*?)(?=\n\n|\npreferred|\nnice to have|$)/i,
            /(?:requirements|qualifications)[:\s]+([\s\S]*?)(?=\n\n|\npreferred|\nnice to have|$)/i
        ];

        const mustHaves = [];

        mustHavePatterns.forEach(pattern => {
            const match = this.jobText.match(pattern);
            if (match) {
                const items = match[1].split(/\n|•|-|\*/).filter(item => item.trim().length > 10);
                mustHaves.push(...items.map(item => item.trim()));
            }
        });

        return [...new Set(mustHaves)];
    }

    // Extract preferred qualifications
    extractPreferredRequirements() {
        const preferredPatterns = [
            /(?:preferred|nice to have|bonus|plus)[:\s]+([\s\S]*?)(?=\n\n|$)/i,
            /(?:would be a plus|ideal candidate)[:\s]+([\s\S]*?)(?=\n\n|$)/i
        ];

        const preferred = [];

        preferredPatterns.forEach(pattern => {
            const match = this.jobText.match(pattern);
            if (match) {
                const items = match[1].split(/\n|•|-|\*/).filter(item => item.trim().length > 10);
                preferred.push(...items.map(item => item.trim()));
            }
        });

        return [...new Set(preferred)];
    }

    // Extract responsibilities
    extractResponsibilities() {
        const responsibilityPatterns = [
            /(?:responsibilities|you will|what you'll do)[:\s]+([\s\S]*?)(?=\n\n|\nrequirements|\nqualifications|$)/i,
            /(?:role|position) (?:overview|description)[:\s]+([\s\S]*?)(?=\n\n|\nrequirements|$)/i
        ];

        const responsibilities = [];

        responsibilityPatterns.forEach(pattern => {
            const match = this.jobText.match(pattern);
            if (match) {
                const items = match[1].split(/\n|•|-|\*/).filter(item => item.trim().length > 15);
                responsibilities.push(...items.map(item => item.trim()));
            }
        });

        return [...new Set(responsibilities)];
    }

    // Extract success metrics mentioned in job description
    extractSuccessMetrics() {
        const metricPatterns = [
            /(\d+(?:\.\d+)?[%])/g,  // Percentages
            /(\$[\d,]+[kKmMbB]?)/g, // Money amounts
            /(\d+(?:\.\d+)?[xX])/g, // Multipliers
            /(\d+\s*(?:million|thousand|billion))/gi // Large numbers
        ];

        const metrics = new Set();

        metricPatterns.forEach(pattern => {
            const matches = this.jobText.match(pattern) || [];
            matches.forEach(match => metrics.add(match));
        });

        // Extract contextual success indicators
        const successPatterns = [
            /increase.*?by\s*(\d+[%]?)/gi,
            /reduce.*?by\s*(\d+[%]?)/gi,
            /grow.*?to\s*(\d+)/gi,
            /achieve.*?(\d+[%]?)/gi
        ];

        successPatterns.forEach(pattern => {
            const matches = this.jobText.matchAll(pattern);
            for (const match of matches) {
                metrics.add(match[0]);
            }
        });

        return Array.from(metrics);
    }

    // Comprehensive skills extraction
    extractSkills() {
        const skills = {
            technical: this.extractTechnicalSkills(),
            soft: this.extractSoftSkills(),
            leadership: this.extractLeadershipSkills(),
            domain: this.extractDomainSkills(),
            tools: this.extractToolsAndPlatforms()
        };

        // Calculate skill priority based on frequency and context
        skills.prioritized = this.prioritizeSkills(skills);

        return skills;
    }

    // Extract technical skills
    extractTechnicalSkills() {
        const techPatterns = [
            // Programming languages
            /\b(?:JavaScript|Python|Java|C\+\+|Go|Rust|TypeScript|PHP|Ruby|Swift|Kotlin)\b/gi,
            // Frameworks and libraries
            /\b(?:React|Angular|Vue|Node\.js|Express|Django|Flask|Spring|Laravel)\b/gi,
            // Cloud and infrastructure
            /\b(?:AWS|Azure|GCP|Docker|Kubernetes|Terraform|Jenkins|CI\/CD)\b/gi,
            // Databases
            /\b(?:PostgreSQL|MySQL|MongoDB|Redis|Elasticsearch|Snowflake|BigQuery)\b/gi,
            // Data and ML
            /\b(?:Pandas|NumPy|TensorFlow|PyTorch|Scikit-learn|Spark|Hadoop|Tableau)\b/gi
        ];

        const technicalSkills = new Set();

        techPatterns.forEach(pattern => {
            const matches = this.jobText.match(pattern) || [];
            matches.forEach(skill => technicalSkills.add(skill));
        });

        return Array.from(technicalSkills);
    }

    // Extract soft skills
    extractSoftSkills() {
        const softSkillPatterns = [
            /\b(?:communication|collaboration|leadership|problem.solving|analytical|creative)\b/gi,
            /\b(?:teamwork|adaptability|time.management|attention.to.detail|critical.thinking)\b/gi,
            /\b(?:emotional.intelligence|empathy|resilience|curiosity|initiative)\b/gi
        ];

        const softSkills = new Set();

        softSkillPatterns.forEach(pattern => {
            const matches = this.jobText.match(pattern) || [];
            matches.forEach(skill => softSkills.add(skill.toLowerCase()));
        });

        return Array.from(softSkills);
    }

    // Extract leadership skills
    extractLeadershipSkills() {
        const leadershipPatterns = [
            /\b(?:mentor|coach|lead|manage|influence|delegate|inspire)\b/gi,
            /\b(?:team.building|strategic.thinking|decision.making|conflict.resolution)\b/gi,
            /\b(?:cross.functional|stakeholder.management|vision|culture)\b/gi
        ];

        const leadershipSkills = new Set();

        leadershipPatterns.forEach(pattern => {
            const matches = this.jobText.match(pattern) || [];
            matches.forEach(skill => leadershipSkills.add(skill.toLowerCase()));
        });

        return Array.from(leadershipSkills);
    }

    // Extract domain-specific skills
    extractDomainSkills() {
        const jobType = this.analysis?.basicInfo?.jobType || this.determineJobType();
        const industryKeywords = this.industryKeywords[jobType.split('_')[0]] || {};

        const domainSkills = new Set();

        Object.values(industryKeywords).flat().forEach(keyword => {
            if (new RegExp(`\\b${keyword}\\b`, 'i').test(this.jobText)) {
                domainSkills.add(keyword);
            }
        });

        return Array.from(domainSkills);
    }

    // Extract tools and platforms
    extractToolsAndPlatforms() {
        const toolPatterns = [
            // Design tools
            /\b(?:Figma|Sketch|Adobe|Photoshop|Illustrator|InVision|Principle)\b/gi,
            // Analytics tools
            /\b(?:Google.Analytics|Mixpanel|Amplitude|Segment|Looker|Tableau|PowerBI)\b/gi,
            // Project management
            /\b(?:Jira|Asana|Trello|Monday|Linear|Notion|Confluence|Slack)\b/gi,
            // Development tools
            /\b(?:Git|GitHub|GitLab|VS.Code|IntelliJ|Postman|Swagger)\b/gi
        ];

        const tools = new Set();

        toolPatterns.forEach(pattern => {
            const matches = this.jobText.match(pattern) || [];
            matches.forEach(tool => tools.add(tool));
        });

        return Array.from(tools);
    }

    // Prioritize skills based on context and frequency
    prioritizeSkills(skills) {
        const allSkills = [...skills.technical, ...skills.soft, ...skills.leadership, ...skills.domain, ...skills.tools];
        const skillCounts = {};

        // Count occurrences and context importance
        allSkills.forEach(skill => {
            const pattern = new RegExp(`\\b${skill}\\b`, 'gi');
            const matches = this.jobText.match(pattern) || [];

            // Check if skill appears in important sections
            const inRequirements = new RegExp(`requirements[\\s\\S]*?${skill}`, 'gi').test(this.jobText);
            const inResponsibilities = new RegExp(`responsibilities[\\s\\S]*?${skill}`, 'gi').test(this.jobText);

            skillCounts[skill] = {
                frequency: matches.length,
                inRequirements: inRequirements,
                inResponsibilities: inResponsibilities,
                priority: this.calculateSkillPriority(matches.length, inRequirements, inResponsibilities)
            };
        });

        // Sort by priority
        return Object.entries(skillCounts)
            .sort(([,a], [,b]) => b.priority - a.priority)
            .slice(0, 15)
            .map(([skill, data]) => ({ skill, ...data }));
    }

    // Calculate skill priority score
    calculateSkillPriority(frequency, inRequirements, inResponsibilities) {
        let score = frequency;
        if (inRequirements) score += 5;
        if (inResponsibilities) score += 3;
        return score;
    }

    // Extract experience requirements
    extractExperienceRequirements() {
        const experiencePatterns = [
            /(\d+)[\+\s]*years?\s+(?:of\s+)?(?:experience|background)/gi,
            /minimum\s+(\d+)\s+years/gi,
            /(\d+)[\+\s]*years?\s+(?:in|with|of|working)/gi,
            /experience[:\s]+(\d+)[\+\s]*years/gi
        ];

        const experiences = [];

        experiencePatterns.forEach(pattern => {
            const matches = this.jobText.matchAll(pattern);
            for (const match of matches) {
                const context = this.jobText.substring(
                    Math.max(0, match.index - 100),
                    match.index + match[0].length + 100
                );

                experiences.push({
                    years: parseInt(match[1]),
                    context: match[0],
                    fullContext: context.trim(),
                    requirement: this.categorizeExperienceRequirement(context)
                });
            }
        });

        // Remove duplicates and sort by years
        const uniqueExperiences = experiences.filter((exp, index, self) =>
            index === self.findIndex(e => e.years === exp.years && e.requirement === exp.requirement)
        ).sort((a, b) => b.years - a.years);

        return {
            overall: uniqueExperiences[0]?.years || 0,
            specific: uniqueExperiences,
            categories: this.categorizeExperienceRequirements(uniqueExperiences)
        };
    }

    // Categorize experience requirement
    categorizeExperienceRequirement(context) {
        const categories = {
            'leadership': /lead|manag|supervis|director|team/i,
            'technical': /technical|engineering|development|programming|coding/i,
            'domain': /product|marketing|sales|design|data|analytics/i,
            'industry': /industry|domain|vertical|sector/i,
            'general': /.*/
        };

        for (const [category, pattern] of Object.entries(categories)) {
            if (pattern.test(context)) {
                return category;
            }
        }

        return 'general';
    }

    // Categorize all experience requirements
    categorizeExperienceRequirements(experiences) {
        const categories = {};

        experiences.forEach(exp => {
            if (!categories[exp.requirement]) {
                categories[exp.requirement] = [];
            }
            categories[exp.requirement].push(exp);
        });

        return categories;
    }

    // Analyze company type and culture
    analyzeCompanyType() {
        const companyAnalysis = {
            type: 'unknown',
            indicators: [],
            culturalSignals: [],
            expectations: []
        };

        // Check for company type indicators
        Object.entries(this.companyPatterns).forEach(([type, pattern]) => {
            if (pattern.companies) {
                const companyMatch = pattern.companies.some(company =>
                    new RegExp(company, 'i').test(this.jobText)
                );
                if (companyMatch) {
                    companyAnalysis.type = type;
                    companyAnalysis.indicators.push('Company name match');
                }
            }

            if (pattern.indicators) {
                const indicatorMatches = pattern.indicators.filter(indicator =>
                    new RegExp(indicator, 'i').test(this.jobText)
                );
                if (indicatorMatches.length > 0) {
                    companyAnalysis.type = type;
                    companyAnalysis.indicators.push(...indicatorMatches);
                }
            }

            if (pattern.keywords) {
                const keywordMatches = pattern.keywords.filter(keyword =>
                    new RegExp(keyword, 'i').test(this.jobText)
                );
                companyAnalysis.culturalSignals.push(...keywordMatches);
            }
        });

        return companyAnalysis;
    }

    // Analyze company culture from job description
    analyzeCulture() {
        const cultureKeywords = {
            innovation: /\b(?:innovation|innovative|creative|cutting.edge|pioneering|disruptive)\b/gi,
            collaboration: /\b(?:collaborative|teamwork|cross.functional|partnership|inclusive)\b/gi,
            growth: /\b(?:growth|learning|development|career.advancement|opportunity)\b/gi,
            impact: /\b(?:impact|meaningful|mission|purpose|change.the.world|difference)\b/gi,
            fastPaced: /\b(?:fast.paced|dynamic|agile|startup|entrepreneurial|rapid)\b/gi,
            dataOriented: /\b(?:data.driven|analytical|metrics|evidence.based|measurement)\b/gi,
            customerFocus: /\b(?:customer.centric|user.focused|customer.obsessed|user.experience)\b/gi,
            quality: /\b(?:excellence|quality|best.in.class|world.class|high.standards)\b/gi
        };

        const cultureScores = {};
        const totalWords = this.jobText.split(/\s+/).length;

        Object.entries(cultureKeywords).forEach(([trait, pattern]) => {
            const matches = this.jobText.match(pattern) || [];
            cultureScores[trait] = {
                count: matches.length,
                frequency: (matches.length / totalWords * 1000).toFixed(2), // per 1000 words
                examples: matches.slice(0, 3)
            };
        });

        // Identify dominant culture traits
        const dominantTraits = Object.entries(cultureScores)
            .filter(([trait, data]) => data.count > 0)
            .sort(([,a], [,b]) => b.count - a.count)
            .slice(0, 5);

        return {
            scores: cultureScores,
            dominantTraits: dominantTraits.map(([trait, data]) => ({ trait, ...data })),
            culturalEmphasis: this.determineCulturalEmphasis(dominantTraits)
        };
    }

    // Determine overall cultural emphasis
    determineCulturalEmphasis(dominantTraits) {
        if (dominantTraits.length === 0) return 'neutral';

        const topTrait = dominantTraits[0][0];
        const emphasisMap = {
            innovation: 'innovation-driven',
            collaboration: 'team-oriented',
            growth: 'development-focused',
            impact: 'mission-driven',
            fastPaced: 'high-energy',
            dataOriented: 'analytical',
            customerFocus: 'customer-obsessed',
            quality: 'excellence-focused'
        };

        return emphasisMap[topTrait] || 'balanced';
    }

    // Analyze job competitiveness
    analyzeCompetitiveness() {
        let competitiveScore = 0;
        const factors = [];

        // High experience requirements
        const maxExperience = this.analysis?.experience?.overall || 0;
        if (maxExperience >= 8) {
            competitiveScore += 3;
            factors.push('Senior experience required (8+ years)');
        } else if (maxExperience >= 5) {
            competitiveScore += 2;
            factors.push('Mid-senior experience (5+ years)');
        }

        // Multiple technical skills required
        const techSkillCount = this.analysis?.skills?.technical?.length || 0;
        if (techSkillCount >= 8) {
            competitiveScore += 3;
            factors.push('Extensive technical skills required');
        } else if (techSkillCount >= 5) {
            competitiveScore += 2;
            factors.push('Multiple technical skills required');
        }

        // Leadership requirements
        const leadershipSkills = this.analysis?.skills?.leadership?.length || 0;
        if (leadershipSkills >= 5) {
            competitiveScore += 2;
            factors.push('Strong leadership skills required');
        }

        // Advanced degree mentioned
        if (/\b(?:phd|doctorate|advanced degree|masters preferred)\b/i.test(this.jobText)) {
            competitiveScore += 2;
            factors.push('Advanced degree preferred');
        }

        // FAANG or top company
        if (this.analysis?.companyAnalysis?.type === 'faang') {
            competitiveScore += 3;
            factors.push('Top-tier company (high competition)');
        }

        // Determine competitiveness level
        let level;
        if (competitiveScore >= 8) level = 'highly_competitive';
        else if (competitiveScore >= 5) level = 'competitive';
        else if (competitiveScore >= 3) level = 'moderately_competitive';
        else level = 'standard';

        return {
            score: competitiveScore,
            level: level,
            factors: factors,
            recommendation: this.generateCompetitivenessRecommendation(level)
        };
    }

    // Generate competitiveness recommendation
    generateCompetitivenessRecommendation(level) {
        const recommendations = {
            highly_competitive: 'Exceptional applications required. Focus on quantified achievements, industry leadership, and unique value proposition.',
            competitive: 'Strong applications needed. Emphasize relevant experience, technical depth, and measurable impact.',
            moderately_competitive: 'Solid applications expected. Highlight relevant skills, achievements, and culture fit.',
            standard: 'Standard application quality. Focus on clear experience alignment and basic requirements.'
        };

        return recommendations[level];
    }

    // Generate optimization strategy
    generateOptimizationStrategy() {
        const strategy = {
            keywordPriority: this.analysis?.skills?.prioritized?.slice(0, 10).map(s => s.skill) || [],
            contentFocus: this.determineContentFocus(),
            achievementFramework: this.determineAchievementFramework(),
            culturalAlignment: this.determineCulturalAlignment(),
            differentiationOpportunities: this.identifyDifferentiationOpportunities()
        };

        return strategy;
    }

    // Determine content focus strategy
    determineContentFocus() {
        const jobType = this.analysis?.basicInfo?.jobType || 'general';
        const experienceLevel = this.analysis?.experience?.overall || 0;
        const companyType = this.analysis?.companyAnalysis?.type || 'unknown';

        const focusStrategies = {
            product_management: {
                early: 'Feature delivery, user research, cross-functional collaboration',
                mid: 'Product strategy, roadmap ownership, stakeholder management',
                senior: 'Product vision, team leadership, business impact'
            },
            engineering: {
                early: 'Technical implementation, code quality, learning agility',
                mid: 'System design, technical leadership, project ownership',
                senior: 'Architecture decisions, team leadership, technical strategy'
            },
            data_science: {
                early: 'Model development, data analysis, technical skills',
                mid: 'Business insights, project leadership, stakeholder communication',
                senior: 'Data strategy, team leadership, business transformation'
            }
        };

        const level = experienceLevel >= 8 ? 'senior' : experienceLevel >= 5 ? 'mid' : 'early';
        return focusStrategies[jobType]?.[level] || 'General professional experience and growth';
    }

    // Determine achievement framework
    determineAchievementFramework() {
        const culturalEmphasis = this.analysis?.cultureAnalysis?.culturalEmphasis || 'balanced';
        const companyType = this.analysis?.companyAnalysis?.type || 'unknown';

        const frameworks = {
            'innovation-driven': 'Emphasize creative solutions, new initiatives, and breakthrough results',
            'data-driven': 'Focus on quantified metrics, analytical insights, and measured outcomes',
            'mission-driven': 'Highlight impact on users, customers, and broader mission achievement',
            'excellence-focused': 'Showcase quality improvements, best practices, and exceptional results',
            'team-oriented': 'Emphasize collaboration, team building, and collective achievements'
        };

        return frameworks[culturalEmphasis] || 'Focus on quantified business results and professional growth';
    }

    // Generate matching strategy for job application
    generateMatchingStrategy() {
        const strategy = {
            mustHaveAlignment: this.assessMustHaveAlignment(),
            skillGapAnalysis: this.analyzeSkillGaps(),
            strengthHighlighting: this.identifyStrengthsToHighlight(),
            compensationStrategy: this.generateCompensationStrategy(),
            applicationTimeline: this.recommendApplicationTimeline()
        };

        return strategy;
    }

    // Assess must-have requirement alignment
    assessMustHaveAlignment() {
        // This would typically compare against user profile
        // For now, return structure for analysis
        return {
            criticalRequirements: this.analysis?.requirements?.must_have || [],
            alignmentGaps: [],
            strengthAreas: [],
            recommendation: 'Ensure strong alignment with critical requirements before applying'
        };
    }

    // Analyze skill gaps
    analyzeSkillGaps() {
        const topSkills = this.analysis?.skills?.prioritized?.slice(0, 15) || [];

        return {
            highPrioritySkills: topSkills.slice(0, 8),
            developmentOpportunities: topSkills.slice(8),
            learningRecommendations: this.generateLearningRecommendations(topSkills)
        };
    }

    // Generate learning recommendations
    generateLearningRecommendations(skills) {
        const recommendations = [];

        skills.forEach(skill => {
            if (skill.priority >= 8) {
                recommendations.push({
                    skill: skill.skill,
                    priority: 'high',
                    timeToLearn: 'immediate',
                    resources: ['Online courses', 'Hands-on projects', 'Industry certifications']
                });
            }
        });

        return recommendations.slice(0, 5);
    }

    // Save analysis results
    saveAnalysis(outputPath) {
        const fullAnalysis = {
            jobText: this.jobText,
            analysis: this.analysis,
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };

        writeFileSync(outputPath, JSON.stringify(fullAnalysis, null, 2));
        return fullAnalysis;
    }

    // Interactive display of results
    displayInteractiveAnalysis() {
        console.clear();
        console.log('🔍 Job Description Analysis Results');
        console.log('═'.repeat(70));

        // Basic info
        console.log(`\n📋 Job Information:`);
        console.log(`   Title: ${this.analysis.basicInfo.title}`);
        console.log(`   Type: ${this.analysis.basicInfo.jobType}`);
        console.log(`   Location: ${this.analysis.basicInfo.location}`);
        console.log(`   Work Mode: ${this.analysis.basicInfo.workMode}`);

        // Experience requirements
        console.log(`\n📈 Experience Requirements:`);
        console.log(`   Overall: ${this.analysis.experience.overall}+ years`);
        if (this.analysis.experience.specific.length > 0) {
            this.analysis.experience.specific.slice(0, 3).forEach(exp => {
                console.log(`   ${exp.requirement}: ${exp.years} years - ${exp.context}`);
            });
        }

        // Top skills
        console.log(`\n💻 Top Required Skills:`);
        this.analysis.skills.prioritized.slice(0, 8).forEach((skill, i) => {
            const priority = skill.priority >= 8 ? '🔴' : skill.priority >= 5 ? '🟡' : '🟢';
            console.log(`   ${i + 1}. ${priority} ${skill.skill} (priority: ${skill.priority})`);
        });

        // Company analysis
        console.log(`\n🏢 Company Analysis:`);
        console.log(`   Type: ${this.analysis.companyAnalysis.type}`);
        console.log(`   Culture: ${this.analysis.cultureAnalysis.culturalEmphasis}`);
        console.log(`   Competition Level: ${this.analysis.competitionAnalysis.level}`);

        // Optimization strategy
        console.log(`\n🎯 Optimization Strategy:`);
        console.log(`   Content Focus: ${this.analysis.optimizationStrategy.contentFocus}`);
        console.log(`   Achievement Framework: ${this.analysis.optimizationStrategy.achievementFramework}`);

        // Top recommendations
        console.log(`\n💡 Key Recommendations:`);
        console.log(`   1. ${this.analysis.competitionAnalysis.recommendation}`);
        console.log(`   2. Optimize for top ${this.analysis.skills.prioritized.slice(0, 5).length} skills`);
        console.log(`   3. Align with cultural emphasis: ${this.analysis.cultureAnalysis.culturalEmphasis}`);

        console.log('\n' + '═'.repeat(70));
        return this.analysis;
    }
}

// CLI interface
if (import.meta.main) {
    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.log(`
🔍 Job Description Analyzer - AI Content Intelligence

Usage:
  bun job-analyzer.js <job-description-file> [options]

Options:
  --output <file>       Save analysis to JSON file
  --interactive         Show interactive analysis display
  --format <json|text>  Output format

Examples:
  bun job-analyzer.js job-posting.txt --interactive
  bun job-analyzer.js job-posting.txt --output analysis.json

Features:
  ✅ Comprehensive requirement extraction
  ✅ Skills prioritization and gap analysis
  ✅ Company culture and competitiveness analysis
  ✅ Optimization strategy generation
  ✅ Application matching recommendations
        `);
        process.exit(1);
    }

    const jobFile = args[0];
    const interactive = args.includes('--interactive');
    const outputFile = args.includes('--output') ? args[args.indexOf('--output') + 1] : null;

    try {
        const analyzer = new JobDescriptionAnalyzer();
        const jobText = readFileSync(jobFile, 'utf8');

        analyzer.analyzeJobDescription(jobText);

        if (interactive) {
            analyzer.displayInteractiveAnalysis();
        } else {
            console.log('🔍 Job Description Analysis Complete!');
            console.log(`📋 Position: ${analyzer.analysis.basicInfo.title}`);
            console.log(`⚡ Experience Required: ${analyzer.analysis.experience.overall}+ years`);
            console.log(`💻 Key Skills: ${analyzer.analysis.skills.prioritized.slice(0, 5).map(s => s.skill).join(', ')}`);
            console.log(`🏢 Company Type: ${analyzer.analysis.companyAnalysis.type}`);
            console.log(`🎯 Competition: ${analyzer.analysis.competitionAnalysis.level}`);
        }

        if (outputFile) {
            analyzer.saveAnalysis(outputFile);
            console.log(`\n📁 Detailed analysis saved to: ${outputFile}`);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

export default JobDescriptionAnalyzer;
export { JobDescriptionAnalyzer };