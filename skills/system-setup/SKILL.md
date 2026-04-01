---
name: system-setup
description: >
  Initialize the career intelligence system with proper directory structure,
  state management, dependency validation, and configuration templates. Run
  this first before any other career intelligence skills. Use when setting up
  new environments, onboarding new job seekers, or performing system maintenance.
  Triggered by "setup system", "initialize career workspace", "configure job search",
  "validate setup", or system initialization requests.
---

# System Setup

Initialize the complete career intelligence infrastructure with proper directory structure, state management, dependency validation, and job search configuration.

## Quick Start

1. **Location Selection**: Choose where to create your career workspace
2. **Workspace Setup**: Create complete `career-ops/` directory structure
3. **Dependency Validation**: Verify Python and Node.js packages are installed
4. **State Management**: Set up persistent state tracking for all career skills
5. **Configuration**: Initialize profile, job search preferences, and integration settings
6. **Health Check**: Validate the entire system is ready

## Setup Workflow

### Infrastructure Initialization
```bash
# Execute full system setup (interactive)
python3 skills/system-setup/scripts/setup.py --init

# Non-interactive setup with options
python3 skills/system-setup/scripts/setup.py --init --name "Jane Doe" --location icloud

# Validate existing setup
python3 skills/system-setup/scripts/setup.py --validate --verbose
```

### Complete Career-Ops Directory Structure

**Creates a self-contained job search operations center:**
```
career-ops/
├── profile/                    # Professional identity
│   ├── profile_data.json       # Core profile (encrypted)
│   ├── skills_matrix.json      # Skills inventory + market demand
│   └── career_goals.yaml       # Target roles, salary, preferences
├── resumes/                    # Resume management
│   ├── current/                # Active versions for applications
│   ├── archive/                # Previous versions
│   ├── variations/             # Role-specific customizations
│   └── sources/                # Raw achievement data
├── applications/               # Application pipeline
│   ├── active/                 # In-progress applications
│   ├── interviews/             # Interview-stage applications
│   ├── offers/                 # Received offers
│   ├── archived/               # Completed (accepted/rejected/withdrawn)
│   └── tracker.json            # Pipeline state
├── research/                   # Market intelligence
│   ├── companies/              # Target company analysis
│   ├── roles/                  # Role-specific deep dives
│   ├── salary/                 # Compensation benchmarks
│   ├── industry/               # Industry trends
│   └── skills_gap/             # Skills demand analysis
├── cover-letters/              # Cover letter management
│   ├── templates/              # Reusable templates
│   └── generated/              # Application-specific letters
├── interview-prep/             # Interview preparation
│   ├── questions/              # Common questions + answers
│   ├── stories/                # STAR-format achievement stories
│   ├── technical/              # Technical prep materials
│   └── notes/                  # Post-interview notes
├── networking/                 # Professional networking
│   ├── contacts.json           # Key contacts and referrals
│   └── outreach/               # Outreach templates and logs
├── projects/                   # Portfolio documentation
│   └── case-studies/           # Detailed project write-ups
├── state/                      # Automation state (persistent)
│   ├── resume-optimizer/       # Resume generation history
│   ├── job-search/             # Search filters and saved jobs
│   ├── applications/           # Application pipeline state
│   ├── interview-prep/         # Prep progress tracking
│   └── analytics/              # Job search metrics
├── logs/                       # Execution logs
│   ├── daily/                  # Daily activity logs
│   ├── errors/                 # Error tracking
│   └── performance/            # Skill execution metrics
├── config/                     # System configuration
│   ├── settings.yaml           # Global settings
│   ├── integrations.yaml       # API and service configs
│   └── schedules.yaml          # Automation schedules
└── README.md                   # Workspace documentation
```

## Documentation

- **[Directory Structure](references/directory-structure.md)** — Detailed breakdown of data organization
- **[Configuration Templates](references/config-templates.md)** — Settings, integrations, state schemas

## Configuration

### Global Settings
```yaml
# career-ops/config/settings.yaml
career_intelligence:
  version: "1.3.0"
  workspace_name: "career-ops"
  created: "2026-04-01"

user:
  name: "Jane Doe"
  email: "jane@example.com"
  timezone: "America/New_York"
  language: "en"

preferences:
  resume_format: "modern"
  cover_letter_style: "professional"
  follow_up_cadence: "weekly"
  auto_archive_days: 90

storage:
  location: "icloud"
  encryption: true
  backup_frequency: "weekly"
```

### Job Board Configuration
```yaml
# career-ops/config/job-boards.yaml
job_boards:
  linkedin:
    profile_url: ""
    active: true
  indeed:
    active: false
  glassdoor:
    active: false
  wellfound:
    active: false
```

## State Management

### Application Pipeline State
```json
{
  "last_updated": "2026-04-01T12:00:00Z",
  "pipeline": {
    "applied": [],
    "screening": [],
    "interviewing": [],
    "final_round": [],
    "offer": [],
    "rejected": [],
    "withdrawn": []
  },
  "stats": {
    "total_applications": 0,
    "response_rate": 0.0,
    "interview_conversion": 0.0,
    "active_applications": 0
  }
}
```

### Resume Generation State
```json
{
  "last_updated": "2026-04-01T12:00:00Z",
  "versions": [],
  "generation_history": [],
  "ats_scores": {},
  "optimization_log": []
}
```

### Job Search State
```json
{
  "last_updated": "2026-04-01T12:00:00Z",
  "saved_searches": [],
  "saved_jobs": [],
  "applied_job_ids": [],
  "dismissed_job_ids": [],
  "search_stats": {
    "total_searches": 0,
    "jobs_reviewed": 0,
    "jobs_saved": 0
  }
}
```

### Interview Prep State
```json
{
  "last_updated": "2026-04-01T12:00:00Z",
  "upcoming_interviews": [],
  "completed_interviews": [],
  "stories_prepared": 0,
  "technical_topics_reviewed": [],
  "prep_hours_logged": 0
}
```

## Dependency Validation

### Python Dependencies
```python
def validate_python_deps():
    """Verify all required Python packages are installed"""
    required = {
        'cryptography': '>=3.4.8',
        'PyPDF2': '>=3.0.0',
        'numpy': '>=1.21.0',
        'pandas': '>=1.3.0',
        'requests': '>=2.28.0',
        'beautifulsoup4': '>=4.11.0'
    }
    missing = check_packages(required)
    if missing:
        print(f"Install missing: pip install {' '.join(missing)}")
    return len(missing) == 0
```

### Node.js Dependencies
```python
def validate_node_deps():
    """Verify Node.js and npm packages"""
    checks = {
        'node': check_command('node --version', min_version='18.0.0'),
        'npm_packages': check_npm_installed()
    }
    return all(checks.values())
```

## Health Checks & Validation

### System Health
```python
def validate_system_health():
    """Comprehensive system validation"""
    checks = {
        'directories': validate_directory_structure(),
        'profile': validate_profile_exists(),
        'dependencies_python': validate_python_deps(),
        'dependencies_node': validate_node_deps(),
        'state_files': verify_state_integrity(),
        'permissions': check_file_permissions(),
        'disk_space': check_storage_availability(),
        'config': validate_configuration()
    }
    return generate_health_report(checks)
```

### Profile Validation
```python
def validate_profile():
    """Ensure profile data is complete and valid"""
    profile_path = workspace / "profile" / "profile_data.json"
    if not profile_path.exists():
        return {"status": "missing", "completeness": 0}

    profile = load_profile(profile_path)
    return {
        "status": "valid",
        "completeness": calculate_completeness(profile),
        "missing_fields": find_missing_fields(profile),
        "last_updated": profile.get("metadata", {}).get("updated")
    }
```

## Maintenance Operations

### Backup & Restore
```bash
# Create workspace backup
python3 skills/system-setup/scripts/setup.py --backup

# Restore from backup
python3 skills/system-setup/scripts/setup.py --restore --backup-file ~/Backups/career-ops-2026-04-01.tar.gz
```

### Workspace Cleanup
```bash
# Archive old applications (>90 days)
python3 skills/system-setup/scripts/setup.py --cleanup --archive-days 90

# Rotate logs (keep 30 days)
python3 skills/system-setup/scripts/setup.py --cleanup --log-days 30
```

### Dependency Updates
```bash
# Check for outdated packages
python3 skills/system-setup/scripts/setup.py --check-updates

# Update all dependencies
pip install -r requirements.txt --upgrade
npm update
```

## Security & Privacy

### Data Protection
- **Profile Encryption**: Fernet encryption for sensitive profile data
- **File Permissions**: `600` on profile data, `700` on workspace root
- **No Cloud APIs**: All data stored locally, no external transmission
- **Backup Encryption**: Optional encrypted backups with passphrase

### Permission Structure
```bash
career-ops/                     # 700 (drwx------)
├── profile/profile_data.json   # 600 (-rw-------)
├── config/integrations.yaml    # 600 (-rw-------)
├── logs/                       # 755 (drwxr-xr-x)
└── state/                      # 755 (drwxr-xr-x)
```

## Scheduling

### Job Search Automation Schedule
```yaml
# career-ops/config/schedules.yaml
daily:
  morning_search:
    time: "08:00"
    skills: ["job-search"]
    description: "Scan new job postings matching saved searches"

  application_followup:
    time: "10:00"
    skills: ["application-tracker"]
    description: "Check application statuses and send follow-ups"

weekly:
  resume_refresh:
    day: "sunday"
    time: "19:00"
    skills: ["resume-optimizer"]
    description: "Review and update resume for the week ahead"

  market_analysis:
    day: "monday"
    time: "08:00"
    skills: ["salary-research", "market-analysis"]
    description: "Update salary benchmarks and market trends"

  interview_prep:
    day: "wednesday"
    time: "19:00"
    skills: ["interview-prep"]
    description: "Prepare for upcoming interviews"

monthly:
  skills_assessment:
    schedule: "1st"
    skills: ["skills-gap-analysis"]
    description: "Re-evaluate skills against market demand"

  workspace_maintenance:
    schedule: "15th"
    tasks: ["archive_old_applications", "rotate_logs", "backup"]
```

## Integration with Other Skills

Once system-setup completes, all other skills use the initialized infrastructure:

- **profile-setup** → Reads/writes to `career-ops/profile/`
- **resume-optimizer** → Generates into `career-ops/resumes/current/`, logs to `state/resume-optimizer/`
- **job-search** → Saves results to `career-ops/research/`, updates `state/job-search/`
- **cover-letter-generator** → Writes to `career-ops/cover-letters/generated/`
- **interview-prep** → Uses `career-ops/interview-prep/`, tracks in `state/interview-prep/`
- **salary-research** → Caches data in `career-ops/research/salary/`
- **sv-resume-optimizer** → Reads profile, writes optimized resumes to `career-ops/resumes/current/`
- **resume-html-generator** → Generates HTML/PDF output from resume data
- **resume-content-analyzer** → Reads resumes, writes analysis to `state/`

## Quick Commands

```bash
# Full interactive setup (recommended for first run)
python3 skills/system-setup/scripts/setup.py --init

# Setup with options
python3 skills/system-setup/scripts/setup.py --init --name "Jane Doe" --location icloud

# Validate everything
python3 skills/system-setup/scripts/setup.py --validate --verbose

# Quick health check
python3 skills/system-setup/scripts/setup.py --health

# Backup workspace
python3 skills/system-setup/scripts/setup.py --backup

# Cleanup old data
python3 skills/system-setup/scripts/setup.py --cleanup
```

This skill ensures your career intelligence system has a solid foundation with proper data management, security, and scalability from day one.
