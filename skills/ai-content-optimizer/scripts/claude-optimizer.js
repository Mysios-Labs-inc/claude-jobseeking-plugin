#!/usr/bin/env bun

/**
 * Claude AI Content Optimization Engine
 * Real-time content enhancement with intelligent suggestions and scoring
 */

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

class ClaudeContentOptimizer {
  constructor(options = {}) {
    this.apiKey = process.env.ANTHROPIC_API_KEY;
    this.baseUrl = 'https://api.anthropic.com/v1/messages';
    this.model = options.model || 'claude-3-5-sonnet-20241022';
    this.maxTokens = options.maxTokens || 4000;
    this.temperature = options.temperature || 0.3;
  }

  async optimizeContent(content, jobDescription = null, options = {}) {
    const optimizationPrompt = this.buildOptimizationPrompt(content, jobDescription, options);

    try {
      const response = await this.callClaude(optimizationPrompt);
      return this.parseOptimizationResponse(response);
    } catch (error) {
      console.error('🚨 Claude optimization failed:', error.message);
      return this.fallbackOptimization(content);
    }
  }

  buildOptimizationPrompt(content, jobDescription, options) {
    const focus = options.focus || 'comprehensive';
    const style = options.style || 'professional';

    return `You are an expert career content optimizer. Analyze and enhance the following content for maximum impact.

${jobDescription ? `**TARGET JOB DESCRIPTION:**
${jobDescription}

**OPTIMIZATION TASK:** Tailor content specifically for this role.` : '**GENERAL OPTIMIZATION TASK:** Enhance content for broad appeal.'}

**CONTENT TO OPTIMIZE:**
${content}

**ENHANCEMENT FOCUS:** ${focus}
**WRITING STYLE:** ${style}

Please provide:
1. **ENHANCED CONTENT** - Improved version with better impact
2. **SPECIFIC IMPROVEMENTS** - List of changes made with rationale
3. **KEYWORD INTEGRATION** - Natural incorporation of relevant terms
4. **QUANTIFIED IMPACT** - Added metrics and measurable results
5. **ATS SCORE** - Estimated compatibility rating (1-100)
6. **COMPETITIVE ADVANTAGE** - What makes this content stand out

**ENHANCEMENT GUIDELINES:**
- Use action verbs and quantified achievements
- Integrate relevant keywords naturally
- Highlight transferable skills and business impact
- Maintain authentic voice while maximizing professional appeal
- Optimize for both human readers and ATS systems

Format as JSON with clear sections for each element.`;
  }

  async callClaude(prompt) {
    if (!this.apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable required');
    }

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  parseOptimizationResponse(response) {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/```json\n(.*?)\n```/s) ||
                       response.match(/\{.*\}/s);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[1] || jsonMatch[0]);
      }

      // Fallback: parse structured text
      return this.parseStructuredText(response);
    } catch (error) {
      console.warn('⚠️ Failed to parse Claude response as JSON, using fallback');
      return this.parseStructuredText(response);
    }
  }

  parseStructuredText(text) {
    const sections = {
      enhanced_content: this.extractSection(text, 'ENHANCED CONTENT', 'SPECIFIC IMPROVEMENTS'),
      improvements: this.extractSection(text, 'SPECIFIC IMPROVEMENTS', 'KEYWORD INTEGRATION'),
      keywords: this.extractSection(text, 'KEYWORD INTEGRATION', 'QUANTIFIED IMPACT'),
      metrics: this.extractSection(text, 'QUANTIFIED IMPACT', 'ATS SCORE'),
      ats_score: this.extractScore(text, 'ATS SCORE'),
      competitive_advantage: this.extractSection(text, 'COMPETITIVE ADVANTAGE', null)
    };

    return sections;
  }

  extractSection(text, startMarker, endMarker) {
    const startIndex = text.indexOf(startMarker);
    if (startIndex === -1) return '';

    const contentStart = startIndex + startMarker.length;
    const endIndex = endMarker ? text.indexOf(endMarker, contentStart) : text.length;

    return text.slice(contentStart, endIndex)
               .replace(/^\*\*.*?\*\*\s*-?\s*/g, '')
               .trim();
  }

  extractScore(text, marker) {
    const match = text.match(new RegExp(`${marker}.*?(\\d+)`));
    return match ? parseInt(match[1]) : 75; // Default score
  }

  fallbackOptimization(content) {
    return {
      enhanced_content: this.applyBasicEnhancements(content),
      improvements: ['Applied basic action verb enhancement', 'Added impact focus'],
      keywords: 'leadership, achievement, results, impact',
      metrics: 'Enhanced with quantifiable results focus',
      ats_score: 70,
      competitive_advantage: 'Professional formatting and clear value proposition'
    };
  }

  applyBasicEnhancements(content) {
    const actionVerbs = ['Led', 'Achieved', 'Implemented', 'Optimized', 'Delivered', 'Managed'];
    const weakVerbs = ['Did', 'Was responsible for', 'Helped with', 'Worked on'];

    let enhanced = content;

    // Replace weak verbs with action verbs
    weakVerbs.forEach((weak, index) => {
      const action = actionVerbs[index % actionVerbs.length];
      enhanced = enhanced.replace(new RegExp(weak, 'gi'), action);
    });

    return enhanced;
  }

  async batchOptimize(contentItems, jobDescription = null) {
    const results = [];

    for (let i = 0; i < contentItems.length; i++) {
      console.log(`🔄 Optimizing content ${i + 1}/${contentItems.length}...`);

      const result = await this.optimizeContent(contentItems[i], jobDescription);
      results.push(result);

      // Rate limiting - wait between requests
      if (i < contentItems.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  async generateJobMatchAnalysis(resumeContent, jobDescription) {
    const analysisPrompt = `Analyze how well this resume matches the job requirements:

**JOB DESCRIPTION:**
${jobDescription}

**RESUME CONTENT:**
${resumeContent}

Provide detailed analysis:
1. **MATCH SCORE** (0-100): Overall compatibility
2. **KEYWORD GAPS**: Missing important terms
3. **SKILL ALIGNMENT**: How skills match requirements
4. **EXPERIENCE RELEVANCE**: How background fits role
5. **IMPROVEMENT RECOMMENDATIONS**: Specific enhancement suggestions

Format as JSON for programmatic use.`;

    try {
      const response = await this.callClaude(analysisPrompt);
      return this.parseOptimizationResponse(response);
    } catch (error) {
      console.error('🚨 Job match analysis failed:', error.message);
      return { match_score: 0, error: error.message };
    }
  }

  async enhanceAchievements(achievements, industry = null) {
    const achievementPrompts = achievements.map(achievement =>
      `Transform this achievement into compelling, quantified impact statement:

ORIGINAL: "${achievement}"
${industry ? `INDUSTRY CONTEXT: ${industry}` : ''}

Enhance with:
- Specific metrics and numbers
- Business impact focus
- Action-oriented language
- Industry-relevant context

Return enhanced version only.`
    );

    const enhanced = await Promise.all(
      achievementPrompts.map(async prompt => {
        try {
          const response = await this.callClaude(prompt);
          return response.trim().replace(/^"|"$/g, '');
        } catch (error) {
          console.warn('⚠️ Achievement enhancement failed, using original');
          return achievements[achievementPrompts.indexOf(prompt)];
        }
      })
    );

    return enhanced;
  }

  async generateCoverLetterContent(resumeData, jobDescription, companyInfo) {
    const coverLetterPrompt = `Generate personalized cover letter content:

**RESUME DATA:**
${JSON.stringify(resumeData, null, 2)}

**JOB DESCRIPTION:**
${jobDescription}

**COMPANY INFORMATION:**
${companyInfo}

Create compelling cover letter with:
1. **OPENING HOOK** - Attention-grabbing first paragraph
2. **VALUE PROPOSITION** - Why you're perfect for this role
3. **SPECIFIC EXAMPLES** - 2-3 relevant achievements
4. **COMPANY CONNECTION** - Why this company/role specifically
5. **CLOSING CALL** - Professional next steps

Format as structured JSON with each section clearly defined.`;

    try {
      const response = await this.callClaude(coverLetterPrompt);
      return this.parseOptimizationResponse(response);
    } catch (error) {
      console.error('🚨 Cover letter generation failed:', error.message);
      return { error: error.message };
    }
  }
}

// Command line interface
async function runOptimization() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.log(`
🤖 Claude Content Optimizer

Usage:
  bun claude-optimizer.js optimize <content-file> [job-description-file]
  bun claude-optimizer.js analyze <resume-file> <job-file>
  bun claude-optimizer.js achievements <achievements-file> [industry]
  bun claude-optimizer.js cover-letter <resume-file> <job-file> [company-info]

Examples:
  bun claude-optimizer.js optimize resume.md job-description.txt
  bun claude-optimizer.js analyze resume.md job-posting.txt
  bun claude-optimizer.js achievements achievements.json "technology"
`);
    process.exit(1);
  }

  const optimizer = new ClaudeContentOptimizer();

  try {
    switch (command) {
      case 'optimize':
        await handleOptimize(optimizer, args.slice(1));
        break;
      case 'analyze':
        await handleAnalyze(optimizer, args.slice(1));
        break;
      case 'achievements':
        await handleAchievements(optimizer, args.slice(1));
        break;
      case 'cover-letter':
        await handleCoverLetter(optimizer, args.slice(1));
        break;
      default:
        console.error(`❌ Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error(`🚨 Optimization failed: ${error.message}`);
    process.exit(1);
  }
}

async function handleOptimize(optimizer, args) {
  const [contentFile, jobFile] = args;

  if (!contentFile) {
    console.error('❌ Content file required');
    process.exit(1);
  }

  console.log('🔄 Reading content...');
  const content = await readFile(contentFile, 'utf-8');
  const jobDescription = jobFile ? await readFile(jobFile, 'utf-8') : null;

  console.log('🤖 Optimizing with Claude...');
  const result = await optimizer.optimizeContent(content, jobDescription);

  console.log('✅ Optimization complete!');
  console.log(`📊 ATS Score: ${result.ats_score}/100`);
  console.log(`🎯 Key Improvements: ${result.improvements}`);

  const outputFile = contentFile.replace(/\.[^.]+$/, '_optimized.json');
  await writeFile(outputFile, JSON.stringify(result, null, 2));
  console.log(`📄 Results saved to: ${outputFile}`);
}

async function handleAnalyze(optimizer, args) {
  const [resumeFile, jobFile] = args;

  if (!resumeFile || !jobFile) {
    console.error('❌ Both resume and job description files required');
    process.exit(1);
  }

  console.log('🔄 Reading files...');
  const resumeContent = await readFile(resumeFile, 'utf-8');
  const jobDescription = await readFile(jobFile, 'utf-8');

  console.log('🤖 Analyzing job match...');
  const analysis = await optimizer.generateJobMatchAnalysis(resumeContent, jobDescription);

  console.log('✅ Analysis complete!');
  console.log(`📊 Match Score: ${analysis.match_score}/100`);

  const outputFile = `job_match_analysis_${Date.now()}.json`;
  await writeFile(outputFile, JSON.stringify(analysis, null, 2));
  console.log(`📄 Analysis saved to: ${outputFile}`);
}

async function handleAchievements(optimizer, args) {
  const [achievementFile, industry] = args;

  if (!achievementFile) {
    console.error('❌ Achievements file required');
    process.exit(1);
  }

  console.log('🔄 Reading achievements...');
  const achievementsData = JSON.parse(await readFile(achievementFile, 'utf-8'));
  const achievements = Array.isArray(achievementsData) ? achievementsData : achievementsData.achievements;

  console.log('🤖 Enhancing achievements...');
  const enhanced = await optimizer.enhanceAchievements(achievements, industry);

  console.log('✅ Enhancement complete!');

  const outputFile = achievementFile.replace(/\.[^.]+$/, '_enhanced.json');
  await writeFile(outputFile, JSON.stringify({ enhanced_achievements: enhanced }, null, 2));
  console.log(`📄 Enhanced achievements saved to: ${outputFile}`);
}

async function handleCoverLetter(optimizer, args) {
  const [resumeFile, jobFile, companyFile] = args;

  if (!resumeFile || !jobFile) {
    console.error('❌ Resume and job description files required');
    process.exit(1);
  }

  console.log('🔄 Reading files...');
  const resumeData = await readFile(resumeFile, 'utf-8');
  const jobDescription = await readFile(jobFile, 'utf-8');
  const companyInfo = companyFile ? await readFile(companyFile, 'utf-8') : '';

  console.log('🤖 Generating cover letter...');
  const coverLetter = await optimizer.generateCoverLetterContent(resumeData, jobDescription, companyInfo);

  console.log('✅ Cover letter generated!');

  const outputFile = `cover_letter_${Date.now()}.json`;
  await writeFile(outputFile, JSON.stringify(coverLetter, null, 2));
  console.log(`📄 Cover letter saved to: ${outputFile}`);
}

// Export for programmatic use
export { ClaudeContentOptimizer };

// Run CLI if called directly
if (import.meta.main) {
  runOptimization();
}