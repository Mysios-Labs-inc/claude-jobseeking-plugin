# Enhanced Profile Setup with Document Upload

## Example: Onboarding with Resume Upload

### User Experience Flow

**Before Enhancement:**
1. User runs `/jobseeking-plugin:profile-setup`
2. Manually enters 30+ data fields
3. Takes 15-20 minutes of typing
4. Risk of typos and missed information

**After Enhancement:**
1. User runs `/jobseeking-plugin:profile-setup`
2. "I have my latest resume" → uploads PDF
3. Claude extracts and pre-fills 70% of profile data
4. User confirms/edits in 5-10 minutes
5. Faster, more accurate onboarding

### Technical Implementation

```bash
# Claude runs automatically when user provides resume path
cd skills/profile-setup/scripts
python document_parser.py resume "/Users/oscar/Documents/Oscar_Rivas_Resume.pdf"

# Returns pre-filled JSON:
{
  "personal": {
    "name": "Oscar Rivas",
    "email": "oscar@example.com",
    "phone": "+1-555-123-4567",
    "linkedin": "https://linkedin.com/in/oscar-rivas"
  },
  "professional": {
    "title": "Senior Software Engineer",
    "summary": "Experienced full-stack developer...",
    "yearsExperience": 8,
    "specializations": ["React", "Node.js", "Python", "AWS"]
  },
  "experience": [
    {
      "company": "TechCorp",
      "title": "Senior Software Engineer",
      "duration": "2021-2024",
      "achievements": ["Built scalable microservices", "Led team of 5"],
      "skills": ["React", "Node.js", "Docker"]
    }
  ],
  "education": [
    {
      "degree": "BS Computer Science",
      "institution": "University Name",
      "year": "2016"
    }
  ]
}
```

### Validation Prompts

Instead of asking from scratch:
- ❌ "What's your name?"
- ✅ "I extracted your name as 'Oscar Rivas' - is this correct?"

Instead of starting empty:
- ❌ "Tell me about your work experience"
- ✅ "I found 3 roles in your resume. Let me confirm the details for TechCorp (2021-2024)..."

### Benefits

1. **Faster Onboarding**: 15 minutes → 5-8 minutes
2. **Higher Accuracy**: No typing errors from manual entry
3. **Better Data Quality**: Extracts structured information from professional documents
4. **Reduced Friction**: Users already have these documents ready
5. **Professional Impression**: Shows AI sophistication and user-centric design

### Fallback Behavior

- If no documents provided → Original manual flow
- If extraction fails → Fall back to manual with error message
- If partial extraction → Pre-fill what's available, manual for gaps

## LinkedIn Integration Example

```bash
# For LinkedIn URL
"Can you share your LinkedIn profile URL so I can gather your professional details?"
# Claude uses web search to extract public profile information

# For LinkedIn export
"Do you have a LinkedIn data export? (Download from LinkedIn Settings)"
python document_parser.py linkedin "/path/to/linkedin_export.json"
```

### Data Extraction Capabilities

**From PDF Resume:**
- Personal info (name, email, phone, LinkedIn)
- Work experience (companies, titles, dates, descriptions)
- Education (degrees, schools, graduation years)
- Skills and technologies
- Certifications

**From LinkedIn Profile:**
- Professional headline and summary
- Complete work history with descriptions
- Education details
- Skills and endorsements
- Connections (for networking insights)

### Security & Privacy

- Documents processed locally only
- No data sent to external services
- Extracted data encrypted with user's profile
- Original documents not stored (user retains)
- User must explicitly provide file paths

### Next Steps

This enhancement can be extended to:
1. **Cover Letter Upload**: Extract writing style and key accomplishments
2. **Portfolio Integration**: Parse GitHub/portfolio projects
3. **Reference Documents**: Extract contact information for references
4. **Job Posting Analysis**: Parse job requirements from saved job postings

The goal is to eliminate manual data entry entirely by leveraging documents users already have prepared for job searching.