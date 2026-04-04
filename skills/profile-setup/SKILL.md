---
name: profile-setup
description: Interactive job seeker profile creation with guided workflows, multiple choice options, and smart branching. Captures professional data, career goals, and preferences through engaging decision trees that adapt to user needs and experience levels.
---

# Profile Setup - Interactive Professional Data Capture

Create your comprehensive job seeker profile through an engaging, interactive experience with guided questions, smart choices, and personalized workflows that adapt to your career stage and goals.

## 🎯 Interactive Setup Experience

### **Welcome & Goal Setting**
When users run `/profile-setup`, start with:

```
🎯 Career Intelligence Profile Setup (8-12 minutes)

What brings you here today?
a) Starting active job search
b) Career transition/pivot planning  
c) General career development
d) Specific opportunity preparation

Your selection customizes the entire setup experience!
```

### **Career Stage Detection** 
```
📊 Let's understand your experience level:

1. **Current career stage?**
   a) Recent graduate (0-2 years experience)
   b) Early career professional (2-5 years)
   c) Mid-level professional (5-10 years)  
   d) Senior professional (10-15 years)
   e) Executive/leadership (15+ years)

2. **Career path trajectory?**
   a) Steady progression in same field
   b) Recent career change/pivot
   c) Returning after gap (parental leave, education, etc.)
   d) Significant role/industry transition

Progress: ████░░░░░ Step 1 of 6 complete
```

### **Industry & Role Targeting**
```
🏢 Industry and Role Focus:

1. **Primary industry experience?** (Select top 2)
   □ Technology/Software
   □ Healthcare/Biotech  
   □ Financial Services
   □ Consulting/Professional Services
   □ Manufacturing/Industrial
   □ Education/Research
   □ Government/Non-profit
   □ Other: ___________

2. **Target role types?** (Select all that apply)
   □ Individual contributor (IC)
   □ Technical lead/Senior IC
   □ People manager
   □ Director/VP
   □ C-suite/Executive
   □ Founder/Entrepreneur

Based on your selections, I'll customize the skill depth questions.

Progress: ████████░ Step 2 of 6 complete
```

### **Technical Depth & Skills** (Adaptive based on previous choices)
```
💻 Technical Profile:

1. **Technical involvement level?**
   a) Highly technical (hands-on coding, engineering)
   b) Technical management (oversee technical teams)
   c) Technical business (PM, sales engineering, etc.)  
   d) Business-focused (minimal technical requirements)

2. **AI/ML experience?** (Given current market focus)
   a) No direct experience
   b) Basic understanding/user of AI tools
   c) Product management of AI features
   d) Technical implementation of AI/ML
   e) AI/ML research or specialized expertise

3. **Years in current specialization?**
   [Enter number: ____] years

Progress: ████████████░ Step 3 of 6 complete
```

### **Work Preferences & Constraints**
```
⚖️ Work Style and Constraints:

1. **Location preferences?**
   a) Specific city: ____________
   b) Remote-first required
   c) Hybrid (2-3 days office)
   d) Flexible/willing to relocate

2. **Company size preferences?** (Rank 1-4, 1 = most preferred)
   ___ Startup (0-50 employees)
   ___ Scale-up (50-500 employees)  
   ___ Mid-size (500-5,000 employees)
   ___ Large enterprise (5,000+ employees)

3. **Timeline urgency?**
   a) Actively interviewing (need materials ASAP)
   b) Active search (applying regularly)
   c) Passively exploring (quality opportunities only)
   d) Future planning (6+ months timeline)

Progress: ████████████████░ Step 4 of 6 complete
```

### **Experience Deep-Dive** (Questions adapt based on career stage)
```
📈 Experience Details:

[For Senior+ Professionals:]
1. **Leadership experience?**
   a) Individual contributor throughout
   b) Team lead (2-5 people)
   c) Manager (5-15 people)
   d) Director+ (15+ people)

2. **P&L responsibility?**
   a) No budget responsibility
   b) Project budgets ($10K-$100K)
   c) Department budgets ($100K-$1M+)

[For Technical Roles:]
1. **Technical scope?**
   a) Individual features/components
   b) Full product/system ownership
   c) Platform/infrastructure
   d) Multi-system architecture

Progress: ████████████████████░ Step 5 of 6 complete
```

### **Communication Style Preferences**
```
📝 Resume and Communication Style:

1. **Content emphasis?**
   a) Technical depth and implementation details
   b) Business impact and results focus  
   c) Leadership and team achievements
   d) Balanced technical + business approach

2. **Achievement highlighting style?**
   a) Quantified metrics and data focus
   b) Narrative impact stories
   c) Technical accomplishment details
   d) Strategic business outcomes

3. **Professional tone?**
   a) Conservative/traditional
   b) Modern professional
   c) Creative/innovative
   d) Industry-specific

Progress: ████████████████████████ Step 6 of 6 complete
```

## 🚀 Smart Workflow Features

### **Branching Logic**
- **Recent Graduates**: Focus on education, projects, internships, skill development
- **Career Changers**: Emphasize transferable skills, motivation, learning agility
- **Senior Professionals**: Leadership impact, strategic decisions, P&L responsibility
- **Technical Roles**: Technical depth, system ownership, innovation examples

### **Smart Defaults**
- Auto-detect from uploaded resume if available
- Use existing profile data to prefill choices
- Suggest industry-standard ranges for salary expectations
- Recommend skills based on role and industry selections

### **Progress Tracking**
```
Profile Setup Progress:
████████████░░░░░ 75% Complete

✓ Career Stage & Goals (2 min)
✓ Industry & Role Focus (3 min)  
✓ Technical & Skills Profile (2 min)
▶ Work Preferences (1 min remaining)
□ Experience Details (2 min)
□ Communication Style (1 min)

[Save Progress] [Skip Section] [Back] [Continue]
```

### **Validation & Confirmation**
```
✅ Profile Setup Complete!

📊 Your Profile Summary:
- Career Stage: Mid-level Professional (7 years)
- Industry Focus: Technology, Healthcare
- Role Target: Senior Product Manager
- Location: Remote-first, SF Bay Area
- Timeline: Active search (3-month goal)
- Style: Business impact with technical credibility

🎯 Personalized Recommendations Ready:
- Resume Template: Technical Product Manager (Modern)
- Cover Letter Style: Business impact with technical depth
- Interview Prep Focus: Product strategy + technical competency
- Job Search: 15 target companies identified

Does this look accurate?
[Confirm & Continue] [Modify Sections] [Start Over]
```

## 📋 Implementation Workflow

When users run `/profile-setup`:

1. **Welcome Screen**: Goal setting and timeline
2. **Career Stage**: Adaptive questioning based on experience level  
3. **Industry Focus**: Multi-select with industry-specific follow-ups
4. **Technical Depth**: Role-appropriate technical assessment
5. **Work Preferences**: Location, company, urgency preferences
6. **Experience Details**: Adaptive to career stage and role type
7. **Communication Style**: Content and tone preferences
8. **Validation**: Summary with modification options
9. **Next Steps**: Direct integration with other skills

## 🎯 Next Step Integration
```
Ready to use your profile?
[Generate Resume] [Set up Job Search] [Create Cover Letter] [Interview Prep]

Or continue customizing:
[Upload Resume] [Add Projects] [Import LinkedIn] [Salary Research]
```

This interactive approach transforms a tedious form-filling exercise into an engaging, personalized setup experience that users actually enjoy completing!
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

### Step 2: Smart Document Upload (v1.1.1 ENHANCED)
Offer intelligent file detection and upload assistance to dramatically speed up profile creation:

**Phase 1: Smart File Detection**
- Use file upload assistant to automatically find relevant files:
  ```bash
  cd skills/profile-setup/scripts
  python file_upload_assistant.py suggest
  ```
- Present top 5 file suggestions with confidence scores and reasons
- Ask user: "I found these professional documents on your computer. Would you like me to analyze any of them?"

**Phase 2: Enhanced Document Processing**

**Resume Upload (Enhanced)**:
- If user selects resume or provides path, validate first:
  ```bash
  python file_upload_assistant.py validate "/path/to/resume.pdf" resume
  ```
- Use enhanced parser with confidence scoring:
  ```bash
  python enhanced_document_parser.py resume "/path/to/resume.pdf"
  ```
- Display extraction report with confidence percentage and data quality assessment
- Show what was found: "✅ Found: Name, email, phone, 3 jobs, 2 degrees, 15 skills (85% confidence)"

**LinkedIn Profile Upload (Enhanced)**:
- Support multiple LinkedIn data formats (JSON export, CSV, text)
- Validate file before processing:
  ```bash
  python file_upload_assistant.py validate "/path/to/linkedin.json" linkedin
  ```
- Enhanced extraction with metadata:
  ```bash
  python enhanced_document_parser.py linkedin "/path/to/linkedin.json"
  ```
- Show comprehensive extraction report

**Phase 3: Intelligent Validation & Enhancement**
- Present extracted data in organized sections with confidence indicators
- Highlight fields needing validation: "⚠️ Please confirm: Current job title"
- Allow inline editing: "Would you like to update or add anything to [section]?"
- Show completion percentage: "Profile is 78% complete. Missing: target salary, preferred locations"

**Phase 4: Quality Assurance**
- Generate data quality report showing extraction confidence
- Identify any inconsistencies or missing critical information
- Offer suggestions: "I noticed you have React experience but it's not in your skills list. Should I add it?"

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