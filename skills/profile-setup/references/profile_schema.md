# Profile Data Schema Reference

Complete schema definition for user profile data structure used by all jobseeking skills.

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
  "metadata": { /* System information */ }
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

## Migration & Versioning

Schema changes require version bumps and migration scripts:

- **v1.0**: Initial schema
- **v1.1**: Added skills.interest field
- **v1.2**: Added preferences.priorityOrder array

Migration scripts in `scripts/migrations/` handle version updates automatically.