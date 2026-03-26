---
name: profile-setup
description: One-time comprehensive job seeker profile creation that captures professional data, career goals, preferences, and job search criteria. Use when users need to set up their jobseeking profile for the first time, update existing profile data, or when other skills need access to user profile information for personalization and automation.
---

# Profile Setup - Professional Data Capture

Create and manage your comprehensive job seeker profile that powers all jobseeking automation features. This is the foundation skill that enables personalized resume generation, job matching, and application assistance.

## Core Purpose

**One-time setup that eliminates repetitive data entry.** Instead of re-entering your information for every resume, job application, or search, this skill captures everything once and makes it available to all other jobseeking skills.

## What Gets Captured

### Personal Information
- Full name and professional title
- Contact information (email, phone, location)
- LinkedIn profile and portfolio URLs
- Location preferences and remote work flexibility

### Professional Profile
- Career summary and elevator pitch
- Core competencies and skill matrix
- Years of experience and seniority level
- Industry preferences and specializations

### Experience Timeline
- Work history with quantified achievements
- Key projects and their impact
- Leadership and team management experience
- Technical skills and tools used

### Education & Credentials
- Degrees, certifications, and courses
- Institution names and graduation dates
- Relevant coursework and academic achievements
- Professional development and training

### Job Search Preferences
- Target roles and job titles
- Salary expectations and negotiation priorities
- Company size and culture preferences
- Benefits and perks that matter most
- Deal-breakers and non-negotiables

### Application Settings
- Cover letter tone and style preferences
- Resume format and design choices
- Application follow-up preferences
- Interview scheduling availability

## 📁 Workspace Structure Created

During setup, I'll create an organized workspace with these directories:

### 📄 Resume_and_Core
- **Current/**: Active resume versions for applications
- **Archive/**: Previous versions and drafts
- **Variations/**: Role-specific customizations
- **Sources/**: Raw achievement data and materials

### 🚀 Projects
- Portfolio project documentation and case studies
- Technical write-ups with quantified impact
- Ready-to-use examples for resumes and interviews

### 📝 Role_Applications
- Application tracking spreadsheet
- Cover letters and follow-up communications
- Interview notes and feedback

### 🔍 Role_References
- **Company_Research/**: Target company analysis
- **Role_Analysis/**: Job role deep-dives
- **Industry_Trends/**: Market analysis
- **Salary_Data/**: Compensation benchmarks
- **Interview_Prep/**: Role-specific preparation

### 📊 Market_Analysis
- Industry reports and competitive intelligence
- Skills demand analysis
- Company intelligence gathering

### 📚 Research & 🗄️ Archive
- Technical research and career development
- Archived materials and completed applications

## Profile-Driven Workflow

Once your profile and workspace are complete, other skills automatically use this data:

- **Resume Optimizer**: Generates targeted resumes using your experience and achievements
- **Job Search**: Filters opportunities based on your preferences and qualifications
- **Cover Letter Generator**: Creates personalized cover letters using your background
- **Salary Research**: Benchmarks against your target roles and experience level
- **Interview Prep**: Customizes preparation based on your background and target roles
- **Apply Assist**: Orchestrates applications using your preferred materials and settings

## Implementation Instructions

When this skill is invoked, follow this step-by-step process:

### Step 1: Welcome and Overview
Greet the user and explain you'll set up their job seeker profile and organized workspace. This takes 10-15 minutes and eliminates future data re-entry.

### Step 2: Optional Document Upload (NEW)
Ask the user if they have existing professional documents to speed up the process:

**Resume Upload**: "Do you have a current resume (PDF) I can analyze to extract your experience and skills?"
- If yes: Ask them to provide the file path to their resume
- Use the Bash tool to run the document parser:
  ```bash
  cd skills/profile-setup/scripts
  python document_parser.py resume "/path/to/resume.pdf"
  ```
- Capture the JSON output and use it to pre-populate profile fields
- Validate extracted data with user and fill in missing details

**LinkedIn Profile**: "Do you have your LinkedIn profile exported or can you share your LinkedIn URL?"
- For LinkedIn export: Ask for the path to their LinkedIn data export
- Use the Bash tool to parse:
  ```bash
  python document_parser.py linkedin "/path/to/linkedin_data.json"
  ```
- For URL: Use Read tool to extract publicly available information
- Extract professional summary, experience, education, skills

**Auto-Population**: Use extracted data to pre-fill the profile structure, then confirm/edit with user rather than starting from scratch. Mark extracted fields for validation.

### Step 3: Confirm/Collect Personal Information
If documents were uploaded, confirm and fill gaps. Otherwise, collect:
- Full name and current job title
- Email, phone, and location
- LinkedIn profile URL (if they have one)
- Portfolio website or GitHub (if applicable)
- Remote work preferences

### Step 4: Confirm/Collect Professional Profile
If documents were uploaded, confirm and enhance. Otherwise, collect:
- Professional summary (2-3 sentences about their background)
- Years of experience and seniority level
- Core skills and specializations (technical and soft skills)
- Industry preferences
- Career goals and target roles

### Step 5: Confirm/Collect Work Experience
If resume was uploaded, validate extracted experience and add missing details:
- Company name, job title, dates
- Key responsibilities and achievements (ask for quantified results)
- Technologies/tools used
- Team size (if applicable)

### Step 6: Confirm/Collect Education and Certifications
If documents were uploaded, validate and complete:
- Degrees, institutions, graduation years
- Relevant certifications and courses
- Professional training

### Step 7: Collect Job Search Preferences
Always collect (not typically in resumes):
- Target roles and job titles
- Salary expectations (range)
- Preferred locations or remote preferences
- Company size preferences
- Deal-breakers and non-negotiables

### Step 8: Create Organized Workspace
Use the Bash tool to create a structured workspace directory:

```bash
# Create main workspace directory (suggest iCloud for sync)
WORKSPACE_PATH="$HOME/Library/Mobile Documents/com~apple~CloudDocs/jobseeking-workspace"
mkdir -p "$WORKSPACE_PATH"

# Create organized directory structure
mkdir -p "$WORKSPACE_PATH/Resume_and_Core/"{Current,Archive,Variations,Sources}
mkdir -p "$WORKSPACE_PATH/Projects"
mkdir -p "$WORKSPACE_PATH/Role_Applications"
mkdir -p "$WORKSPACE_PATH/Role_References/"{Company_Research,Role_Analysis,Industry_Trends,Salary_Data,Interview_Prep}
mkdir -p "$WORKSPACE_PATH/Market_Analysis/"{Industry_Reports,Salary_Research,Company_Intelligence,Skills_Gap_Analysis}
mkdir -p "$WORKSPACE_PATH/Research/"{Technical,Career_Development,Networking}
mkdir -p "$WORKSPACE_PATH/Archive/"{Old_Applications,Outdated_Resumes,Past_Research}

echo "✅ Workspace created with 65+ organized directories at: $WORKSPACE_PATH"
```

### Step 9: Save Profile Data
Use the Write tool to save all collected/confirmed information as a JSON file (including any data extracted from uploaded documents):

```json
{
  "personal": {
    "name": "[collected name]",
    "email": "[collected email]",
    "phone": "[collected phone]",
    "location": "[collected location]",
    "linkedin": "[collected linkedin]",
    "portfolio": "[collected portfolio]"
  },
  "professional": {
    "title": "[collected title]",
    "summary": "[collected summary]",
    "yearsExperience": "[collected years]",
    "level": "[collected level]",
    "industries": ["[collected industries]"],
    "specializations": ["[collected specializations]"],
    "careerGoals": "[collected goals]"
  },
  "experience": [
    {
      "company": "[company]",
      "title": "[title]",
      "startDate": "[start date]",
      "endDate": "[end date]",
      "achievements": ["[quantified achievements]"],
      "skills": ["[technologies used]"]
    }
  ],
  "education": [
    {
      "degree": "[degree]",
      "institution": "[institution]",
      "year": "[year]"
    }
  ],
  "preferences": {
    "targetRoles": ["[target roles]"],
    "salaryRange": {"min": 0, "max": 0},
    "locations": ["[preferred locations]"],
    "remote": "[remote preference]"
  },
  "metadata": {
    "created": "[current date]",
    "completeness": "[calculated percentage]",
    "workspace_path": "[workspace path]"
  }
}
```

Save this to both:
- `$WORKSPACE_PATH/profile_data.json` (for easy access)
- `$HOME/.claude-jobseeking/profile.json` (for plugin integration)

### Step 10: Create Workspace Templates
Use the Write tool to create helpful templates and README files in key directories.

### Step 11: Completion Summary
Provide a summary showing:
- Profile completeness percentage
- Workspace location and structure
- Next steps (using resume-optimizer)
- Quick tips for getting started

## Success Criteria
- User provides all required information
- Workspace directory structure is created successfully
- Profile data is saved in JSON format
- User understands next steps

When complete, the user should be ready to immediately use `/jobseeking-plugin:resume-optimizer` to generate their first targeted resume.

### Profile Updates
```
/jobseeking-plugin:profile-setup update

I'll help you update specific sections of your profile:
- Personal information changes
- New skills or certifications
- Recent work experience
- Updated job search criteria
- Changed salary expectations

What would you like to update?
```

### Profile Review & Workspace Management
```
/jobseeking-plugin:profile-setup review

I'll show you your current profile and workspace status:
- Profile completeness score and missing sections
- Recent updates and changes
- Workspace organization and file counts
- Profile optimization suggestions
- Skills that need your latest data
```

### Workspace Setup Only
```
/jobseeking-plugin:profile-setup workspace

Create or update just the workspace structure without profile changes:
- Set up organized directory structure
- Create templates and README files
- Initialize tracking spreadsheets
- Configure integration settings

Choose workspace location:
- iCloud Documents (default, syncs across devices)
- Local Documents folder
- Custom path you specify
```

## Profile Data Structure

Your profile is stored as structured data that other skills can access:

```json
{
  "personal": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "+1-555-0123",
    "location": "City, State",
    "linkedin": "linkedin.com/in/username",
    "portfolio": "portfolio.com"
  },
  "professional": {
    "title": "Senior Software Engineer",
    "summary": "Experienced full-stack developer...",
    "yearsExperience": 8,
    "industries": ["Technology", "Healthcare"],
    "specializations": ["React", "Node.js", "AWS"]
  },
  "experience": [
    {
      "company": "Tech Corp",
      "title": "Senior Developer",
      "duration": "2021-2024",
      "achievements": ["Improved app performance by 40%", "Led team of 5 developers"],
      "skills": ["React", "TypeScript", "AWS"]
    }
  ],
  "education": [
    {
      "degree": "BS Computer Science",
      "institution": "University Name",
      "year": 2016,
      "gpa": 3.8
    }
  ],
  "preferences": {
    "targetRoles": ["Senior Engineer", "Tech Lead"],
    "salaryRange": {"min": 120000, "max": 160000},
    "remote": true,
    "companySize": ["startup", "mid-size"],
    "benefits": ["equity", "flexible-schedule", "health-insurance"]
  },
  "settings": {
    "coverLetterStyle": "professional",
    "resumeFormat": "modern",
    "followUpCadence": "weekly"
  }
}
```

## Profile Completeness Scoring

Track your profile completeness to maximize effectiveness:

- **Personal Info (15%)**: Contact details and location preferences
- **Professional Summary (20%)**: Career goals and elevator pitch
- **Experience (25%)**: Work history with quantified achievements
- **Skills (15%)**: Technical and soft skills matrix
- **Education (10%)**: Degrees and certifications
- **Preferences (15%)**: Job search criteria and salary expectations

**Goal**: Achieve 90%+ completeness for optimal automation results.

## 🔄 Integrated Workflow Benefits

### Automated Organization
- **Resume Generation**: Automatically saves to `Resume_and_Core/Current/`
- **Application Tracking**: Templates ready in `Role_Applications/`
- **Research Storage**: Structured folders for all your research
- **Archive Management**: Automatic organization of old materials

### Cross-Device Sync
- **iCloud Integration**: Workspace syncs across Mac, iPhone, iPad
- **Version Control**: Track changes across all your job search documents
- **Mobile Access**: Review applications and research on mobile devices
- **Backup**: Automatic cloud backup of all materials

### Time Savings
- **No Setup Friction**: Start new applications immediately with templates
- **Consistent Organization**: Find any document in seconds
- **Template Reuse**: Standard formats for all application materials
- **Progress Tracking**: Visual progress on applications and research

## Privacy & Security

- Profile data stored locally in encrypted format
- Workspace files stored in your chosen location (iCloud/local)
- No data shared without explicit user consent
- Easy profile export and deletion options
- Granular privacy controls per data section

## Integration with Premium Features

- **Profile Completeness**: Unlock premium features at 80%+ completeness
- **Smart Matching**: AI job recommendations based on your full profile
- **Auto-Applications**: Automated application submission using your preferences
- **Market Intelligence**: Salary benchmarking and trend analysis for your profile

## Getting Started

Run `/jobseeking-plugin:profile-setup` to begin your one-time profile creation. The process takes 10-15 minutes but saves hours on every future job application.

Your profile becomes the foundation for intelligent, personalized job search automation.