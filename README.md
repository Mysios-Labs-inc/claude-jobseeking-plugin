# Career Intelligence Plugin

A Claude Code plugin for career management, resume optimization, and job search assistance.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

### Core Functionality
- **Interactive Profile Setup** - Guided workflows with smart choices and progress tracking
- **Resume Optimization** - AI-powered analysis with A/B testing and customization options
- **Job Search Tools** - Organize and track job applications with automation
- **Interactive Interview Prep** - Timeline-based preparation with mock interviews
- **Local Storage** - All data stored locally on your machine

### Phase 4: Network Intelligence 🌐 NEW
- **Network Analysis** - AI-powered relationship mapping and referral pathway identification
- **Outreach Automation** - Smart templates with personalization scoring and timing optimization
- **Referral Intelligence** - Target company pathway mapping with optimal approach sequences
- **Personal Branding** - LinkedIn optimization and thought leadership content generation
- **Success Tracking** - Outreach performance analytics with response probability prediction

### Phase 3: ATS Validation 🤖
- **Multi-System ATS Testing** - Compatibility across 15+ major platforms (Workday, Greenhouse, Lever, Taleo, Ashby)
- **Format Validation** - PDF, Word, HTML parsing simulation and optimization
- **Application Success Tracking** - Response rate analytics with system correlation
- **Success Prediction** - AI-powered outcome modeling with confidence scoring
- **Real-time Optimization** - Instant compatibility testing and improvement recommendations

### Phase 2: Market Intelligence 📊
- **Salary Benchmarking** - Real-time compensation analysis with multi-source data
- **Skills Gap Analysis** - Market demand assessment with learning ROI calculations
- **Company Intelligence** - Culture analysis, hiring patterns, and interview prep
- **Competitive Positioning** - Strategic market differentiation and unique value proposition
- **Negotiation Intelligence** - Data-driven strategy with market context and timing

### Phase 1: AI Content Intelligence 🤖
- **Real-time Content Optimization** - Claude AI-powered enhancement and scoring
- **Job Description Analysis** - Requirement extraction and keyword integration
- **Achievement Amplification** - X→Y→Z impact formula with quantified results
- **Interactive Workflows** - Multiple choice options with smart branching logic

### Bun Scripts & CLI Tools 🚀
- **High-Performance Scripts** - 2-3x faster execution with Bun runtime
- **AI Content Optimization** - Claude API integration for sophisticated enhancement
- **Market Intelligence** - Comprehensive salary, skills, and company analysis
- **PDF Generation** - Optimized Chrome headless for perfect 2-page layouts
- **Interactive Tools** - Guided workflows with real-time feedback and scoring

### Workspace Organization
- **Resume Management** - Organize resume versions and templates
- **Application Tracking** - Keep track of job applications
- **Company Research** - Store research about target companies
- **Portfolio Management** - Organize work samples and projects

## Usage

Basic commands to get started with the career intelligence plugin:

### 1. Set Up Your Profile
```bash
/career-intelligence:profile-setup
```
Set up your professional profile and workspace

## 🚀 Bun Scripts (High Performance CLI)

For power users and automation, use our optimized Bun scripts:

```bash
# Interactive skill selection
npm run skills

# AI content optimization
npm run interactive              # Guided content enhancement
npm run optimize resume.md      # Direct Claude API optimization
npm run ai-engine analyze       # Complete AI pipeline

# Market intelligence analysis  
npm run market-intelligence analyze profile.json role.json
npm run salary-analyzer "Product Manager" 5 "San Francisco"
npm run skills-gap analyze profile.json
npm run company-intel analyze "OpenAI"

# Network intelligence and outreach
npm run network-analyze demo                  # Network analysis demo
npm run network-analyze analyze connections.csv
npm run outreach linkedin "AI product management" post
npm run outreach generate contact.json referral_request

# ATS validation and optimization
npm run ats-validation validate resume.pdf job-description.txt
npm run ats-test test resume.pdf
npm run format-validate validate resume.docx  
npm run track-apps summary

# Resume generation and analysis
npm run analyze resume.md --interactive
npm run pdf resume.html final-resume.pdf
npm run profile resume.md profile.json
```

**📖 Full Documentation**: 
- [AI Content Intelligence](docs/AI_CONTENT_INTELLIGENCE.md) - Phase 1 capabilities
- [Market Intelligence](docs/MARKET_INTELLIGENCE.md) - Phase 2 capabilities  
- [ATS Validation](docs/ATS_VALIDATION.md) - Phase 3 capabilities
- [Network Intelligence](skills/network-intelligence/SKILL.md) - Phase 4 capabilities
- [Bun Scripts Guide](docs/BUN_SCRIPTS.md) - Performance optimizations

**Performance**: 2-3x faster than Node.js with parallel processing and real-time analysis.

### 2. Generate Resumes  
```bash
/career-intelligence:resume-optimizer
```
Create optimized resumes for specific job postings

### 3. Search and Track Jobs
```bash
/career-intelligence:job-search
```
Find and track job opportunities

## Installation

1. Clone or download this repository to your Claude Code plugins directory
2. Install dependencies: `npm install`
3. Use the skills via Claude Code commands

## Project Structure

```
career-intelligence-plugin/
├── .claude-plugin/               # Plugin configuration
│   └── plugin.json
├── skills/                       # Available commands
│   ├── profile-setup/            # Set up professional profile
│   ├── resume-optimizer/         # Generate and optimize resumes
│   ├── job-search/              # Job search and tracking
│   ├── cover-letter-generator/   # Generate cover letters
│   ├── interview-prep/          # Interview preparation
│   └── salary-research/         # Salary research tools
└── workspace/                   # Workspace templates
```

## Development

```bash
# Install dependencies
npm install

# Validate plugin structure
claude plugin validate .

# Test skills
/career-intelligence:profile-setup
/career-intelligence:resume-optimizer
/career-intelligence:job-search
```

## License

MIT License - See LICENSE file for details.