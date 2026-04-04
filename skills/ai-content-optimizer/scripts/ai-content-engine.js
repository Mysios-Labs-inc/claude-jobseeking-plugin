#!/usr/bin/env bun

/**
 * AI Content Intelligence Engine
 * Comprehensive content optimization orchestrator with real-time analysis
 */

import { readFile, writeFile, readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { ClaudeContentOptimizer } from './claude-optimizer.js';
import { JobDescriptionAnalyzer } from './job-analyzer.js';
import { ContentEnhancer } from './content-enhancer.js';
import { InteractiveOptimizer } from './interactive-optimizer.js';

class AIContentEngine {
  constructor(options = {}) {
    this.claudeOptimizer = new ClaudeContentOptimizer(options.claude);
    this.jobAnalyzer = new JobDescriptionAnalyzer();
    this.contentEnhancer = new ContentEnhancer();
    this.interactiveOptimizer = new InteractiveOptimizer();

    this.config = {
      verbose: options.verbose || false,
      parallel: options.parallel !== false, // Default true
      maxConcurrency: options.maxConcurrency || 3,
      outputFormat: options.outputFormat || 'json',
      autoSave: options.autoSave !== false,
      ...options
    };
  }

  async analyzeContentPipeline(contentFile, jobFile = null) {
    console.log('🚀 Starting AI Content Intelligence Pipeline...');

    const startTime = Date.now();
    const results = {
      timestamp: new Date().toISOString(),
      content_file: contentFile,
      job_file: jobFile,
      analysis: {},
      optimization: {},
      performance: {}
    };

    try {
      // Phase 1: Content and Job Analysis (Parallel)
      console.log('\n📊 Phase 1: Content Analysis...');

      const [contentData, jobData] = await this.loadContentFiles(contentFile, jobFile);

      const analysisPromises = [];

      // Content quality analysis
      analysisPromises.push(
        this.contentEnhancer.analyzeContent(contentData).then(analysis => {
          results.analysis.content_quality = analysis;
          this.logProgress('Content quality analysis complete');
        })
      );

      // Job description analysis (if provided)
      if (jobData) {
        analysisPromises.push(
          this.jobAnalyzer.analyzeJobPosting(jobData).then(analysis => {
            results.analysis.job_requirements = analysis;
            this.logProgress('Job requirements analysis complete');
          })
        );
      }

      await Promise.all(analysisPromises);

      // Phase 2: Optimization and Enhancement
      console.log('\n🎯 Phase 2: Content Optimization...');

      const optimizationPromises = [];

      // Claude AI optimization
      optimizationPromises.push(
        this.claudeOptimizer.optimizeContent(contentData, jobData).then(optimization => {
          results.optimization.claude_enhanced = optimization;
          this.logProgress('AI content optimization complete');
        })
      );

      // Achievement enhancement if resume detected
      if (this.detectContentType(contentData) === 'resume') {
        const achievements = this.extractAchievements(contentData);
        if (achievements.length > 0) {
          optimizationPromises.push(
            this.contentEnhancer.enhanceAchievements(achievements).then(enhanced => {
              results.optimization.enhanced_achievements = enhanced;
              this.logProgress('Achievement enhancement complete');
            })
          );
        }
      }

      await Promise.all(optimizationPromises);

      // Phase 3: Job Match Analysis (if job provided)
      if (jobData) {
        console.log('\n🔍 Phase 3: Job Match Analysis...');

        results.analysis.job_match = await this.claudeOptimizer.generateJobMatchAnalysis(
          contentData,
          jobData
        );
        this.logProgress('Job match analysis complete');
      }

      // Phase 4: Competitive Analysis and Benchmarking
      console.log('\n📈 Phase 4: Competitive Analysis...');

      results.analysis.competitive_intelligence = await this.generateCompetitiveIntel(
        results.analysis.content_quality,
        results.analysis.job_requirements
      );

      // Performance metrics
      results.performance = {
        total_time_ms: Date.now() - startTime,
        phases_completed: jobData ? 4 : 3,
        parallel_operations: this.config.parallel,
        optimization_score: results.optimization.claude_enhanced?.ats_score || 0
      };

      console.log('\n✅ AI Content Intelligence Pipeline Complete!');
      console.log(`⏱️  Total processing time: ${results.performance.total_time_ms}ms`);
      console.log(`📊 Optimization score: ${results.performance.optimization_score}/100`);

      if (this.config.autoSave) {
        await this.saveResults(results, contentFile);
      }

      return results;

    } catch (error) {
      console.error('🚨 Pipeline failed:', error.message);
      results.error = error.message;
      results.performance.failed_at = Date.now() - startTime;

      if (this.config.autoSave) {
        await this.saveResults(results, contentFile);
      }

      throw error;
    }
  }

  async batchOptimization(directory, pattern = '*.{md,txt}') {
    console.log(`🔄 Starting batch optimization in: ${directory}`);

    const files = await this.findContentFiles(directory, pattern);
    console.log(`📁 Found ${files.length} content files to optimize`);

    const results = [];
    const batchSize = this.config.maxConcurrency;

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(files.length / batchSize)}`);

      const batchPromises = batch.map(async file => {
        try {
          const result = await this.analyzeContentPipeline(file);
          return { file, success: true, result };
        } catch (error) {
          console.error(`❌ Failed to process ${file}: ${error.message}`);
          return { file, success: false, error: error.message };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Rate limiting between batches
      if (i + batchSize < files.length) {
        await this.sleep(1000);
      }
    }

    const summary = {
      total_files: files.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results: results
    };

    await this.saveBatchResults(summary);

    console.log('\n✅ Batch optimization complete!');
    console.log(`📊 Success rate: ${summary.successful}/${summary.total_files} files`);

    return summary;
  }

  async generateCompetitiveIntel(contentQuality, jobRequirements) {
    const intel = {
      market_benchmark: this.calculateMarketBenchmark(contentQuality),
      competitive_strengths: [],
      improvement_opportunities: [],
      positioning_strategy: ''
    };

    // Calculate competitive positioning
    if (jobRequirements?.requirements) {
      const matchedRequirements = this.analyzeRequirementMatch(
        contentQuality,
        jobRequirements.requirements
      );

      intel.competitive_strengths = matchedRequirements.strengths;
      intel.improvement_opportunities = matchedRequirements.gaps;
    }

    // Generate positioning strategy
    intel.positioning_strategy = this.generatePositioningStrategy(intel);

    return intel;
  }

  calculateMarketBenchmark(contentQuality) {
    const score = contentQuality.overall_score || 0;

    if (score >= 90) return 'Top 10% - Exceptional';
    if (score >= 80) return 'Top 25% - Strong';
    if (score >= 70) return 'Above Average - Good';
    if (score >= 60) return 'Average - Competitive';
    return 'Below Average - Needs Improvement';
  }

  analyzeRequirementMatch(contentQuality, requirements) {
    // Simplified requirement matching logic
    const strengths = [];
    const gaps = [];

    if (contentQuality.action_score > 80) {
      strengths.push('Strong action-oriented language');
    } else {
      gaps.push('Enhance action verb usage');
    }

    if (contentQuality.impact_score > 80) {
      strengths.push('Clear impact demonstration');
    } else {
      gaps.push('Add quantified achievements');
    }

    return { strengths, gaps };
  }

  generatePositioningStrategy(intel) {
    const strategies = [
      'Emphasize quantified achievements and measurable impact',
      'Highlight unique technical skills and certifications',
      'Focus on leadership and team collaboration experience',
      'Showcase problem-solving and innovation capabilities'
    ];

    return strategies[Math.floor(Math.random() * strategies.length)];
  }

  // Utility methods

  async loadContentFiles(contentFile, jobFile) {
    const content = await readFile(contentFile, 'utf-8');
    const job = jobFile ? await readFile(jobFile, 'utf-8') : null;
    return [content, job];
  }

  detectContentType(content) {
    const lowerContent = content.toLowerCase();

    if (lowerContent.includes('experience') && lowerContent.includes('skills')) {
      return 'resume';
    }
    if (lowerContent.includes('cover letter') || lowerContent.includes('dear')) {
      return 'cover_letter';
    }
    if (lowerContent.includes('linkedin') || lowerContent.includes('profile')) {
      return 'linkedin';
    }

    return 'general';
  }

  extractAchievements(content) {
    // Simple achievement extraction logic
    const lines = content.split('\n').filter(line => line.trim());
    const achievements = [];

    for (const line of lines) {
      if (line.match(/^[\-\*\•]/) || line.match(/\d+%|\$\d+|increased|improved|led|managed/i)) {
        achievements.push(line.trim().replace(/^[\-\*\•]\s*/, ''));
      }
    }

    return achievements.slice(0, 10); // Limit to top 10
  }

  async findContentFiles(directory, pattern) {
    const files = [];
    const entries = await readdir(directory);

    for (const entry of entries) {
      const fullPath = join(directory, entry);
      const stats = await stat(fullPath);

      if (stats.isFile()) {
        const ext = extname(entry).toLowerCase();
        if (['.md', '.txt', '.docx'].includes(ext)) {
          files.push(fullPath);
        }
      } else if (stats.isDirectory() && !entry.startsWith('.')) {
        const subdirFiles = await this.findContentFiles(fullPath, pattern);
        files.push(...subdirFiles);
      }
    }

    return files;
  }

  async saveResults(results, originalFile) {
    const outputDir = join(dirname(originalFile), 'ai_optimization_results');
    await this.ensureDir(outputDir);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseName = basename(originalFile, extname(originalFile));
    const outputFile = join(outputDir, `${baseName}_optimization_${timestamp}.json`);

    await writeFile(outputFile, JSON.stringify(results, null, 2));
    console.log(`📄 Results saved to: ${outputFile}`);
  }

  async saveBatchResults(summary) {
    const outputFile = join(process.cwd(), `batch_optimization_${Date.now()}.json`);
    await writeFile(outputFile, JSON.stringify(summary, null, 2));
    console.log(`📄 Batch results saved to: ${outputFile}`);
  }

  async ensureDir(dirPath) {
    try {
      await import('fs').then(fs => fs.promises.mkdir(dirPath, { recursive: true }));
    } catch (error) {
      // Directory might already exist
    }
  }

  logProgress(message) {
    if (this.config.verbose) {
      console.log(`  ✓ ${message}`);
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI interface
async function runCLI() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help') {
    console.log(`
🤖 AI Content Intelligence Engine

Usage:
  bun ai-content-engine.js analyze <content-file> [job-file]     # Single file analysis
  bun ai-content-engine.js batch <directory>                     # Batch optimization
  bun ai-content-engine.js interactive                           # Interactive mode
  bun ai-content-engine.js pipeline <content-file> <job-file>    # Full pipeline
  bun ai-content-engine.js benchmark <content-file>              # Competitive benchmark

Options:
  --verbose          Detailed logging
  --parallel         Enable parallel processing (default: true)
  --format=json      Output format (json, yaml, csv)
  --no-save          Disable auto-save

Examples:
  bun ai-content-engine.js analyze resume.md job-posting.txt
  bun ai-content-engine.js batch ./resumes --verbose
  bun ai-content-engine.js interactive
  bun ai-content-engine.js pipeline resume.md job.txt --format=json
`);
    return;
  }

  const options = {
    verbose: args.includes('--verbose'),
    parallel: !args.includes('--no-parallel'),
    autoSave: !args.includes('--no-save'),
    outputFormat: args.find(arg => arg.startsWith('--format='))?.split('=')[1] || 'json'
  };

  const engine = new AIContentEngine(options);

  try {
    switch (command) {
      case 'analyze':
      case 'pipeline':
        const [contentFile, jobFile] = args.slice(1).filter(arg => !arg.startsWith('--'));
        if (!contentFile) {
          console.error('❌ Content file required');
          process.exit(1);
        }
        await engine.analyzeContentPipeline(contentFile, jobFile);
        break;

      case 'batch':
        const directory = args[1];
        if (!directory) {
          console.error('❌ Directory path required');
          process.exit(1);
        }
        await engine.batchOptimization(directory);
        break;

      case 'interactive':
        await engine.interactiveOptimizer.startInteractiveSession();
        break;

      case 'benchmark':
        const benchmarkFile = args[1];
        if (!benchmarkFile) {
          console.error('❌ Content file required for benchmarking');
          process.exit(1);
        }
        const results = await engine.analyzeContentPipeline(benchmarkFile);
        console.log(`\n📊 Competitive Benchmark: ${results.analysis.competitive_intelligence?.market_benchmark}`);
        break;

      default:
        console.error(`❌ Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error(`🚨 Operation failed: ${error.message}`);
    process.exit(1);
  }
}

// Export for programmatic use
export { AIContentEngine };

// Run CLI if called directly
if (import.meta.main) {
  runCLI();
}