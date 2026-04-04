#!/usr/bin/env bun
// Profile Data Processor - Extract and enhance profile data from various sources

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

class ProfileProcessor {
    constructor() {
        this.profileData = {};
        this.sources = [];
    }

    // Extract profile data from resume file
    async extractFromResume(resumePath) {
        if (!existsSync(resumePath)) {
            throw new Error(`Resume file not found: ${resumePath}`);
        }

        const content = readFileSync(resumePath, 'utf8');

        // Extract basic information patterns
        const patterns = {
            name: /^#\s+(.+)$/m,
            email: /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/,
            phone: /(\+?[\d\s\-\(\)]{10,})/,
            linkedin: /(linkedin\.com\/in\/[^\s]+)/,
            github: /(github\.com\/[^\s]+)/,
            experience: /##\s*(?:Experience|Work)/i,
            education: /##\s*Education/i,
            skills: /##\s*(?:Skills|Technical)/i
        };

        const extracted = {};

        // Extract name
        const nameMatch = content.match(patterns.name);
        if (nameMatch) extracted.name = nameMatch[1].trim();

        // Extract contact info
        const emailMatch = content.match(patterns.email);
        if (emailMatch) extracted.email = emailMatch[1];

        const phoneMatch = content.match(patterns.phone);
        if (phoneMatch) extracted.phone = phoneMatch[1];

        const linkedinMatch = content.match(patterns.linkedin);
        if (linkedinMatch) extracted.linkedin = 'https://' + linkedinMatch[1];

        // Extract sections
        extracted.sections = this.extractSections(content);

        this.profileData = { ...this.profileData, ...extracted };
        this.sources.push({ type: 'resume', file: resumePath, extracted: Object.keys(extracted) });

        return extracted;
    }

    // Extract sections from markdown content
    extractSections(content) {
        const sections = {};
        const sectionPattern = /^##\s+(.+)$/gm;
        let match;

        while ((match = sectionPattern.exec(content)) !== null) {
            const title = match[1].trim();
            const startPos = match.index + match[0].length;

            // Find next section or end of content
            const nextSection = content.indexOf('\n## ', startPos);
            const endPos = nextSection !== -1 ? nextSection : content.length;
            const sectionContent = content.substring(startPos, endPos).trim();

            sections[title.toLowerCase()] = {
                title,
                content: sectionContent,
                wordCount: sectionContent.split(/\s+/).length
            };
        }

        return sections;
    }

    // Generate profile completeness score
    calculateCompleteness() {
        const required = ['name', 'email', 'phone'];
        const recommended = ['linkedin', 'github', 'sections'];
        const optional = ['portfolio', 'certifications', 'languages'];

        let score = 0;
        let maxScore = 100;

        // Required fields (60% of score)
        const requiredScore = required.filter(field => this.profileData[field]).length / required.length * 60;
        score += requiredScore;

        // Recommended fields (30% of score)
        const recommendedScore = recommended.filter(field => this.profileData[field]).length / recommended.length * 30;
        score += recommendedScore;

        // Optional fields (10% of score)
        const optionalScore = optional.filter(field => this.profileData[field]).length / optional.length * 10;
        score += optionalScore;

        return {
            score: Math.round(score),
            breakdown: {
                required: `${required.filter(field => this.profileData[field]).length}/${required.length}`,
                recommended: `${recommended.filter(field => this.profileData[field]).length}/${recommended.length}`,
                optional: `${optional.filter(field => this.profileData[field]).length}/${optional.length}`
            },
            missing: {
                required: required.filter(field => !this.profileData[field]),
                recommended: recommended.filter(field => !this.profileData[field]),
                optional: optional.filter(field => !this.profileData[field])
            }
        };
    }

    // Save processed profile
    saveProfile(outputPath) {
        const completeness = this.calculateCompleteness();

        const output = {
            metadata: {
                created: new Date().toISOString(),
                sources: this.sources,
                completeness: completeness.score,
                version: '1.3.3'
            },
            profile: this.profileData,
            analysis: {
                completeness,
                suggestions: this.generateSuggestions(completeness)
            }
        };

        writeFileSync(outputPath, JSON.stringify(output, null, 2));
        return output;
    }

    // Generate improvement suggestions
    generateSuggestions(completeness) {
        const suggestions = [];

        if (completeness.missing.required.length > 0) {
            suggestions.push({
                priority: 'critical',
                type: 'missing_required',
                fields: completeness.missing.required,
                message: `Add required fields: ${completeness.missing.required.join(', ')}`
            });
        }

        if (completeness.missing.recommended.length > 0) {
            suggestions.push({
                priority: 'high',
                type: 'missing_recommended',
                fields: completeness.missing.recommended,
                message: `Consider adding: ${completeness.missing.recommended.join(', ')}`
            });
        }

        if (this.profileData.sections) {
            const sections = this.profileData.sections;
            if (!sections.experience || sections.experience.wordCount < 50) {
                suggestions.push({
                    priority: 'high',
                    type: 'content_insufficient',
                    section: 'experience',
                    message: 'Experience section needs more detailed content'
                });
            }

            if (!sections.skills || sections.skills.wordCount < 20) {
                suggestions.push({
                    priority: 'medium',
                    type: 'content_insufficient',
                    section: 'skills',
                    message: 'Skills section could be expanded'
                });
            }
        }

        return suggestions;
    }
}

// CLI interface
if (import.meta.main) {
    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.log(`
🎯 Profile Processor - Career Intelligence Plugin

Usage:
  bun profile-processor.js <resume-file> [output-file]
  bun profile-processor.js analyze <profile-json>
  bun profile-processor.js validate <profile-json>

Examples:
  bun profile-processor.js resume.md profile.json
  bun profile-processor.js analyze existing-profile.json
  bun profile-processor.js validate profile-data.json

Features:
  ✅ Extract profile data from resume files
  ✅ Calculate profile completeness scores
  ✅ Generate improvement suggestions
  ✅ Validate existing profile data
        `);
        process.exit(1);
    }

    const command = args[0];
    const processor = new ProfileProcessor();

    try {
        if (command === 'analyze' || command === 'validate') {
            if (!args[1]) {
                console.error('❌ Profile file required for analysis');
                process.exit(1);
            }

            const profileData = JSON.parse(readFileSync(args[1], 'utf8'));
            processor.profileData = profileData.profile || profileData;

            const completeness = processor.calculateCompleteness();

            console.log('📊 Profile Analysis Results:');
            console.log(`\n🎯 Completeness Score: ${completeness.score}%`);
            console.log(`✅ Required: ${completeness.breakdown.required}`);
            console.log(`⚡ Recommended: ${completeness.breakdown.recommended}`);
            console.log(`💫 Optional: ${completeness.breakdown.optional}`);

            const suggestions = processor.generateSuggestions(completeness);
            if (suggestions.length > 0) {
                console.log('\n💡 Improvement Suggestions:');
                suggestions.forEach(suggestion => {
                    const icon = suggestion.priority === 'critical' ? '🔴' :
                                suggestion.priority === 'high' ? '🟡' : '🟢';
                    console.log(`  ${icon} ${suggestion.message}`);
                });
            }

        } else {
            // Extract from resume file
            const resumeFile = args[0];
            const outputFile = args[1] || 'profile-extracted.json';

            console.log(`🔍 Extracting profile data from: ${resumeFile}`);

            await processor.extractFromResume(resumeFile);
            const result = processor.saveProfile(outputFile);

            console.log(`✅ Profile data extracted and saved to: ${outputFile}`);
            console.log(`📊 Completeness Score: ${result.analysis.completeness.score}%`);
            console.log(`📁 Sources processed: ${result.metadata.sources.length}`);

            if (result.analysis.suggestions.length > 0) {
                console.log('\n💡 Next steps:');
                result.analysis.suggestions.slice(0, 3).forEach(suggestion => {
                    console.log(`  • ${suggestion.message}`);
                });
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

export default ProfileProcessor;