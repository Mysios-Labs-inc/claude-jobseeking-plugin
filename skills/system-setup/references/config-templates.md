# Configuration Templates Reference

Complete configuration schemas and templates for the career intelligence system.

## Global Settings (`config/settings.yaml`)

```yaml
career_intelligence:
  version: "1.3.0"
  workspace_name: "career-ops"
  created: "2026-04-01"

user:
  name: "Jane Doe"
  email: "jane@example.com"
  phone: "+1-555-0123"
  timezone: "America/New_York"
  language: "en"
  location: "San Francisco, CA"

preferences:
  # Resume generation
  resume_format: "modern"           # modern | classic | creative | minimal
  resume_template: "silicon_valley_minimal"
  default_page_count: 1             # 1 | 2

  # Cover letters
  cover_letter_style: "professional" # professional | conversational | executive

  # Application management
  follow_up_cadence: "weekly"        # daily | weekly | biweekly
  auto_archive_days: 90              # Archive resolved applications after N days

  # Job search
  search_frequency: "daily"          # daily | weekly
  max_saved_jobs: 100
  auto_dismiss_days: 30              # Auto-dismiss unsaved jobs after N days

storage:
  location: "icloud"                 # icloud | local | custom
  custom_path: ""                    # Only when location is "custom"
  encryption: true                   # Fernet encryption for profile data
  backup_frequency: "weekly"         # daily | weekly | monthly
  backup_retention_weeks: 12
```

## Integration Configuration (`config/integrations.yaml`)

```yaml
# Job board integrations (local tracking only)
job_boards:
  linkedin:
    profile_url: ""
    active: true
    notes: "Primary job board"

  indeed:
    active: false

  glassdoor:
    active: false
    notes: "Salary research only"

  wellfound:
    active: false
    notes: "Startup opportunities"

  levels_fyi:
    active: false
    notes: "Compensation data"

  blind:
    active: false
    notes: "Company insights"
```

## Automation Schedules (`config/schedules.yaml`)

```yaml
daily:
  morning_search:
    time: "08:00"
    skills:
      - job-search
    description: "Scan new job postings matching saved searches"
    enabled: true

  application_followup:
    time: "10:00"
    skills:
      - application-tracker
    description: "Check application statuses, flag follow-ups due"
    enabled: true

  evening_review:
    time: "20:00"
    skills:
      - analytics-summary
    description: "Daily job search activity summary"
    enabled: false

weekly:
  resume_refresh:
    day: "sunday"
    time: "19:00"
    skills:
      - resume-optimizer
    description: "Review and update resume for the week ahead"
    enabled: true

  market_analysis:
    day: "monday"
    time: "08:00"
    skills:
      - salary-research
      - market-analysis
    description: "Update salary benchmarks and market conditions"
    enabled: true

  interview_prep:
    day: "wednesday"
    time: "19:00"
    skills:
      - interview-prep
    description: "Prepare for upcoming interviews"
    enabled: true

  networking_outreach:
    day: "thursday"
    time: "12:00"
    skills:
      - networking-tracker
    description: "Send follow-up messages, schedule informational interviews"
    enabled: false

monthly:
  skills_assessment:
    schedule: "1st"
    time: "09:00"
    skills:
      - skills-gap-analysis
    description: "Re-evaluate skills against market demand"
    enabled: true

  workspace_maintenance:
    schedule: "15th"
    time: "09:00"
    tasks:
      - archive_old_applications
      - rotate_logs
      - backup
      - update_salary_data
    description: "System maintenance and data hygiene"
    enabled: true

  career_strategy_review:
    schedule: "1st"
    time: "10:00"
    description: "Review overall career strategy, adjust targets"
    enabled: false
```

## State File Schemas

### Application Pipeline (`state/applications/pipeline.json`)

```json
{
  "last_updated": "2026-04-01T12:00:00Z",
  "pipeline": {
    "applied": [
      {
        "id": "app_001",
        "company": "Google",
        "role": "Staff Software Engineer",
        "team": "Cloud Infrastructure",
        "applied_date": "2026-03-25",
        "source": "referral",
        "referrer": "Alex Kim",
        "priority": "high",
        "tags": ["dream_job", "referral"],
        "resume_version": "Jane_Doe_Staff_Engineer_2026-03-25.html",
        "cover_letter": true,
        "job_url": "https://careers.google.com/jobs/...",
        "salary_range": { "min": 250000, "max": 350000 },
        "next_action": "Wait for recruiter response",
        "next_action_date": "2026-04-01",
        "notes": "Referred by Alex from Cloud team"
      }
    ],
    "screening": [],
    "interviewing": [],
    "final_round": [],
    "offer": [],
    "rejected": [],
    "withdrawn": []
  },
  "stats": {
    "total_applications": 12,
    "response_rate": 0.42,
    "interview_conversion": 0.60,
    "offer_rate": 0.20,
    "active_applications": 5,
    "avg_days_to_response": 8.5,
    "best_source": "referral"
  }
}
```

### Resume History (`state/resume-optimizer/history.json`)

```json
{
  "last_updated": "2026-04-01T12:00:00Z",
  "versions": [
    {
      "id": "resume_001",
      "filename": "Jane_Doe_Staff_Engineer_2026-03-25.html",
      "target_role": "Staff Software Engineer",
      "target_company": "Google",
      "template": "silicon_valley_minimal",
      "generated_at": "2026-03-25T14:30:00Z",
      "ats_score": 92,
      "page_count": 2,
      "keywords_matched": 15,
      "keywords_total": 18
    }
  ],
  "generation_history": [
    {
      "timestamp": "2026-03-25T14:30:00Z",
      "skill": "sv-resume-optimizer",
      "duration_seconds": 45,
      "success": true
    }
  ],
  "ats_scores": {
    "resume_001": 92,
    "resume_002": 87
  }
}
```

### Job Search State (`state/job-search/searches.json`)

```json
{
  "last_updated": "2026-04-01T12:00:00Z",
  "saved_searches": [
    {
      "id": "search_001",
      "name": "Staff Engineer - SF Bay Area",
      "query": "Staff Software Engineer",
      "location": "San Francisco Bay Area",
      "remote": true,
      "salary_min": 200000,
      "filters": {
        "company_size": ["growth", "enterprise"],
        "industries": ["technology", "fintech"],
        "exclude_companies": ["current_employer"]
      },
      "created": "2026-03-15",
      "last_run": "2026-04-01T08:00:00Z",
      "results_count": 45
    }
  ],
  "saved_jobs": [
    {
      "id": "job_001",
      "title": "Staff Engineer, Payments",
      "company": "Stripe",
      "url": "https://stripe.com/jobs/...",
      "saved_date": "2026-03-28",
      "match_score": 0.88,
      "notes": "Great team, strong match",
      "status": "reviewing"
    }
  ],
  "applied_job_ids": ["job_003", "job_007"],
  "dismissed_job_ids": ["job_002", "job_005"],
  "search_stats": {
    "total_searches": 28,
    "jobs_reviewed": 156,
    "jobs_saved": 23,
    "jobs_applied": 12
  }
}
```

### Interview Prep Progress (`state/interview-prep/progress.json`)

```json
{
  "last_updated": "2026-04-01T12:00:00Z",
  "upcoming_interviews": [
    {
      "id": "interview_001",
      "company": "Google",
      "role": "Staff Engineer",
      "type": "phone_screen",
      "date": "2026-04-05T10:00:00Z",
      "interviewer": "Sarah Chen, Engineering Manager",
      "prep_status": "in_progress",
      "focus_areas": ["system_design", "leadership"],
      "prep_notes_path": "interview-prep/notes/google-phone-screen.md"
    }
  ],
  "completed_interviews": [
    {
      "id": "interview_000",
      "company": "Meta",
      "type": "onsite",
      "date": "2026-03-20",
      "outcome": "passed",
      "feedback": "Strong system design, improve coding speed",
      "lessons_learned": ["Practice timed coding more", "Draw diagrams earlier"]
    }
  ],
  "stories_prepared": 8,
  "technical_topics_reviewed": [
    "distributed_systems",
    "database_design",
    "api_design",
    "caching_strategies"
  ],
  "prep_hours_logged": 24.5
}
```

### Analytics Summary (`state/analytics/summary.json`)

```json
{
  "last_updated": "2026-04-01T12:00:00Z",
  "metrics": {
    "applications_sent": 12,
    "interviews_completed": 5,
    "offers_received": 1,
    "resumes_generated": 8,
    "cover_letters_written": 6,
    "avg_ats_score": 87.5,
    "hours_invested": 45
  },
  "weekly_stats": {
    "2026-W13": {
      "applications": 3,
      "interviews": 2,
      "hours_spent": 12,
      "new_jobs_saved": 8,
      "follow_ups_sent": 4
    },
    "2026-W12": {
      "applications": 4,
      "interviews": 1,
      "hours_spent": 10,
      "new_jobs_saved": 12,
      "follow_ups_sent": 3
    }
  },
  "funnel": {
    "jobs_found": 156,
    "jobs_saved": 23,
    "applications_sent": 12,
    "screenings": 5,
    "interviews": 3,
    "offers": 1
  },
  "sources": {
    "linkedin": { "applied": 5, "interviews": 2, "offers": 0 },
    "referral": { "applied": 4, "interviews": 2, "offers": 1 },
    "company_website": { "applied": 3, "interviews": 1, "offers": 0 }
  }
}
```

## Networking Contacts (`networking/contacts.json`)

```json
{
  "last_updated": "2026-04-01T12:00:00Z",
  "contacts": [
    {
      "id": "contact_001",
      "name": "Alex Kim",
      "title": "Senior Staff Engineer",
      "company": "Google",
      "category": "referral",
      "relationship": "Former colleague at StartupCo",
      "linkedin": "linkedin.com/in/alexkim",
      "email": "alex@example.com",
      "last_contact": "2026-03-20",
      "next_followup": "2026-04-15",
      "notes": "Can refer to Cloud Infrastructure team",
      "referrals_given": ["app_001"]
    }
  ],
  "categories": ["recruiter", "hiring_manager", "referral", "mentor", "peer"]
}
```

## Career Goals (`profile/career_goals.yaml`)

```yaml
target_roles:
  primary:
    - title: "Staff Software Engineer"
      level: "L6/E6"
      companies: ["Google", "Meta", "Stripe", "Netflix"]
  stretch:
    - title: "Engineering Manager"
      level: "M1"
      companies: ["Growth-stage startups"]

compensation:
  base_salary:
    min: 200000
    max: 280000
    currency: "USD"
  total_comp_target: 350000
  equity_preference: "rsu"          # rsu | options | both
  negotiation_priority:
    - base_salary
    - equity
    - signing_bonus
    - remote_flexibility

location:
  preferred:
    - "San Francisco, CA"
    - "Remote (US)"
  willing_to_relocate: false
  remote_preference: "hybrid"       # remote | hybrid | onsite

company_preferences:
  size: ["growth", "enterprise"]    # startup | growth | enterprise
  stage: ["series_c_plus", "public"]
  culture:
    - "engineering-driven"
    - "work-life balance"
    - "continuous learning"
  industries:
    preferred: ["technology", "fintech", "developer_tools"]
    avoid: ["defense", "gambling"]

deal_breakers:
  - "No remote option"
  - "Below $180k base"
  - "No equity"
  - "Mandatory return-to-office 5 days"

timeline:
  target_start_date: "2026-06-01"
  search_urgency: "active"          # passive | active | urgent
  notice_period_weeks: 2
```
