#!/usr/bin/env python3
"""
Jobseeking Workspace Manager
Creates and manages standardized workspace directory structure for job seekers
"""

import os
import shutil
from pathlib import Path
from datetime import datetime
import json

class JobseekingWorkspaceManager:
    def __init__(self, base_path=None):
        """Initialize workspace manager"""
        if base_path:
            self.base_path = Path(base_path)
        else:
            # Default to user's Documents folder or cloud docs if available
            cloud_docs = Path.home() / "Library" / "Mobile Documents" / "com~apple~CloudDocs"
            if cloud_docs.exists():
                self.base_path = cloud_docs / "jobseeking-workspace"
            else:
                self.base_path = Path.home() / "Documents" / "jobseeking-workspace"

        self.workspace_structure = self._define_workspace_structure()

    def _define_workspace_structure(self):
        """Define the standardized workspace directory structure"""
        return {
            'Resume_and_Core': {
                'description': 'Resume versions and core professional documents',
                'subdirs': {
                    'Current': 'Active resume versions for different roles',
                    'Archive': 'Previous resume versions and drafts',
                    'Variations': 'Role-specific resume customizations',
                    'Sources': 'Raw materials and data sources for resumes'
                },
                'files': {
                    'README.md': self._get_resume_readme(),
                    '.gitignore': '*.tmp\n*.log\n.DS_Store'
                }
            },
            'Projects': {
                'description': 'Portfolio project documentation and case studies',
                'subdirs': {},
                'files': {
                    'README.md': self._get_projects_readme(),
                    'project_template.md': self._get_project_template()
                }
            },
            'Role_Applications': {
                'description': 'Tracking and documentation for specific job applications',
                'subdirs': {},
                'files': {
                    'README.md': self._get_applications_readme(),
                    'application_template.md': self._get_application_template(),
                    'applications_tracker.md': self._get_applications_tracker()
                }
            },
            'Role_References': {
                'description': 'Target role research and reference materials',
                'subdirs': {
                    'Company_Research': 'Research on target companies',
                    'Role_Analysis': 'Deep dives on specific job roles',
                    'Industry_Trends': 'Industry analysis and trends',
                    'Salary_Data': 'Compensation research and benchmarks',
                    'Interview_Prep': 'Role-specific interview preparation'
                },
                'files': {
                    'README.md': self._get_references_readme()
                }
            },
            'Market_Analysis': {
                'description': 'Job market research and trend analysis',
                'subdirs': {
                    'Industry_Reports': 'Industry-specific market analysis',
                    'Salary_Research': 'Compensation and benefits research',
                    'Company_Intelligence': 'Target company analysis',
                    'Skills_Gap_Analysis': 'Skills demand and supply analysis'
                },
                'files': {
                    'README.md': self._get_market_analysis_readme()
                }
            },
            'Research': {
                'description': 'General research and knowledge gathering',
                'subdirs': {
                    'Technical': 'Technical topics and skills research',
                    'Career_Development': 'Professional development resources',
                    'Networking': 'Professional networking strategies and contacts'
                },
                'files': {
                    'README.md': self._get_research_readme()
                }
            },
            'Archive': {
                'description': 'Archived materials no longer actively used',
                'subdirs': {
                    'Old_Applications': 'Previous job application materials',
                    'Outdated_Resumes': 'Old resume versions',
                    'Past_Research': 'Historical research materials'
                },
                'files': {
                    'README.md': self._get_archive_readme()
                }
            },
            '.gstack': {
                'description': 'Gstack tool integration and analytics',
                'subdirs': {
                    'design-reports': 'Design review reports',
                    'analytics': 'Usage analytics and metrics'
                },
                'files': {}
            },
            '.claude': {
                'description': 'Claude integration settings and cache',
                'subdirs': {},
                'files': {
                    'workspace_config.json': json.dumps({
                        'workspace_version': '1.0',
                        'created': datetime.now().isoformat(),
                        'structure': 'jobseeking-standard-v1'
                    }, indent=2)
                }
            }
        }

    def create_workspace(self, user_name=None, overwrite=False):
        """Create the complete jobseeking workspace structure"""
        try:
            if self.base_path.exists() and not overwrite:
                print(f"Workspace already exists at {self.base_path}")
                return False

            # Create base directory
            self.base_path.mkdir(parents=True, exist_ok=True)

            # Create directory structure
            for dir_name, config in self.workspace_structure.items():
                dir_path = self.base_path / dir_name
                dir_path.mkdir(exist_ok=True)

                # Create subdirectories
                for subdir_name, subdir_desc in config.get('subdirs', {}).items():
                    subdir_path = dir_path / subdir_name
                    subdir_path.mkdir(exist_ok=True)

                    # Create .gitkeep for empty directories
                    gitkeep = subdir_path / '.gitkeep'
                    gitkeep.write_text(f"# {subdir_desc}\n")

                # Create files
                for file_name, file_content in config.get('files', {}).items():
                    file_path = dir_path / file_name
                    if isinstance(file_content, str):
                        file_path.write_text(file_content)

            # Create main workspace README
            self._create_main_readme(user_name)

            # Create workspace manifest
            self._create_workspace_manifest()

            print(f"✅ Jobseeking workspace created successfully at: {self.base_path}")
            print(f"📁 Total directories created: {self._count_directories()}")
            return True

        except Exception as e:
            print(f"❌ Error creating workspace: {str(e)}")
            return False

    def _create_main_readme(self, user_name):
        """Create the main workspace README file"""
        readme_content = f"""# Jobseeking Workspace{' for ' + user_name if user_name else ''}

> **Created:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
> **Structure Version:** 1.0

## 📁 Directory Structure

### 📄 Resume_and_Core
**Purpose:** Resume management and core professional documents
**Contents:** Current resumes, archives, variations, and source materials

### 🚀 Projects
**Purpose:** Portfolio project documentation and case studies
**Contents:** Technical project write-ups, case studies, and portfolio materials

### 📝 Role_Applications
**Purpose:** Job application tracking and documentation
**Contents:** Application status, cover letters, follow-ups, and interview notes

### 🔍 Role_References
**Purpose:** Target role research and reference materials
**Contents:** Company research, role analysis, industry trends, and interview prep

### 📊 Market_Analysis
**Purpose:** Job market research and competitive analysis
**Contents:** Industry reports, salary research, and company intelligence

### 📚 Research
**Purpose:** General research and knowledge gathering
**Contents:** Technical research, career development, and networking resources

### 🗄️ Archive
**Purpose:** Historical materials and completed applications
**Contents:** Old resumes, past applications, and outdated research

## 🤖 Integration

This workspace integrates with:
- **Claude Jobseeking Plugin** for automated resume generation
- **Gstack Tools** for project analysis and review
- **Profile System** for data consistency across applications

## 🔧 Usage Patterns

1. **Profile Setup** → Run `/profile-setup` to initialize your professional data
2. **Resume Generation** → Use `/resume-optimizer` to create targeted resumes in `Resume_and_Core/Current/`
3. **Job Applications** → Track progress in `Role_Applications/` directory
4. **Research** → Store company and role research in `Role_References/`
5. **Portfolio** → Document projects in `Projects/` for resume and interview use

## 📈 Workflow Tips

- **Keep Current Active:** Only keep current resume versions in `Current/` directory
- **Archive Regularly:** Move old materials to `Archive/` to maintain organization
- **Document Everything:** Use markdown files to track research and application progress
- **Version Control:** Consider git integration for change tracking and collaboration

## 🎯 Quick Start

1. Complete your profile: `/profile-setup`
2. Generate your first resume: `/resume-optimizer`
3. Start researching roles: Add companies to `Role_References/Company_Research/`
4. Track applications: Use `Role_Applications/applications_tracker.md`

---
*Generated by Claude Jobseeking Plugin - Workspace Manager v1.0*
"""
        readme_path = self.base_path / "README.md"
        readme_path.write_text(readme_content)

    def _create_workspace_manifest(self):
        """Create workspace manifest file for tool integration"""
        manifest = {
            "workspace": {
                "version": "1.0",
                "type": "jobseeking-standard",
                "created": datetime.now().isoformat(),
                "structure": list(self.workspace_structure.keys())
            },
            "integration": {
                "claude_plugin": True,
                "gstack_tools": True,
                "profile_system": True
            },
            "paths": {
                "resumes": "Resume_and_Core/Current",
                "projects": "Projects",
                "applications": "Role_Applications",
                "research": "Role_References",
                "archive": "Archive"
            }
        }

        manifest_path = self.base_path / ".workspace_manifest.json"
        manifest_path.write_text(json.dumps(manifest, indent=2))

    def _count_directories(self):
        """Count total directories created"""
        return len(list(self.base_path.rglob("*/")))

    # README content generators
    def _get_resume_readme(self):
        return """# Resume and Core Documents

## Directory Structure

- **Current/**: Active resume versions for job applications
- **Archive/**: Previous versions and drafts
- **Variations/**: Role-specific customizations
- **Sources/**: Raw materials and achievement data

## Usage

1. Generate resumes with `/resume-optimizer`
2. Store current versions in `Current/`
3. Archive old versions regularly
4. Keep source materials for easy updates

## File Naming Convention

- `FirstName_LastName_Role_YYYY-MM-DD.md`
- `FirstName_LastName_General_Resume.pdf`
- `FirstName_LastName_TechLead_Company.html`
"""

    def _get_projects_readme(self):
        return """# Projects Portfolio

Document your technical projects and case studies for resume and interview use.

## Project Documentation Template

Use `project_template.md` as a starting point for each project.

## Key Information to Include

- **Problem solved** and business impact
- **Technologies used** and technical decisions
- **Your specific role** and contributions
- **Quantified results** and metrics
- **Lessons learned** and growth

## Integration

Projects documented here automatically feed into:
- Resume generation (relevant projects per role)
- Interview preparation materials
- Portfolio website content
"""

    def _get_applications_readme(self):
        return """# Role Applications

Track your job applications and maintain application materials.

## Files

- `applications_tracker.md`: Master tracking spreadsheet
- `application_template.md`: Template for new applications

## Application Process

1. Research company and role (store in `Role_References/`)
2. Generate targeted resume with `/resume-optimizer`
3. Create application entry using template
4. Track progress and follow-ups
5. Store interview notes and feedback

## Status Tracking

- **Applied**: Application submitted
- **Screening**: Initial HR screening
- **Interview**: Technical/cultural interviews
- **Final**: Final round interviews
- **Offer**: Offer received
- **Rejected**: Application unsuccessful
- **Withdrawn**: You withdrew application
"""

    def _get_references_readme(self):
        return """# Role References

Research materials for target roles and companies.

## Directory Structure

- **Company_Research/**: Target company analysis
- **Role_Analysis/**: Specific job role deep-dives
- **Industry_Trends/**: Industry analysis and trends
- **Salary_Data/**: Compensation benchmarks
- **Interview_Prep/**: Role-specific preparation

## Research Process

1. Identify target companies and roles
2. Research company culture, technology, and challenges
3. Analyze role requirements and team structure
4. Prepare targeted questions and talking points
5. Track networking contacts and referrals
"""

    def _get_market_analysis_readme(self):
        return """# Market Analysis

Job market research and competitive intelligence.

## Research Areas

- **Industry Reports**: Sector analysis and trends
- **Salary Research**: Compensation and benefits data
- **Company Intelligence**: Target company analysis
- **Skills Gap Analysis**: In-demand skills and certifications

## Usage

Market analysis informs:
- Target role selection
- Salary negotiation strategy
- Skill development priorities
- Company prioritization
"""

    def _get_research_readme(self):
        return """# Research

General research and knowledge gathering for career development.

## Categories

- **Technical**: New technologies, frameworks, and tools
- **Career_Development**: Professional growth resources
- **Networking**: Industry contacts and relationship building

## Integration

Research materials support:
- Interview preparation
- Technical skill development
- Professional networking
- Industry knowledge building
"""

    def _get_archive_readme(self):
        return """# Archive

Historical materials and completed applications.

## What to Archive

- Resumes from previous job searches
- Completed application materials
- Outdated research and market analysis
- Old project documentation

## Retention Policy

- Keep materials for at least 2 years
- Maintain organization by date and category
- Regularly review for potential reuse
"""

    def _get_project_template(self):
        return """# Project: [Project Name]

**Status:** [Active/Completed/Archived]
**Timeline:** [Start Date] - [End Date]
**Role:** [Your Role/Title]
**Team Size:** [Number of team members]

## Overview

Brief description of the project and its purpose.

## Problem & Solution

### The Problem
- What business problem did this solve?
- Who was impacted?
- What were the constraints?

### The Solution
- How did you approach solving it?
- What was your specific contribution?
- What technologies/frameworks did you use?

## Technical Implementation

### Architecture
- High-level system design
- Key technical decisions
- Integration points

### Technologies Used
- Programming languages
- Frameworks and libraries
- Infrastructure and tools
- Databases and data sources

### Your Contributions
- Specific features you built
- Technical challenges you solved
- Leadership or mentoring you provided

## Results & Impact

### Quantified Outcomes
- Performance improvements (speed, efficiency, etc.)
- User/business metrics (users served, revenue impact, etc.)
- Team productivity gains

### Technical Achievements
- Code quality improvements
- Architecture enhancements
- Process improvements

## Lessons Learned

- What went well?
- What would you do differently?
- Skills developed or strengthened
- Technologies learned

## Relevant for Roles

List types of roles where this project demonstrates relevant experience:
- [ ] Frontend Developer
- [ ] Backend Developer
- [ ] Full-Stack Developer
- [ ] Technical Lead
- [ ] Engineering Manager
- [ ] DevOps Engineer
- [ ] Other: ____________

## Links & References

- **Repository:** [GitHub/GitLab link]
- **Live Demo:** [URL if available]
- **Documentation:** [Links to additional docs]
- **Case Study:** [Published case study if any]

---
*Template version 1.0 - Update as needed*
"""

    def _get_application_template(self):
        return """# Application: [Company Name] - [Role Title]

**Application Date:** [YYYY-MM-DD]
**Status:** [Applied/Screening/Interview/Final/Offer/Rejected/Withdrawn]
**Priority:** [High/Medium/Low]

## Role Details

**Job Title:** [Official job title]
**Department:** [Team/Department]
**Location:** [City, State or Remote]
**Salary Range:** [If disclosed]
**Job Posting URL:** [Link to original posting]

## Company Information

**Company:** [Company name]
**Industry:** [Industry/Sector]
**Size:** [Company size]
**Stage:** [Startup/Growth/Enterprise]
**Company Website:** [URL]

### Key Research Notes
- Company culture and values
- Recent news and developments
- Technology stack
- Growth trajectory
- Competitive position

## Application Materials

**Resume Version:** [Link to specific resume used]
**Cover Letter:** [Link to cover letter]
**Portfolio Links:** [Any portfolio or demo links]
**Referral:** [Name if referred by someone]

## Requirements Match

### Required Skills Met
- [ ] Skill 1
- [ ] Skill 2
- [ ] Skill 3

### Preferred Skills Met
- [ ] Skill 1
- [ ] Skill 2
- [ ] Skill 3

### Skills to Emphasize
- Key strengths that align with role
- Relevant project experience
- Unique qualifications

### Potential Gaps
- Skills mentioned in posting you don't have
- Experience levels that might be concerns
- How to address gaps in interview

## Timeline

**Application Submitted:** [Date]
**Application Deadline:** [Date if specified]
**Expected Response:** [Expected timeframe]

### Follow-up Schedule
- **1 week:** [Follow-up plan]
- **2 weeks:** [Follow-up plan]
- **1 month:** [Follow-up plan]

## Interview Preparation

### Key Talking Points
- Relevant project examples
- Technical challenges solved
- Leadership experiences
- Questions about the role/company

### Questions to Ask
- About the role and team
- About company culture and growth
- About technical challenges
- About career development

## Contact Information

**Recruiter:** [Name and contact info]
**Hiring Manager:** [Name if known]
**Team Members:** [Any contacts within the company]

## Status Updates

### [Date] - Application Submitted
- Application materials sent
- Next steps: Wait for initial response

### [Date] - Status Update
- Current status
- Next steps
- Notes

## Interview Notes

### [Date] - [Interview Type]
**Interviewer(s):** [Names and roles]
**Duration:** [Length of interview]
**Format:** [Phone/Video/In-person]

**Questions Asked:**
- Question 1 and your response
- Question 2 and your response

**My Questions:**
- Question asked and their response

**Overall Impression:**
- How did it go?
- Areas of strength
- Areas of concern
- Next steps discussed

## Outcome

**Final Status:** [Offer/Rejected/Withdrawn]
**Date:** [Final decision date]
**Feedback:** [Any feedback received]
**Lessons Learned:** [What to improve for next time]

### Offer Details (if applicable)
**Salary:** [Base salary]
**Bonus:** [Bonus structure]
**Equity:** [Equity details]
**Benefits:** [Key benefits]
**Start Date:** [Proposed start date]
**Negotiation Notes:** [Any negotiations]

---
*Application tracking template v1.0*
"""

    def _get_applications_tracker(self):
        return """# Applications Tracker

Track all job applications in one place.

## Current Applications

| Company | Role | Applied Date | Status | Next Action | Priority | Notes |
|---------|------|--------------|--------|-------------|----------|-------|
| | | | | | | |

## Status Legend

- **Applied**: Application submitted, waiting for response
- **Screening**: Initial phone/email screening in progress
- **Interview**: Technical or cultural interviews scheduled/completed
- **Final**: Final round interviews or decision pending
- **Offer**: Offer received, negotiation in progress
- **Rejected**: Application unsuccessful
- **Withdrawn**: You withdrew from consideration

## Priority Levels

- **High**: Dream job, perfect fit, actively pursuing
- **Medium**: Good opportunity, worthwhile to pursue
- **Low**: Backup option, applying broadly

## Metrics & Goals

### Monthly Targets
- **Applications per week:** [Target number]
- **Response rate goal:** [Percentage]
- **Interview conversion:** [Percentage]

### Current Month Stats
- **Total applications:** 0
- **Responses received:** 0
- **Interviews scheduled:** 0
- **Response rate:** 0%

### Historical Performance
- **Best response rate month:** [Month/Rate]
- **Most applications month:** [Month/Count]
- **Interview to offer ratio:** [Ratio]

## Application Sources

Track where you're finding the best opportunities:

| Source | Applications | Responses | Interviews | Notes |
|--------|--------------|-----------|------------|-------|
| LinkedIn | | | | |
| Company Websites | | | | |
| Indeed | | | | |
| AngelList | | | | |
| Referrals | | | | |
| Recruiters | | | | |

## Follow-up Schedule

### This Week
- [ ] Company A - Follow up on application (Day X)
- [ ] Company B - Thank you note after interview

### Next Week
- [ ] Company C - Check on timeline
- [ ] Company D - Send additional portfolio samples

## Lessons Learned

### What's Working Well
- Successful application strategies
- Interview performance strengths
- Networking approaches that generate leads

### Areas for Improvement
- Application materials that need updates
- Interview skills to develop
- Follow-up strategies to refine

---
*Last updated: [Date]*
"""

# CLI interface for testing
if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python workspace_manager.py [create|info] [path] [options]")
        sys.exit(1)

    command = sys.argv[1]
    workspace_path = sys.argv[2] if len(sys.argv) > 2 else None

    manager = JobseekingWorkspaceManager(workspace_path)

    if command == "create":
        user_name = sys.argv[3] if len(sys.argv) > 3 else None
        overwrite = "--overwrite" in sys.argv
        success = manager.create_workspace(user_name, overwrite)
        if success:
            print(f"\n📁 Workspace created at: {manager.base_path}")
            print("🚀 Ready for jobseeking automation!")
        else:
            print("❌ Workspace creation failed")

    elif command == "info":
        if manager.base_path.exists():
            manifest_path = manager.base_path / ".workspace_manifest.json"
            if manifest_path.exists():
                with open(manifest_path) as f:
                    manifest = json.load(f)
                print(json.dumps(manifest, indent=2))
            else:
                print("Workspace exists but no manifest found")
        else:
            print("No workspace found")

    else:
        print(f"Unknown command: {command}")