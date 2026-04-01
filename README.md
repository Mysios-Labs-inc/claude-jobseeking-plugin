# Career Intelligence Plugin

A Claude Code plugin for career management, resume optimization, and job search assistance.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

### Core Functionality
- **Profile Setup** - Set up your professional profile once
- **Resume Generation** - Create targeted resumes for different roles
- **Job Search Tools** - Organize and track job applications
- **Interview Prep** - Prepare for interviews with company research
- **Local Storage** - All data stored locally on your machine

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