#!/usr/bin/env python3
"""
Profile-Driven Resume Generator
Automatically generates ATS-optimized resumes using stored profile data
"""

import sys
import os
import json
from datetime import datetime

# Add profile manager to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'profile-setup', 'scripts'))
from profile_manager import ProfileManager

class ProfileResumeGenerator:
    def __init__(self):
        self.profile_manager = ProfileManager()
        self.profile = self.profile_manager.load_profile()

    def generate_resume(self, job_posting=None, format_type="modern", target_role=None):
        """Generate a personalized resume from profile data"""
        if not self.profile:
            return {
                'error': 'No profile found. Please run /profile-setup first.',
                'suggestion': 'Create your profile with the profile-setup skill'
            }

        # Determine target role
        if not target_role:
            target_roles = self.profile.get('preferences', {}).get('targetRoles', [])
            target_role = target_roles[0] if target_roles else self.profile.get('professional', {}).get('title', '')

        # Generate resume sections
        resume = {
            'header': self._generate_header(),
            'summary': self._generate_summary(target_role),
            'experience': self._generate_experience(job_posting),
            'skills': self._generate_skills(job_posting),
            'education': self._generate_education(),
            'metadata': {
                'targetRole': target_role,
                'format': format_type,
                'generated': datetime.now().isoformat(),
                'optimizedFor': 'ATS + Human readable'
            }
        }

        return resume

    def _generate_header(self):
        """Generate resume header from profile personal data"""
        personal = self.profile.get('personal', {})

        header = {
            'name': personal.get('name', ''),
            'email': personal.get('email', ''),
            'phone': personal.get('phone', ''),
            'location': personal.get('location', ''),
            'linkedin': personal.get('linkedin', ''),
            'portfolio': personal.get('portfolio', ''),
            'github': personal.get('github', '')
        }

        # Clean up empty fields
        return {k: v for k, v in header.items() if v}

    def _generate_summary(self, target_role):
        """Generate professional summary optimized for target role"""
        professional = self.profile.get('professional', {})
        preferences = self.profile.get('preferences', {})

        base_summary = professional.get('summary', '')
        years_exp = professional.get('yearsExperience', 0)
        specializations = professional.get('specializations', [])
        industries = preferences.get('industries', [])

        # Create targeted summary
        summary = {
            'professional': base_summary,
            'yearsExperience': years_exp,
            'coreCompetencies': specializations[:5],  # Top 5 skills
            'industries': industries[:3],  # Top 3 industries
            'targetRole': target_role,
            'careerGoals': professional.get('careerGoals', '')
        }

        return summary

    def _generate_experience(self, job_posting=None):
        """Generate experience section with optimized achievements"""
        experience_list = self.profile.get('experience', [])

        formatted_experience = []

        for exp in experience_list:
            formatted_exp = {
                'company': exp.get('company', ''),
                'title': exp.get('title', ''),
                'duration': self._format_duration(exp.get('startDate'), exp.get('endDate')),
                'location': exp.get('location', ''),
                'achievements': exp.get('achievements', []),
                'skills': exp.get('skills', []),
                'quantified': self._extract_quantified_achievements(exp.get('achievements', [])),
                'keywords': self._extract_keywords_for_job(exp, job_posting)
            }
            formatted_experience.append(formatted_exp)

        # Sort by recency (most recent first)
        formatted_experience.sort(key=lambda x: x.get('duration', ''), reverse=True)

        return formatted_experience

    def _generate_skills(self, job_posting=None):
        """Generate skills section optimized for job requirements"""
        skills_list = self.profile.get('skills', [])

        # Categorize skills
        skills_by_category = {
            'technical': [],
            'soft': [],
            'language': [],
            'certification': [],
            'tool': []
        }

        for skill in skills_list:
            category = skill.get('category', 'technical')
            skill_data = {
                'name': skill.get('name', ''),
                'level': skill.get('level', 'intermediate'),
                'yearsUsed': skill.get('yearsUsed', 0),
                'certified': skill.get('certified', False),
                'relevance': self._calculate_skill_relevance(skill, job_posting)
            }

            skills_by_category[category].append(skill_data)

        # Sort skills by relevance and experience
        for category in skills_by_category:
            skills_by_category[category].sort(
                key=lambda x: (x['relevance'], x['yearsUsed']),
                reverse=True
            )

        return skills_by_category

    def _generate_education(self):
        """Generate education section from profile data"""
        education_list = self.profile.get('education', [])

        formatted_education = []

        for edu in education_list:
            formatted_edu = {
                'institution': edu.get('institution', ''),
                'degree': edu.get('name', ''),
                'field': edu.get('field', ''),
                'year': edu.get('year', ''),
                'gpa': edu.get('gpa', ''),
                'honors': edu.get('honors', ''),
                'type': edu.get('type', 'degree'),
                'relevant': edu.get('relevant', True)
            }
            formatted_education.append(formatted_edu)

        # Sort by year (most recent first)
        formatted_education.sort(key=lambda x: x.get('year', 0), reverse=True)

        return formatted_education

    def _format_duration(self, start_date, end_date):
        """Format employment duration"""
        if not start_date:
            return ''

        start = start_date.replace('-', '/')
        end = 'Present' if end_date == 'present' else end_date.replace('-', '/')

        return f"{start} - {end}"

    def _extract_quantified_achievements(self, achievements):
        """Extract achievements that contain numbers/metrics"""
        quantified = []

        for achievement in achievements:
            # Look for numbers, percentages, dollar amounts
            if any(char.isdigit() for char in achievement) or '%' in achievement or '$' in achievement:
                quantified.append({
                    'text': achievement,
                    'impact': 'quantified',
                    'type': 'metric'
                })

        return quantified

    def _extract_keywords_for_job(self, experience, job_posting):
        """Extract relevant keywords from experience for job matching"""
        if not job_posting:
            return []

        exp_skills = experience.get('skills', [])
        exp_text = ' '.join([
            experience.get('description', ''),
            ' '.join(experience.get('achievements', []))
        ]).lower()

        # Simple keyword matching (can be enhanced with NLP)
        job_keywords = job_posting.lower().split() if isinstance(job_posting, str) else []
        relevant_keywords = []

        for keyword in job_keywords:
            if len(keyword) > 3 and keyword in exp_text:
                relevant_keywords.append(keyword)

        return list(set(relevant_keywords))[:10]  # Top 10 unique keywords

    def _calculate_skill_relevance(self, skill, job_posting):
        """Calculate skill relevance for job posting"""
        if not job_posting:
            return skill.get('interest', 5)  # Default to interest level

        skill_name = skill.get('name', '').lower()
        job_text = job_posting.lower() if isinstance(job_posting, str) else ''

        # Check if skill appears in job posting
        if skill_name in job_text:
            return 10  # High relevance

        # Check for partial matches or related terms
        skill_words = skill_name.split()
        for word in skill_words:
            if len(word) > 2 and word in job_text:
                return 7  # Medium relevance

        return skill.get('interest', 5)  # Default to interest level

    def generate_ats_optimization(self, job_posting):
        """Generate ATS optimization suggestions"""
        if not job_posting:
            return {'error': 'Job posting required for ATS optimization'}

        suggestions = {
            'keywordMatches': self._analyze_keyword_matches(job_posting),
            'missingSkills': self._identify_missing_skills(job_posting),
            'formatTips': self._get_ats_format_tips(),
            'scoreEstimate': self._calculate_ats_score(job_posting)
        }

        return suggestions

    def _analyze_keyword_matches(self, job_posting):
        """Analyze which profile keywords match job posting"""
        job_text = job_posting.lower()
        skills = self.profile.get('skills', [])

        matches = []
        for skill in skills:
            skill_name = skill.get('name', '').lower()
            if skill_name in job_text:
                matches.append({
                    'skill': skill.get('name'),
                    'level': skill.get('level'),
                    'years': skill.get('yearsUsed'),
                    'match': 'exact'
                })

        return matches

    def _identify_missing_skills(self, job_posting):
        """Identify skills in job posting not in profile"""
        # This would be enhanced with NLP skill extraction
        # For now, simple keyword analysis

        common_tech_skills = [
            'python', 'javascript', 'react', 'node.js', 'sql', 'aws',
            'kubernetes', 'docker', 'git', 'agile', 'scrum'
        ]

        job_text = job_posting.lower()
        profile_skills = [s.get('name', '').lower() for s in self.profile.get('skills', [])]

        missing = []
        for skill in common_tech_skills:
            if skill in job_text and skill not in profile_skills:
                missing.append(skill)

        return missing[:10]  # Top 10 missing skills

    def _get_ats_format_tips(self):
        """Get ATS formatting tips"""
        return [
            'Use standard section headings (Experience, Education, Skills)',
            'Include exact job titles and company names',
            'Use bullet points for achievements',
            'Avoid graphics, tables, or complex formatting',
            'Include relevant keywords naturally in context',
            'Use chronological order for experience',
            'Save as PDF to preserve formatting'
        ]

    def _calculate_ats_score(self, job_posting):
        """Calculate estimated ATS compatibility score"""
        score = 0

        # Profile completeness (40 points)
        completeness = self.profile_manager.get_profile_completeness()
        score += (completeness / 100) * 40

        # Keyword matches (30 points)
        matches = self._analyze_keyword_matches(job_posting)
        score += min(30, len(matches) * 3)

        # Experience relevance (20 points)
        experience = self.profile.get('experience', [])
        if experience:
            score += min(20, len(experience) * 5)

        # Skills relevance (10 points)
        skills = self.profile.get('skills', [])
        if skills:
            score += min(10, len(skills))

        return min(100, score)

# CLI interface
if __name__ == "__main__":
    generator = ProfileResumeGenerator()

    if len(sys.argv) < 2:
        print("Usage: python profile_resume_generator.py [generate|optimize|score] [options]")
        sys.exit(1)

    command = sys.argv[1]

    if command == "generate":
        target_role = sys.argv[2] if len(sys.argv) > 2 else None
        resume = generator.generate_resume(target_role=target_role)
        print(json.dumps(resume, indent=2))

    elif command == "optimize":
        job_posting = sys.argv[2] if len(sys.argv) > 2 else ""
        suggestions = generator.generate_ats_optimization(job_posting)
        print(json.dumps(suggestions, indent=2))

    elif command == "score":
        job_posting = sys.argv[2] if len(sys.argv) > 2 else ""
        score = generator._calculate_ats_score(job_posting)
        print(f"ATS Compatibility Score: {score}/100")

    else:
        print(f"Unknown command: {command}")