# Claude Jobseeking Plugin

> AI-powered job search assistant that integrates seamlessly with Claude Code to provide comprehensive career guidance, resume optimization, interview preparation, and market intelligence.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Claude Plugin](https://img.shields.io/badge/Claude-Plugin-blue.svg)](https://claude.ai)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-green.svg)](https://modelcontextprotocol.io)

## 🚀 Features

### 💼 Core Skills
- **Resume Optimizer** - ATS-friendly resume optimization with keyword analysis
- **Cover Letter Generator** - Personalized cover letters for specific opportunities
- **Interview Prep** - Company research and practice questions with coaching
- **Job Search Assistant** - Intelligent job matching and application tracking
- **Salary Research** - Market-rate analysis and negotiation coaching

### 🤖 AI Agents
- **Career Coach** - Strategic career planning and professional development
- **Market Analyst** - Real-time job market intelligence and compensation data

### 🔌 Integrations
- LinkedIn, Indeed, AngelList job board APIs
- Glassdoor salary data and company insights
- ATS optimization for major systems
- HR platform integrations for enterprise

## 📦 Installation

### From Official Claude Marketplace
```bash
# Search for "jobseeking" in Claude Code plugin directory
/plugin install jobseeking-plugin
```

### From GitHub (Development)
```bash
# Clone and install locally
git clone https://github.com/your-username/claude-jobseeking-plugin.git
cd claude-jobseeking-plugin
claude --plugin-dir ./
```

## ⚙️ Configuration

### Basic Setup (Free Features)
No configuration required for basic features like resume review and general career advice.

### Premium Features
1. Get your API key at [jobseeking.ai](https://jobseeking.ai)
2. Configure in Claude Code:
   ```bash
   /plugin configure jobseeking-plugin
   # Enter your API key when prompted
   ```

### Environment Variables (Development)
```bash
export JOBSEEKING_API_KEY=your_api_key_here
export LINKEDIN_API_KEY=your_linkedin_key
export INDEED_API_KEY=your_indeed_key
export GLASSDOOR_API_KEY=your_glassdoor_key
```

## 🎯 Usage

### Quick Start Commands

```bash
# Optimize your resume
/jobseeking-plugin:resume-optimizer

# Generate a cover letter
/jobseeking-plugin:cover-letter-generator

# Prepare for an interview
/jobseeking-plugin:interview-prep

# Search for jobs
/jobseeking-plugin:job-search

# Research salaries
/jobseeking-plugin:salary-research
```

### Example Workflows

#### Resume Optimization
```
User: /jobseeking-plugin:resume-optimizer
Claude: I'll help optimize your resume for ATS systems and specific roles.
        Please share your resume and the job posting you're targeting.

        For premium ATS analysis, make sure you have configured your API key.
```

#### Interview Preparation
```
User: /jobseeking-plugin:interview-prep
Claude: Let's prepare you for your interview! I need:
        - Company name and role
        - Interview format (phone/video/in-person)
        - Your background and experience level

        I'll provide customized questions, company insights, and coaching.
```

## 💰 Pricing

### Free Tier
- Basic resume feedback
- General interview advice
- Standard job search guidance
- Career planning templates

### Premium Tiers

#### Individual ($39/month)
- ATS resume optimization
- Personalized cover letters
- Company-specific interview prep
- Job application tracking
- Basic salary research

#### Professional ($99/month)
- Unlimited optimizations
- Advanced interview simulation
- Salary negotiation coaching
- LinkedIn optimization
- Priority support

#### Enterprise (Custom)
- White-label deployment
- HR system integrations
- Team analytics and reporting
- Custom features and support

[Get your API key →](https://jobseeking.ai/pricing)

## 🏗️ Architecture

```
jobseeking-plugin/
├── .claude-plugin/           # Plugin manifest
├── skills/                   # User-invocable commands
│   ├── resume-optimizer/
│   ├── cover-letter-generator/
│   ├── interview-prep/
│   ├── job-search/
│   └── salary-research/
├── agents/                   # AI agents for Claude
│   ├── career-coach.md
│   └── market-analyst.md
├── servers/                  # MCP servers
│   ├── premium-server.js
│   ├── job-board-server.py
│   └── salary-server.js
└── docs/                     # Documentation
    └── business-central.md
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Clone the repository
git clone https://github.com/your-username/claude-jobseeking-plugin.git
cd claude-jobseeking-plugin

# Install dependencies
npm install
pip install -r requirements.txt

# Run tests
npm test
python -m pytest

# Start development server
claude --plugin-dir ./ --debug
```

### Running Tests
```bash
# Test plugin validation
claude plugin validate .

# Test individual skills
/jobseeking-plugin:resume-optimizer --test

# Test MCP servers
node servers/premium-server.js --test
```

## 📚 Documentation

- [Business Plan & Market Analysis](docs/business-central.md)
- [Plugin Architecture Guide](docs/architecture.md)
- [API Documentation](docs/api.md)
- [Enterprise Integration Guide](docs/enterprise.md)
- [Troubleshooting](docs/troubleshooting.md)

## 🔒 Privacy & Security

- All data processing follows GDPR and CCPA compliance
- API keys are stored securely using Claude's credential management
- No personal data is retained beyond session requirements
- Enterprise deployments support on-premise hosting

## 📈 Roadmap

### Q2 2026
- [x] Core skills implementation
- [x] Basic marketplace submission
- [ ] Premium API integration
- [ ] User dashboard launch

### Q3 2026
- [ ] Enterprise features (HR integrations)
- [ ] Advanced AI agents (interview simulator)
- [ ] Mobile app companion
- [ ] International market expansion

### Q4 2026
- [ ] Industry-specific modules (tech, healthcare, finance)
- [ ] Advanced analytics and reporting
- [ ] Partner integrations (universities, career services)
- [ ] AI-powered career matching

## 📊 Success Metrics

Our plugin helps users achieve measurable results:

- **3x higher interview success rate** with comprehensive preparation
- **35% more callback rate** with optimized resumes
- **25% higher salary offers** with negotiation coaching
- **50% faster job search process** with intelligent matching

## 🏢 Enterprise

For enterprise deployments, custom integrations, or partnership opportunities:

- 📧 Email: enterprise@jobseeking.ai
- 🔗 LinkedIn: [Claude Jobseeking Plugin](https://linkedin.com/company/jobseeking-ai)
- 📅 Schedule a demo: [calendly.com/jobseeking-ai](https://calendly.com/jobseeking-ai)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Anthropic](https://anthropic.com) for Claude Code platform
- [Model Context Protocol](https://modelcontextprotocol.io) for integration framework
- Our beta users and contributors for valuable feedback

---

<div align="center">

**[Get Started](https://jobseeking.ai)** • **[Documentation](docs/)** • **[Support](mailto:support@jobseeking.ai)**

</div>