#!/usr/bin/env python3
"""
Career Intelligence System Setup
Creates directory structure, initializes state, validates dependencies, configures workspace.
"""
import os
import sys
import json
import shutil
import argparse
import subprocess
from pathlib import Path
from datetime import datetime

try:
    import yaml
    YAML_AVAILABLE = True
except ImportError:
    YAML_AVAILABLE = False

try:
    import requests
    REQUESTS_AVAILABLE = True
except ImportError:
    REQUESTS_AVAILABLE = False


class CareerSystemSetup:
    def __init__(self, base_dir=None):
        cloud_docs = Path.home() / "Library" / "Mobile Documents" / "com~apple~CloudDocs"
        local_docs = Path.home() / "Documents"

        if base_dir:
            self.base_dir = Path(base_dir)
        elif cloud_docs.exists():
            self.base_dir = cloud_docs / "career-ops"
        else:
            self.base_dir = local_docs / "career-ops"

        self.plugin_dir = Path(__file__).resolve().parent.parent.parent.parent
        self.profile_integration_dir = Path.home() / ".mysios-career-intelligence"

    # ── Directory Structure ──────────────────────────────────────────────

    WORKSPACE_DIRS = [
        "profile",
        "resumes/current",
        "resumes/archive",
        "resumes/variations",
        "resumes/sources",
        "applications/active",
        "applications/interviews",
        "applications/offers",
        "applications/archived",
        "research/companies",
        "research/roles",
        "research/salary",
        "research/industry",
        "research/skills_gap",
        "cover-letters/templates",
        "cover-letters/generated",
        "interview-prep/questions",
        "interview-prep/stories",
        "interview-prep/technical",
        "interview-prep/notes",
        "networking/outreach",
        "projects/case-studies",
        "state/resume-optimizer",
        "state/job-search",
        "state/applications",
        "state/interview-prep",
        "state/analytics",
        "logs/daily",
        "logs/errors",
        "logs/performance",
        "config",
    ]

    # ── Initialization ───────────────────────────────────────────────────

    def initialize_system(self, user_name=None):
        """Full system initialization."""
        print(f"🚀 Initializing Career Intelligence System...")
        print(f"📍 Workspace: {self.base_dir}\n")

        self._create_directory_structure()
        self._populate_templates()
        self._initialize_state_files()
        self._create_config_files(user_name)
        self._create_workspace_readme(user_name)
        self._create_profile_integration_dir()
        self._set_permissions()

        dep_ok = self.validate_dependencies(verbose=False)

        print(f"\n✅ Career Intelligence System initialized!")
        print(f"📁 Workspace: {self.base_dir}")
        print(f"📊 Directories created: {self._count_dirs()}")
        if not dep_ok:
            print("⚠️  Some dependencies are missing — run --validate for details")
        print(f"\n💡 Next step: run career-intelligence:profile-setup")

    def _create_directory_structure(self):
        """Create all workspace directories."""
        self.base_dir.mkdir(parents=True, exist_ok=True)
        for rel in self.WORKSPACE_DIRS:
            (self.base_dir / rel).mkdir(parents=True, exist_ok=True)
        print(f"📁 Directory structure created ({len(self.WORKSPACE_DIRS)} directories)")

    # ── Template Files ────────────────────────────────────────────────────

    def _populate_templates(self):
        """Populate directories with README guides and starter templates."""
        templates = {
            "profile/README.md": """# Profile

Your professional identity — the foundation for all career intelligence skills.

## Files
- **profile_data.json** — Core profile (name, contact, experience, education, skills). Encrypted at rest.
- **skills_matrix.json** — Skills inventory with market demand scores from skills-gap analysis.
- **career_goals.yaml** — Target roles, salary range, company preferences, deal-breakers.

## How It's Used
Every skill reads from this directory. `profile-setup` writes here; `resume-optimizer`, `cover-letter-generator`, `interview-prep`, and `job-search` all consume it.

## Updating
Run `career-intelligence:profile-setup update` to modify specific sections without re-doing the full setup.
""",
            "resumes/README.md": """# Resumes

Version-controlled resume management.

## Directories
- **current/** — Active resume versions you're sending to employers right now.
- **archive/** — Previous versions. Never delete — you may need to reference old phrasing.
- **variations/** — Role-specific customizations (e.g. `fintech-focused/`, `leadership-focused/`).
- **sources/** — Raw achievement data, project summaries, skills inventories that feed resume generation.

## Naming Convention
```
FirstName_LastName_TargetRole_YYYY-MM-DD.html
```

## Workflow
1. Run `career-intelligence:resume-optimizer` with a job posting
2. Output lands in `current/`
3. When you update, previous version moves to `archive/`
""",
            "resumes/sources/achievements.md": """# Achievement Bank

Quantified achievements ready to drop into resumes. Keep this updated.

## Format
Use the X-Y-Z formula: **Accomplished [X] as measured by [Y], by doing [Z].**

## Achievements

### [Most Recent Role]
- 
- 
- 

### [Previous Role]
- 
- 
- 

## Projects With Measurable Impact
| Project | Metric | Result |
|---------|--------|--------|
| | | |

---
*Update this file whenever you ship something notable.*
""",
            "applications/README.md": """# Applications

Your job application pipeline — from applied to offer.

## Pipeline Stages
| Directory | Stage |
|-----------|-------|
| `active/` | Applied, waiting for response |
| `interviews/` | Screening or interview stage |
| `offers/` | Received an offer |
| `archived/` | Completed — accepted, rejected, or withdrawn |

## Per-Application Folder
Create a folder per application inside the appropriate stage:
```
active/stripe-staff-engineer/
├── application.md      # Role details, timeline, notes
├── resume.html         # Resume version used
├── cover-letter.md     # Cover letter sent
└── research.md         # Company research notes
```

When the stage changes, move the folder (e.g. `active/` → `interviews/`).

## Tracker
`tracker.json` is the machine-readable pipeline state. Skills update it automatically.
""",
            "applications/application_template.md": """# Application: [Company] — [Role]

**Applied:** YYYY-MM-DD
**Status:** Applied | Screening | Interviewing | Final Round | Offer | Rejected | Withdrawn
**Priority:** High | Medium | Low
**Source:** LinkedIn | Referral | Company Site | Job Board

## Role
- **Title:** 
- **Team/Dept:** 
- **Location:** 
- **Salary Range:** 
- **Job URL:** 

## Company Notes
- Culture: 
- Tech stack: 
- Recent news: 
- Why I'm interested: 

## Materials Sent
- Resume version: 
- Cover letter: Yes / No
- Portfolio links: 

## Requirements Match
### Strong Match
- 

### Gaps to Address
- 

## Timeline
| Date | Event | Notes |
|------|-------|-------|
| | Applied | |

## Interview Notes
### [Date] — [Type: Phone / Video / Onsite]
**Interviewer:** 
**Questions asked:**
- 

**My questions:**
- 

**Impression:**

## Outcome
**Result:** 
**Feedback:** 
**Lessons learned:** 
""",
            "research/README.md": """# Research

Market intelligence powering your job search strategy.

## Directories
- **companies/** — One folder per target company with culture, tech stack, interview process, news.
- **roles/** — Role-level analysis: leveling expectations, day-to-day responsibilities, growth paths.
- **salary/** — Compensation benchmarks from Levels.fyi, Glassdoor, Blind, and your own data points.
- **industry/** — Macro trends: hiring freezes, hot sectors, emerging roles, remote work shifts.
- **skills_gap/** — Skills demand analysis and your personal upskilling roadmap.

## Company Research Template
Create `research/companies/company-name/overview.md`:
```markdown
# [Company Name]
- Industry:
- Size:
- Stage:
- Tech stack:
- Culture notes:
- Interview process:
- Glassdoor rating:
- Recent news:
```
""",
            "research/companies/company_template.md": """# [Company Name]

## Overview
- **Industry:** 
- **Size:** 
- **Stage:** Startup | Growth | Enterprise | Public
- **Founded:** 
- **HQ:** 
- **Remote policy:** 

## Technology
- **Primary stack:** 
- **Infrastructure:** 
- **Notable tech:** 

## Culture & Values
- 

## Interview Process
1. Recruiter screen
2. Technical phone screen
3. Onsite / Virtual onsite
4. Team match / Bar raiser

**Timeline:** ~X weeks end to end
**Known focus areas:** 

## Compensation
- **Base range:** 
- **Total comp range:** 
- **Equity type:** RSU | Options
- **Refreshers:** 

## Pros & Cons
**Pros:**
- 

**Cons:**
- 

## Sources
- 
""",
            "cover-letters/README.md": """# Cover Letters

Templates and application-specific cover letters.

## Directories
- **templates/** — Reusable base templates by style (professional, conversational, executive).
- **generated/** — One-off letters created for specific applications. Named to match the application.

## Naming Convention
```
FirstName_LastName_Company_Role_YYYY-MM-DD.md
```

## Tips
- Keep letters under 300 words
- Open with why this company specifically (not generic flattery)
- Connect your top 2-3 achievements to their requirements
- Close with a clear next step
""",
            "interview-prep/README.md": """# Interview Prep

Structured preparation for every interview stage.

## Directories
- **questions/** — Common questions and your prepared answers, organized by type.
- **stories/** — STAR-format achievement stories ready to deploy in behavioral interviews.
- **technical/** — Technical prep: system design patterns, coding problem types, domain knowledge.
- **notes/** — Post-interview notes: what was asked, how it went, what to improve.

## Story Bank (STAR Format)
Each story in `stories/` follows:
```
Situation: Context and challenge
Task: Your specific responsibility
Action: What you did (be specific)
Result: Quantified outcome
```

Aim for 8-12 stories covering: leadership, conflict, failure, delivery, innovation, collaboration.

## Post-Interview Notes
After every interview, immediately write notes in `notes/`:
- Questions you were asked
- How you answered
- What went well
- What to improve
- Your impression of the team/company
""",
            "interview-prep/questions/behavioral.md": """# Behavioral Questions

Prepared answers for common behavioral interview questions.

## Leadership
**"Tell me about a time you led a project."**
- Story: 

**"Describe a situation where you had to influence without authority."**
- Story: 

## Conflict & Challenge
**"Tell me about a disagreement with a coworker."**
- Story: 

**"Describe a time you failed."**
- Story: 

## Delivery
**"Tell me about a time you delivered under a tight deadline."**
- Story: 

**"Describe a project that didn't go as planned."**
- Story: 

## Collaboration
**"How do you work with cross-functional teams?"**
- Story: 

## Growth
**"What's the most important thing you've learned recently?"**
- Answer: 

**"Where do you see yourself in 5 years?"**
- Answer: 
""",
            "interview-prep/stories/story_template.md": """# Story: [Short Title]

**Category:** Leadership | Conflict | Delivery | Innovation | Collaboration | Failure
**Best for roles:** [e.g., Staff Engineer, Eng Manager]

## Situation
[Context — what was happening, what was the challenge]

## Task
[Your specific responsibility in this situation]

## Action
[What you did — be specific about YOUR actions, not the team's]

## Result
[Quantified outcome — numbers, percentages, business impact]

## Variations
- **30-second version:** [One-liner for quick mentions]
- **2-minute version:** [Full story for dedicated behavioral questions]

## Used In
| Date | Company | Question | Reception |
|------|---------|----------|-----------|
| | | | |
""",
            "networking/README.md": """# Networking

Professional contacts, referral tracking, and outreach management.

## Files
- **contacts.json** — Machine-readable contact list with categories, last contact date, and notes.
- **outreach/** — Templates and logs for informational interviews, referral requests, and follow-ups.

## Contact Categories
| Category | Description |
|----------|-------------|
| Recruiter | External or internal recruiters at target companies |
| Hiring Manager | Direct hiring managers for roles you're targeting |
| Referral | People who can refer you into a company |
| Mentor | Career advisors and mentors |
| Peer | Fellow job seekers, industry peers |

## Outreach Cadence
- **New contact:** Send intro within 24 hours of meeting
- **Active referral:** Follow up weekly while application is in progress
- **Warm contacts:** Touch base monthly
- **Dormant contacts:** Quarterly check-in
""",
            "networking/outreach/referral_request_template.md": """# Referral Request Template

## Subject
Interested in [Role] at [Company] — would you be open to referring me?

## Message

Hi [Name],

Hope you're doing well! I noticed [Company] has an opening for [Role] on the [Team] team, and it looks like a great fit for my background in [relevant experience].

I've been [brief context — e.g., "exploring senior engineering roles focused on distributed systems"].

Would you be comfortable submitting a referral? I can send over my resume and a brief summary of why I think it's a strong match.

Either way, would love to catch up soon.

Best,
[Your Name]

---
**Customize before sending:** Replace brackets, add specific details about why this role + your background align.
""",
            "projects/README.md": """# Projects

Portfolio documentation and case studies for resumes and interviews.

## Structure
Create one folder per project in `case-studies/`:
```
case-studies/distributed-cache-system/
├── overview.md     # Full case study
├── metrics.md      # Quantified results
└── visuals/        # Diagrams, screenshots (optional)
```

## What to Document
For each project, capture:
1. **Problem** — What business problem did this solve?
2. **Your role** — What was your specific contribution?
3. **Approach** — Technical decisions, trade-offs, architecture
4. **Impact** — Quantified results (performance, revenue, users, time saved)
5. **Lessons** — What you learned, what you'd do differently

## Using Projects
- `resume-optimizer` pulls relevant projects based on target role keywords
- `interview-prep` builds STAR stories from your project docs
- Keep 5-8 strong projects documented and current
""",
            "projects/case-studies/project_template.md": """# Project: [Name]

**Role:** [Your title/role on this project]
**Timeline:** [Start] — [End]
**Team Size:** [N people]
**Status:** Active | Completed

## Problem
[What business problem did this solve? Who was impacted?]

## Solution
[High-level approach. What did you build/change?]

## Your Contribution
- [Specific things you did]
- [Technical decisions you made]
- [People you led or collaborated with]

## Technical Details
- **Stack:** 
- **Architecture:** 
- **Key challenges:** 

## Results
- [Quantified metric 1]
- [Quantified metric 2]
- [Quantified metric 3]

## Lessons Learned
- 

## Relevant For
- [ ] Backend / Systems roles
- [ ] Frontend roles
- [ ] Full-stack roles
- [ ] Leadership / Management roles
- [ ] Infrastructure / DevOps roles
""",
        }

        count = 0
        for rel_path, content in templates.items():
            fpath = self.base_dir / rel_path
            if not fpath.exists():
                fpath.write_text(content.lstrip("\n"))
                count += 1

        print(f"📝 Template files created ({count} files)")

    # ── Integration ──────────────────────────────────────────────────────

    def _create_profile_integration_dir(self):
        """Create the plugin integration directory at ~/.mysios-career-intelligence."""
        self.profile_integration_dir.mkdir(parents=True, exist_ok=True)

        pointer = {
            "workspace_path": str(self.base_dir),
            "version": "1.3.0",
            "created": datetime.now().isoformat(),
        }
        pointer_file = self.profile_integration_dir / "workspace_pointer.json"
        if not pointer_file.exists():
            pointer_file.write_text(json.dumps(pointer, indent=2))
            print(f"🔗 Integration pointer: {self.profile_integration_dir}")

    # ── State Files ──────────────────────────────────────────────────────

    def _initialize_state_files(self):
        """Create initial state files for every automation skill."""
        now = datetime.now().isoformat()

        states = {
            "state/applications/pipeline.json": {
                "last_updated": now,
                "pipeline": {
                    "applied": [],
                    "screening": [],
                    "interviewing": [],
                    "final_round": [],
                    "offer": [],
                    "rejected": [],
                    "withdrawn": [],
                },
                "stats": {
                    "total_applications": 0,
                    "response_rate": 0.0,
                    "interview_conversion": 0.0,
                    "active_applications": 0,
                },
            },
            "state/resume-optimizer/history.json": {
                "last_updated": now,
                "versions": [],
                "generation_history": [],
                "ats_scores": {},
            },
            "state/job-search/searches.json": {
                "last_updated": now,
                "saved_searches": [],
                "saved_jobs": [],
                "applied_job_ids": [],
                "dismissed_job_ids": [],
                "search_stats": {
                    "total_searches": 0,
                    "jobs_reviewed": 0,
                    "jobs_saved": 0,
                },
            },
            "state/interview-prep/progress.json": {
                "last_updated": now,
                "upcoming_interviews": [],
                "completed_interviews": [],
                "stories_prepared": 0,
                "technical_topics_reviewed": [],
                "prep_hours_logged": 0,
            },
            "state/analytics/summary.json": {
                "last_updated": now,
                "metrics": {
                    "applications_sent": 0,
                    "interviews_completed": 0,
                    "offers_received": 0,
                    "resumes_generated": 0,
                    "avg_ats_score": 0.0,
                },
                "weekly_stats": {},
            },
            "applications/tracker.json": {
                "last_updated": now,
                "applications": [],
                "tags": ["dream_job", "backup", "stretch", "referral"],
            },
            "networking/contacts.json": {
                "last_updated": now,
                "contacts": [],
                "categories": [
                    "recruiter",
                    "hiring_manager",
                    "referral",
                    "mentor",
                    "peer",
                ],
            },
        }

        for rel_path, data in states.items():
            fpath = self.base_dir / rel_path
            if not fpath.exists():
                fpath.write_text(json.dumps(data, indent=2))

        print(f"📊 State files initialized ({len(states)} files)")

    # ── Configuration ────────────────────────────────────────────────────

    def _create_config_files(self, user_name=None):
        """Generate config YAML (or JSON fallback) files."""
        now_date = datetime.now().strftime("%Y-%m-%d")

        settings = {
            "career_intelligence": {
                "version": "1.3.0",
                "workspace_name": "career-ops",
                "created": now_date,
            },
            "user": {
                "name": user_name or "",
                "email": "",
                "timezone": "America/New_York",
                "language": "en",
            },
            "preferences": {
                "resume_format": "modern",
                "cover_letter_style": "professional",
                "follow_up_cadence": "weekly",
                "auto_archive_days": 90,
            },
            "storage": {
                "location": "icloud" if "CloudDocs" in str(self.base_dir) else "local",
                "encryption": True,
                "backup_frequency": "weekly",
            },
        }

        integrations = {
            "supabase": {
                "enabled": False,
                "project_url": "",
                "anon_key": "",
            },
            "firecrawl": {
                "enabled": False,
                "api_key_configured": False,
            },
            "job_boards": {
                "linkedin": {"profile_url": "", "active": True},
                "indeed": {"active": False},
                "glassdoor": {"active": False},
                "wellfound": {"active": False},
            },
        }

        schedules = {
            "daily": {
                "morning_search": {
                    "time": "08:00",
                    "skills": ["job-search"],
                },
                "application_followup": {
                    "time": "10:00",
                    "skills": ["application-tracker"],
                },
            },
            "weekly": {
                "resume_refresh": {
                    "day": "sunday",
                    "time": "19:00",
                    "skills": ["resume-optimizer"],
                },
                "market_analysis": {
                    "day": "monday",
                    "time": "08:00",
                    "skills": ["salary-research"],
                },
            },
            "monthly": {
                "skills_assessment": {
                    "schedule": "1st",
                    "skills": ["skills-gap-analysis"],
                },
                "workspace_maintenance": {
                    "schedule": "15th",
                    "tasks": ["archive_old_applications", "rotate_logs", "backup"],
                },
            },
        }

        config_map = {
            "settings": settings,
            "integrations": integrations,
            "schedules": schedules,
        }

        for name, data in config_map.items():
            if YAML_AVAILABLE:
                fpath = self.base_dir / "config" / f"{name}.yaml"
                if not fpath.exists():
                    fpath.write_text(yaml.dump(data, default_flow_style=False, sort_keys=False))
            else:
                fpath = self.base_dir / "config" / f"{name}.json"
                if not fpath.exists():
                    fpath.write_text(json.dumps(data, indent=2))

        print("⚙️  Configuration files created")

    # ── README ───────────────────────────────────────────────────────────

    def _create_workspace_readme(self, user_name=None):
        """Generate workspace README."""
        title = f"Career Intelligence Workspace{' — ' + user_name if user_name else ''}"
        readme = f"""# {title}

> **Created:** {datetime.now().strftime('%Y-%m-%d %H:%M')}
> **Plugin Version:** 1.3.0
> **Part of the Mysios Labs Professional Intelligence Suite**

## Directory Map

| Directory | Purpose |
|-----------|---------|
| `profile/` | Professional identity, skills matrix, career goals |
| `resumes/` | Current, archived, and role-specific resume versions |
| `applications/` | Application pipeline — active, interviews, offers, archived |
| `research/` | Company research, salary data, industry trends, skills gap |
| `cover-letters/` | Templates and application-specific cover letters |
| `interview-prep/` | Questions, STAR stories, technical prep, post-interview notes |
| `networking/` | Professional contacts, outreach templates and logs |
| `projects/` | Portfolio case studies and project write-ups |
| `state/` | Persistent state for automation skills |
| `logs/` | Daily activity, errors, and performance metrics |
| `config/` | Settings, integrations, and schedules |

## Getting Started

1. **Profile Setup** — `career-intelligence:profile-setup`
2. **Generate Resume** — `career-intelligence:resume-optimizer`
3. **Search Jobs** — `career-intelligence:job-search`
4. **Prepare for Interviews** — `career-intelligence:interview-prep`

## Maintenance

```bash
# Validate system health
python3 skills/system-setup/scripts/setup.py --validate

# Backup workspace
python3 skills/system-setup/scripts/setup.py --backup

# Cleanup old data
python3 skills/system-setup/scripts/setup.py --cleanup
```

---
*Generated by Career Intelligence Plugin — Mysios Labs*
"""
        readme_path = self.base_dir / "README.md"
        if not readme_path.exists():
            readme_path.write_text(readme)

    # ── Permissions ──────────────────────────────────────────────────────

    def _set_permissions(self):
        """Secure sensitive files and directories."""
        try:
            os.chmod(self.base_dir, 0o700)

            sensitive_files = [
                self.base_dir / "profile" / "profile_data.json",
                self.base_dir / "config" / "integrations.yaml",
                self.base_dir / "config" / "integrations.json",
                self.base_dir / "networking" / "contacts.json",
            ]
            for f in sensitive_files:
                if f.exists():
                    os.chmod(f, 0o600)

            print("🔒 Permissions configured")
        except OSError:
            print("⚠️  Could not set file permissions (non-POSIX system?)")

    # ── Dependency Validation ────────────────────────────────────────────

    def validate_dependencies(self, verbose=True):
        """Check Python and Node.js dependencies."""
        ok = True

        if verbose:
            print("\n🔍 Checking dependencies...\n")

        # Python packages
        python_deps = {
            "cryptography": "cryptography",
            "PyPDF2": "PyPDF2",
            "numpy": "numpy",
            "pandas": "pandas",
            "requests": "requests",
            "beautifulsoup4": "bs4",
            "scikit-learn": "sklearn",
            "nltk": "nltk",
            "textblob": "textblob",
        }

        missing_py = []
        for pkg_name, import_name in python_deps.items():
            try:
                __import__(import_name)
                if verbose:
                    print(f"  ✅ {pkg_name}")
            except ImportError:
                missing_py.append(pkg_name)
                if verbose:
                    print(f"  ❌ {pkg_name}")

        if missing_py:
            ok = False
            if verbose:
                print(f"\n  💡 Install missing: pip install {' '.join(missing_py)}")

        # Node.js
        if verbose:
            print()
        node_ok = self._check_command("node", "--version", "18.0.0", verbose)
        npm_ok = self._check_command("npm", "--version", None, verbose)

        if node_ok and npm_ok:
            npm_installed = self._check_npm_packages(verbose)
            if not npm_installed:
                ok = False
        else:
            ok = False

        # PyYAML (optional but recommended)
        if not YAML_AVAILABLE and verbose:
            print("\n  ⚠️  PyYAML not installed — configs will use JSON fallback")
            print("  💡 pip install pyyaml")

        return ok

    def _check_command(self, cmd, flag, min_version, verbose):
        """Check if a CLI command exists and meets minimum version."""
        try:
            result = subprocess.run(
                [cmd, flag], capture_output=True, text=True, timeout=10
            )
            version_str = result.stdout.strip().lstrip("v")
            if verbose:
                print(f"  ✅ {cmd} {version_str}")

            if min_version:
                installed = tuple(int(x) for x in version_str.split(".")[:3])
                required = tuple(int(x) for x in min_version.split(".")[:3])
                if installed < required:
                    if verbose:
                        print(f"     ⚠️  Minimum required: {min_version}")
                    return False
            return True
        except (FileNotFoundError, subprocess.TimeoutExpired):
            if verbose:
                print(f"  ❌ {cmd} not found")
            return False

    def _check_npm_packages(self, verbose):
        """Verify npm packages from package.json are installed."""
        pkg_json = self.plugin_dir / "package.json"
        node_modules = self.plugin_dir / "node_modules"

        if not pkg_json.exists():
            if verbose:
                print("  ⚠️  No package.json found in plugin directory")
            return True

        if not node_modules.exists():
            if verbose:
                print("  ❌ node_modules not found — run: npm install")
            return False

        if verbose:
            print("  ✅ node_modules present")
        return True

    # ── System Validation ────────────────────────────────────────────────

    def validate_system(self, verbose=False):
        """Run full system validation."""
        print("🔍 Validating Career Intelligence System...\n")
        results = {}

        # 1. Directories
        missing_dirs = []
        for rel in self.WORKSPACE_DIRS:
            if not (self.base_dir / rel).exists():
                missing_dirs.append(rel)
        results["directories"] = len(missing_dirs) == 0
        if missing_dirs:
            print(f"  ❌ Missing directories: {len(missing_dirs)}")
            if verbose:
                for d in missing_dirs[:10]:
                    print(f"     - {d}")
        else:
            print(f"  ✅ Directory structure complete ({len(self.WORKSPACE_DIRS)} dirs)")

        # 2. State files
        state_files = [
            "state/applications/pipeline.json",
            "state/resume-optimizer/history.json",
            "state/job-search/searches.json",
            "state/interview-prep/progress.json",
            "state/analytics/summary.json",
        ]
        missing_state = [f for f in state_files if not (self.base_dir / f).exists()]
        results["state_files"] = len(missing_state) == 0
        if missing_state:
            print(f"  ❌ Missing state files: {len(missing_state)}")
        else:
            print(f"  ✅ State files intact ({len(state_files)} files)")

        # 3. Configuration
        config_ext = "yaml" if YAML_AVAILABLE else "json"
        config_files = [f"config/settings.{config_ext}", f"config/integrations.{config_ext}"]
        missing_config = [f for f in config_files if not (self.base_dir / f).exists()]
        results["configuration"] = len(missing_config) == 0
        if missing_config:
            print(f"  ❌ Missing config: {', '.join(missing_config)}")
        else:
            print("  ✅ Configuration files present")

        # 4. Profile
        profile_path = self.base_dir / "profile" / "profile_data.json"
        profile_exists = profile_path.exists()
        results["profile"] = profile_exists
        if profile_exists:
            try:
                profile = json.loads(profile_path.read_text())
                completeness = self._calculate_profile_completeness(profile)
                print(f"  ✅ Profile found ({completeness}% complete)")
            except (json.JSONDecodeError, KeyError):
                print("  ⚠️  Profile found but may be corrupted")
        else:
            print("  ⚠️  No profile yet — run career-intelligence:profile-setup")

        # 5. Dependencies
        results["dependencies"] = self.validate_dependencies(verbose)

        # 6. Integration pointer
        pointer = self.profile_integration_dir / "workspace_pointer.json"
        results["integration"] = pointer.exists()
        if pointer.exists():
            print(f"  ✅ Integration pointer: {self.profile_integration_dir}")
        else:
            print("  ❌ Integration pointer missing")

        # 7. Permissions
        results["permissions"] = self._validate_permissions(verbose)

        # Summary
        passed = sum(1 for v in results.values() if v)
        total = len(results)
        print(f"\n{'🎉' if passed == total else '⚠️'} Validation: {passed}/{total} checks passed")

        # Save report
        self._save_validation_report(results)

        return all(results.values())

    def _calculate_profile_completeness(self, profile):
        """Calculate profile completeness percentage."""
        sections = {
            "personal": 15,
            "professional": 20,
            "experience": 25,
            "education": 10,
            "preferences": 15,
            "skills": 15,
        }
        score = 0
        for section, weight in sections.items():
            data = profile.get(section)
            if data and (isinstance(data, dict) and len(data) > 0) or (isinstance(data, list) and len(data) > 0):
                score += weight
        return score

    def _validate_permissions(self, verbose):
        """Check file permissions on sensitive files."""
        try:
            stat = os.stat(self.base_dir)
            mode = stat.st_mode & 0o777
            if mode == 0o700:
                if verbose:
                    print("  ✅ Workspace permissions: 700")
                return True
            else:
                if verbose:
                    print(f"  ⚠️  Workspace permissions: {oct(mode)} (expected 700)")
                return False
        except OSError:
            return True

    def _save_validation_report(self, results):
        """Save validation report to logs."""
        logs_dir = self.base_dir / "logs"
        logs_dir.mkdir(parents=True, exist_ok=True)

        report = {
            "timestamp": datetime.now().isoformat(),
            "results": {k: str(v) for k, v in results.items()},
            "workspace": str(self.base_dir),
            "plugin_dir": str(self.plugin_dir),
        }
        report_file = logs_dir / f"validation-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
        report_file.write_text(json.dumps(report, indent=2))

    # ── Health Check (quick) ─────────────────────────────────────────────

    def health_check(self):
        """Quick health check — just pass/fail essentials."""
        print("💓 Quick Health Check\n")
        checks = {
            "workspace_exists": self.base_dir.exists(),
            "profile_dir": (self.base_dir / "profile").exists(),
            "state_dir": (self.base_dir / "state").exists(),
            "config_dir": (self.base_dir / "config").exists(),
            "node_available": shutil.which("node") is not None,
            "python3_available": shutil.which("python3") is not None,
        }

        for name, ok in checks.items():
            icon = "✅" if ok else "❌"
            print(f"  {icon} {name.replace('_', ' ').title()}")

        passed = all(checks.values())
        print(f"\n{'🎉 All clear!' if passed else '⚠️  Issues detected — run --validate for details'}")
        return passed

    # ── Backup ───────────────────────────────────────────────────────────

    def backup(self, dest=None):
        """Create a compressed backup of the workspace."""
        if not self.base_dir.exists():
            print("❌ No workspace found to backup")
            return False

        backup_dir = Path(dest) if dest else Path.home() / "Backups" / "career-ops"
        backup_dir.mkdir(parents=True, exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        archive_name = f"career-ops-{timestamp}"
        archive_path = backup_dir / archive_name

        shutil.make_archive(str(archive_path), "gztar", self.base_dir.parent, self.base_dir.name)
        final_path = f"{archive_path}.tar.gz"
        size_mb = os.path.getsize(final_path) / (1024 * 1024)

        print(f"✅ Backup created: {final_path} ({size_mb:.1f} MB)")
        return True

    # ── Cleanup ──────────────────────────────────────────────────────────

    def cleanup(self, archive_days=90, log_days=30):
        """Archive old applications and rotate logs."""
        if not self.base_dir.exists():
            print("❌ No workspace found")
            return

        now = datetime.now()
        archived_count = 0
        log_count = 0

        # Archive old applications
        active_dir = self.base_dir / "applications" / "active"
        archive_dir = self.base_dir / "applications" / "archived"
        if active_dir.exists():
            for f in active_dir.iterdir():
                if f.is_file():
                    age = (now - datetime.fromtimestamp(f.stat().st_mtime)).days
                    if age > archive_days:
                        shutil.move(str(f), str(archive_dir / f.name))
                        archived_count += 1

        # Rotate old logs
        for log_subdir in ["daily", "errors", "performance"]:
            log_dir = self.base_dir / "logs" / log_subdir
            if log_dir.exists():
                for f in log_dir.iterdir():
                    if f.is_file():
                        age = (now - datetime.fromtimestamp(f.stat().st_mtime)).days
                        if age > log_days:
                            f.unlink()
                            log_count += 1

        print(f"🧹 Cleanup complete: {archived_count} applications archived, {log_count} old logs removed")

    # ── Helpers ──────────────────────────────────────────────────────────

    def _count_dirs(self):
        """Count directories in workspace."""
        if not self.base_dir.exists():
            return 0
        return sum(1 for _ in self.base_dir.rglob("*") if _.is_dir())


# ── CLI ──────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Career Intelligence System Setup",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 setup.py --init                          # Interactive setup
  python3 setup.py --init --name "Jane Doe"        # Setup with name
  python3 setup.py --init --location icloud        # Force iCloud location
  python3 setup.py --validate --verbose            # Full validation
  python3 setup.py --health                        # Quick health check
  python3 setup.py --backup                        # Backup workspace
  python3 setup.py --cleanup                       # Archive old data
        """,
    )

    parser.add_argument("--init", action="store_true", help="Initialize new career workspace")
    parser.add_argument("--name", help="User's full name")
    parser.add_argument(
        "--location",
        choices=["icloud", "local", "custom"],
        help="Workspace location (default: auto-detect)",
    )
    parser.add_argument("--custom-path", help="Custom workspace path (use with --location custom)")
    parser.add_argument("--validate", action="store_true", help="Validate existing setup")
    parser.add_argument("--health", action="store_true", help="Quick health check")
    parser.add_argument("--backup", action="store_true", help="Backup workspace")
    parser.add_argument("--backup-dest", help="Backup destination directory")
    parser.add_argument("--cleanup", action="store_true", help="Archive old data and rotate logs")
    parser.add_argument("--archive-days", type=int, default=90, help="Archive applications older than N days")
    parser.add_argument("--log-days", type=int, default=30, help="Remove logs older than N days")
    parser.add_argument("--check-updates", action="store_true", help="Check for outdated dependencies")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")

    args = parser.parse_args()

    # Resolve workspace location
    base_dir = None
    if args.location == "icloud":
        base_dir = Path.home() / "Library" / "Mobile Documents" / "com~apple~CloudDocs" / "career-ops"
    elif args.location == "local":
        base_dir = Path.home() / "Documents" / "career-ops"
    elif args.location == "custom" and args.custom_path:
        base_dir = Path(args.custom_path)

    setup = CareerSystemSetup(base_dir=base_dir)

    if args.init:
        if not args.name:
            try:
                args.name = input("Your full name (press Enter to skip): ").strip() or None
            except (EOFError, KeyboardInterrupt):
                args.name = None
        setup.initialize_system(user_name=args.name)

    elif args.validate:
        success = setup.validate_system(verbose=args.verbose)
        sys.exit(0 if success else 1)

    elif args.health:
        success = setup.health_check()
        sys.exit(0 if success else 1)

    elif args.backup:
        setup.backup(dest=args.backup_dest)

    elif args.cleanup:
        setup.cleanup(archive_days=args.archive_days, log_days=args.log_days)

    elif args.check_updates:
        print("📦 Checking for outdated packages...\n")
        subprocess.run([sys.executable, "-m", "pip", "list", "--outdated"])

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
