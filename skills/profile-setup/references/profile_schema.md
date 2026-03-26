# Profile Data Schema Reference v1.2.0

Complete schema definition for user profile data structure used by all jobseeking skills, including AI intelligence enhancements in v1.2.0.

## Schema Overview

```json
{
  "personal": { /* Contact and location information */ },
  "professional": { /* Career summary and goals */ },
  "experience": [ /* Work history array */ ],
  "skills": [ /* Skills and competencies array */ ],
  "education": [ /* Education and certifications array */ ],
  "preferences": { /* Job search criteria */ },
  "settings": { /* Application preferences */ },
  "metadata": { /* System information */ },
  "ai_intelligence": { /* AI-powered profile enhancements (v1.2.0) */ },
  "intelligence_metadata": { /* AI analysis metadata (v1.2.0) */ }
}
```

## Detailed Schema Definitions

### Personal Information

```json
{
  "personal": {
    "name": "string (required) - Full legal name",
    "email": "string (required) - Primary email address",
    "phone": "string (required) - Phone number with country code",
    "location": "string (required) - Current city, state/country",
    "linkedin": "string (optional) - LinkedIn profile URL",
    "portfolio": "string (optional) - Portfolio or personal website",
    "github": "string (optional) - GitHub profile URL",
    "remote": "boolean - Willing to work remotely",
    "relocate": "boolean - Willing to relocate",
    "visa": "string - Visa status if applicable",
    "availability": "string - Notice period or availability date"
  }
}
```

### Professional Profile

```json
{
  "professional": {
    "title": "string (required) - Current or target job title",
    "summary": "string (required) - Professional summary/elevator pitch",
    "yearsExperience": "number (required) - Total years of experience",
    "level": "enum - junior|mid|senior|lead|executive",
    "industries": "array - Preferred industries",
    "specializations": "array - Core areas of expertise",
    "careerGoals": "string - Long-term career objectives",
    "workStyle": "enum - individual|collaborative|leadership",
    "managementExperience": "number - Years managing teams"
  }
}
```

### Experience History

```json
{
  "experience": [
    {
      "company": "string (required) - Company name",
      "title": "string (required) - Job title",
      "startDate": "string - YYYY-MM format",
      "endDate": "string - YYYY-MM or 'present'",
      "location": "string - Work location",
      "type": "enum - full-time|part-time|contract|freelance|internship",
      "description": "string - Role description",
      "achievements": "array - Quantified accomplishments",
      "skills": "array - Technologies/skills used",
      "teamSize": "number - Team members managed",
      "budget": "number - Budget managed",
      "promoted": "boolean - Whether promoted in this role"
    }
  ]
}
```

### Skills Matrix

```json
{
  "skills": [
    {
      "name": "string (required) - Skill name",
      "category": "enum - technical|soft|language|certification|tool",
      "level": "enum - beginner|intermediate|advanced|expert",
      "yearsUsed": "number - Years of experience",
      "lastUsed": "string - YYYY-MM format",
      "certified": "boolean - Whether certified",
      "interest": "number - Interest level 1-10"
    }
  ]
}
```

### Education & Certifications

```json
{
  "education": [
    {
      "type": "enum - degree|certification|course|bootcamp",
      "name": "string (required) - Degree/certification name",
      "institution": "string (required) - School/organization",
      "field": "string - Field of study",
      "year": "number - Graduation year",
      "gpa": "number - GPA if applicable",
      "honors": "string - Honors or distinctions",
      "relevant": "boolean - Relevant to target roles",
      "credentialId": "string - Certification ID",
      "expirationDate": "string - If applicable",
      "url": "string - Verification URL"
    }
  ]
}
```

### Job Search Preferences

```json
{
  "preferences": {
    "targetRoles": "array (required) - Desired job titles",
    "salaryRange": {
      "min": "number (required) - Minimum acceptable salary",
      "max": "number (required) - Target salary",
      "currency": "string - Currency code (USD, EUR, etc.)"
    },
    "locations": "array - Preferred locations",
    "remote": "enum - no|hybrid|full",
    "companySize": "array - startup|small|mid-size|large|enterprise",
    "industries": "array - Preferred industries",
    "companyStage": "array - startup|growth|established",
    "benefits": "array - Important benefits/perks",
    "dealBreakers": "array - Absolute no-gos",
    "workSchedule": "enum - standard|flexible|night|weekend",
    "travelRequirement": "enum - none|minimal|moderate|frequent",
    "priorityOrder": "array - Order of importance for job factors"
  }
}
```

### Application Settings

```json
{
  "settings": {
    "coverLetterStyle": "enum - professional|conversational|creative",
    "resumeFormat": "enum - modern|classic|creative|ats-optimized",
    "followUpCadence": "enum - none|weekly|biweekly|monthly",
    "applicationTracking": "boolean - Enable tracking",
    "autoRespond": "boolean - Auto-respond to recruiters",
    "privacyLevel": "enum - public|private|limited",
    "notificationPrefs": {
      "newJobs": "boolean",
      "applications": "boolean",
      "interviews": "boolean",
      "salary": "boolean"
    },
    "customFields": "object - User-defined fields"
  }
}
```

### System Metadata

```json
{
  "metadata": {
    "created": "string - ISO date profile created",
    "lastUpdated": "string - ISO date last modified",
    "version": "string - Schema version",
    "completeness": "number - Calculated completeness percentage",
    "lastBackup": "string - Last backup date",
    "source": "string - How profile was created"
  }
}
```

## Validation Rules

### Required Fields
- `personal.name`, `personal.email`, `personal.phone`, `personal.location`
- `professional.title`, `professional.summary`, `professional.yearsExperience`
- `preferences.targetRoles`, `preferences.salaryRange`

### Data Type Validation
- **Email**: Must match email regex pattern
- **Phone**: Must include country code, numbers and dashes only
- **URLs**: Must be valid HTTP/HTTPS URLs
- **Dates**: YYYY-MM format or 'present' for current positions
- **Numbers**: Non-negative integers for experience years, salaries
- **Enums**: Must match allowed values exactly

### Business Logic Validation
- Experience start dates must be before end dates
- Years of experience should align with work history
- Salary min must be less than salary max
- Skills last used date cannot be in the future
- Education years should be realistic (not future dates)

### Completeness Scoring
- **Personal Info (15%)**: 4 required fields filled
- **Professional (20%)**: 3 required fields + 2 optional
- **Experience (25%)**: At least 1 complete work experience
- **Skills (15%)**: At least 5 relevant skills listed
- **Education (10%)**: At least 1 education entry
- **Preferences (15%)**: Target roles and salary range set

**Target**: 90%+ completeness for premium features

## Usage Patterns

### Profile Loading
```python
from scripts.profile_manager import ProfileManager
manager = ProfileManager()
profile = manager.load_profile()

# Access sections
personal = profile.get('personal', {})
experience = profile.get('experience', [])
preferences = profile.get('preferences', {})
```

### Section Updates
```python
# Update specific sections
manager.update_profile_section('personal', {
    'phone': '+1-555-0123',
    'location': 'Austin, TX'
})

# Add new experience
new_job = {
    'company': 'Tech Corp',
    'title': 'Senior Developer',
    'startDate': '2024-01',
    'endDate': 'present',
    # ... other fields
}
experience = profile.get('experience', [])
experience.append(new_job)
manager.update_profile_section('experience', experience)
```

### Skill Integration
Other skills should load profile data to personalize their functionality:

```python
# In resume-optimizer skill
profile = ProfileManager().load_profile()
if profile:
    personal = profile['personal']
    experience = profile['experience']
    skills = profile['skills']
    # Use data to generate personalized resume
```

## AI Intelligence Extensions (v1.2.0)

### AI Intelligence Root Object

```json
{
  "ai_intelligence": {
    "skills_gap_analysis": { /* Skills gap analysis results */ },
    "enhanced_achievements": { /* AI-enhanced achievement descriptions */ },
    "industry_optimization": { /* Industry-specific profile optimization */ },
    "ats_compatibility": { /* ATS compatibility scoring and recommendations */ },
    "github_integration": { /* GitHub profile analysis (optional) */ },
    "market_analysis": { /* Market intelligence and positioning */ }
  }
}
```

### Skills Gap Analysis

```json
{
  "skills_gap_analysis": {
    "analysis_type": "job_specific|market_general",
    "skills_score": "number (0-100) - Overall skills competitiveness",
    "match_percentage": "number (0-100) - Job requirements match",
    "market_readiness": "excellent|strong|good|developing|needs_improvement",
    "gaps_identified": [
      {
        "skill": "string - Skill name",
        "gap_type": "critical_missing|nice_to_have|skill_level",
        "job_frequency": "number (0-100) - Market demand percentage",
        "priority": "high|medium|low",
        "recommendation": "string - Learning recommendation",
        "learning_resources": ["string - URLs to learning materials"]
      }
    ],
    "strong_skills": ["string - User's strongest market-relevant skills"],
    "analysis_timestamp": "string - ISO date of analysis"
  }
}
```

### Enhanced Achievements

```json
{
  "enhanced_achievements": {
    "enhanced_count": "number - Number of achievements enhanced",
    "unquantified_count": "number - Achievements needing quantification",
    "overall_achievement_score": "number (0-100) - Achievement quality score",
    "suggestions": [
      {
        "original": "string - Original achievement text",
        "enhanced": "string - AI-enhanced version with metrics",
        "metrics_added": ["percentage|absolute|timeframe|scale"],
        "confidence": "number (0-1) - AI confidence in enhancement",
        "achievement_type": "performance|leadership|technical|business"
      }
    ]
  }
}
```

### Industry Optimization

```json
{
  "industry_optimization": {
    "target_industry": "string - Primary target industry",
    "keyword_optimization_score": "number (0-100)",
    "industry_alignment": "excellent|strong|good|weak",
    "recommended_keywords": ["string - Industry-specific keywords"],
    "competitive_keywords": {
      "high_impact": ["string - Critical industry keywords"],
      "emerging": ["string - Trending keywords"]
    },
    "industry_trends": {
      "growing_skills": ["string - Skills in high demand"],
      "declining_skills": ["string - Skills losing relevance"]
    }
  }
}
```

### ATS Compatibility

```json
{
  "ats_compatibility": {
    "compatibility_score": "number (0-100) - Overall ATS compatibility",
    "format_score": "number (0-100) - Resume format compatibility",
    "keyword_score": "number (0-100) - Keyword optimization score",
    "structure_score": "number (0-100) - Section structure score",
    "issues_found": [
      {
        "issue_type": "formatting|keywords|structure|content",
        "severity": "critical|warning|suggestion",
        "description": "string - Issue description",
        "recommendation": "string - How to fix"
      }
    ],
    "ats_optimization_suggestions": [
      {
        "category": "string - Optimization category",
        "priority": "high|medium|low",
        "action": "string - Specific action to take",
        "expected_improvement": "number - Expected score improvement"
      }
    ]
  }
}
```

### GitHub Integration

```json
{
  "github_integration": {
    "username": "string - GitHub username",
    "profile_analyzed": "boolean - Whether profile was analyzed",
    "contribution_score": "number (0-10) - Overall contribution quality",
    "activity_level": "high|medium|low - Contribution frequency",
    "repositories_analyzed": "number - Number of repos analyzed",
    "top_languages": ["string - Most used programming languages"],
    "projects_found": [
      {
        "name": "string - Repository name",
        "description": "string - Project description",
        "languages": ["string - Programming languages used"],
        "stars": "number - GitHub stars",
        "contribution_level": "primary_author|major_contributor|contributor",
        "project_type": "web_app|library|tool|data_science|mobile",
        "estimated_impact": "high|medium|low"
      }
    ],
    "skills_extracted": ["string - Skills inferred from code"],
    "professional_indicators": {
      "consistent_activity": "boolean - Regular contribution pattern",
      "collaborative_projects": "number - Projects with multiple contributors",
      "documentation_quality": "high|medium|low - README and docs quality"
    }
  }
}
```

### Market Analysis

```json
{
  "market_analysis": {
    "salary_benchmark": {
      "market_median": "number - Market median salary",
      "user_target": "number - User's target salary",
      "competitiveness": "above_market|at_market|below_market",
      "salary_range_analysis": {
        "percentile_25": "number",
        "percentile_75": "number",
        "user_target_percentile": "number"
      }
    },
    "skills_demand": {
      "high_demand": ["string - Skills in high market demand"],
      "emerging": ["string - Emerging skills with growth potential"],
      "declining": ["string - Skills losing market relevance"]
    },
    "career_progression": {
      "current_level": "string - Current career level",
      "next_level": "string - Next logical career step",
      "timeline_estimate": "string - Estimated timeline for advancement",
      "recommended_actions": ["string - Actions to advance career"],
      "skill_gaps_for_advancement": ["string - Skills needed for next level"]
    },
    "market_positioning": {
      "competitive_strength": "high|medium|low - Market competitiveness",
      "unique_value_props": ["string - Differentiating factors"],
      "areas_for_differentiation": ["string - Opportunities to stand out"]
    }
  }
}
```

### Intelligence Metadata

```json
{
  "intelligence_metadata": {
    "last_analysis": "string - ISO date of last AI analysis",
    "analysis_version": "string - AI intelligence version (1.2.0)",
    "features_enabled": ["skills_gap|achievements|industry_opt|ats|github|market"],
    "confidence_scores": {
      "skills_analysis": "number (0-1) - Confidence in skills analysis",
      "achievement_enhancement": "number (0-1) - Confidence in achievements",
      "market_analysis": "number (0-1) - Confidence in market data",
      "overall_intelligence": "number (0-1) - Overall analysis confidence"
    },
    "next_analysis_due": "string - ISO date when next analysis recommended",
    "data_sources": ["string - Sources used for analysis"]
  }
}
```

## Enhanced Completeness Scoring (v1.2.0)

### Base Profile Completeness (100%)
- **Personal Info (15%)**: Contact details and location
- **Professional (20%)**: Career summary and specializations
- **Experience (25%)**: Work history with achievements
- **Skills (15%)**: Skills matrix and competencies
- **Education (10%)**: Educational background
- **Preferences (15%)**: Job search criteria and targets

### AI Intelligence Completeness (30% bonus)
- **Skills Gap Analysis (10%)**: Market-driven skills assessment
- **Enhanced Achievements (8%)**: Quantified accomplishments
- **Industry Optimization (7%)**: Industry-specific optimization
- **ATS Compatibility (5%)**: Resume optimization for ATS systems
- **Market Analysis (5%)**: Salary and career progression insights
- **GitHub Integration (3%)**: Technical portfolio analysis (optional)

**Maximum Score**: 130% (100% base + 30% AI intelligence)
**Excellence Threshold**: 120%+

## Migration & Versioning

Schema changes require version bumps and migration scripts:

- **v1.0**: Initial schema with core profile structure
- **v1.1**: Added skills.interest field and enhanced preferences
- **v1.2**: Added AI intelligence extensions and enhanced completeness scoring

### v1.2.0 Migration Script

```python
def migrate_profile_to_v1_2_0(profile):
    """Migrate profile from v1.1.x to v1.2.0 with AI intelligence."""

    # Add AI intelligence structure if missing
    if 'ai_intelligence' not in profile:
        profile['ai_intelligence'] = {}

    # Add intelligence metadata
    if 'intelligence_metadata' not in profile:
        profile['intelligence_metadata'] = {
            'last_analysis': None,
            'analysis_version': '1.2.0',
            'features_enabled': [],
            'confidence_scores': {},
            'next_analysis_due': None
        }

    # Update schema version
    profile['metadata']['version'] = '1.2.0'

    return profile
```

Migration scripts in `scripts/migrations/` handle version updates automatically.