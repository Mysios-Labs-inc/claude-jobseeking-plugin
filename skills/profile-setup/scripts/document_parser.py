#!/usr/bin/env python3
"""
Document Parser for Claude Jobseeking Plugin
Extracts profile data from resumes (PDF) and LinkedIn exports
"""

import json
import re
import PyPDF2
from typing import Dict, List, Optional
from pathlib import Path

class DocumentParser:
    def __init__(self):
        self.extracted_data = {
            "personal": {},
            "professional": {},
            "experience": [],
            "education": [],
            "skills": []
        }

    def parse_resume_pdf(self, pdf_path: str) -> Dict:
        """Extract data from resume PDF"""
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text()

            # Parse extracted text
            self._parse_resume_text(text)
            return self.extracted_data

        except Exception as e:
            print(f"Error parsing PDF: {e}")
            return {}

    def parse_linkedin_data(self, data_path: str) -> Dict:
        """Parse LinkedIn data export"""
        try:
            if data_path.endswith('.json'):
                with open(data_path, 'r') as file:
                    linkedin_data = json.load(file)
                    self._parse_linkedin_json(linkedin_data)
            else:
                # If text format or URL provided
                self._parse_linkedin_text(data_path)

            return self.extracted_data

        except Exception as e:
            print(f"Error parsing LinkedIn data: {e}")
            return {}

    def _parse_resume_text(self, text: str):
        """Extract structured data from resume text"""
        lines = text.split('\n')

        # Extract personal information
        self._extract_contact_info(text)

        # Extract experience
        self._extract_experience_section(text)

        # Extract education
        self._extract_education_section(text)

        # Extract skills
        self._extract_skills_section(text)

    def _extract_contact_info(self, text: str):
        """Extract name, email, phone, etc."""
        # Email pattern
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email_match = re.search(email_pattern, text)
        if email_match:
            self.extracted_data["personal"]["email"] = email_match.group()

        # Phone pattern
        phone_pattern = r'(\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})'
        phone_match = re.search(phone_pattern, text)
        if phone_match:
            self.extracted_data["personal"]["phone"] = phone_match.group()

        # LinkedIn pattern
        linkedin_pattern = r'linkedin\.com/in/([A-Za-z0-9-]+)'
        linkedin_match = re.search(linkedin_pattern, text)
        if linkedin_match:
            self.extracted_data["personal"]["linkedin"] = f"https://linkedin.com/in/{linkedin_match.group(1)}"

        # Extract name (usually first line or near top)
        lines = text.split('\n')
        for i, line in enumerate(lines[:5]):
            line = line.strip()
            if line and not any(char in line for char in ['@', '.com', '(', ')', '+']) and len(line.split()) <= 3:
                self.extracted_data["personal"]["name"] = line
                break

    def _extract_experience_section(self, text: str):
        """Extract work experience"""
        # Look for experience section
        experience_markers = ['experience', 'employment', 'work history', 'professional experience']
        lines = text.lower().split('\n')

        start_idx = None
        for i, line in enumerate(lines):
            if any(marker in line for marker in experience_markers):
                start_idx = i
                break

        if start_idx:
            # Extract jobs (simplified pattern matching)
            experience_text = '\n'.join(lines[start_idx:start_idx + 20])  # Next 20 lines
            self._parse_job_entries(experience_text)

    def _extract_education_section(self, text: str):
        """Extract education information"""
        education_markers = ['education', 'degree', 'university', 'college']
        lines = text.lower().split('\n')

        for line in lines:
            if any(marker in line for marker in education_markers):
                # Extract degree info (simplified)
                if 'bachelor' in line or 'master' in line or 'phd' in line:
                    self.extracted_data["education"].append({
                        "degree": line.strip(),
                        "institution": "",
                        "year": self._extract_year(line)
                    })

    def _extract_skills_section(self, text: str):
        """Extract skills and technologies"""
        skill_markers = ['skills', 'technologies', 'tools', 'competencies']
        lines = text.lower().split('\n')

        for i, line in enumerate(lines):
            if any(marker in line for marker in skill_markers):
                # Get next few lines as skills
                skill_lines = lines[i+1:i+5]
                for skill_line in skill_lines:
                    if skill_line.strip() and not any(marker in skill_line for marker in skill_markers):
                        # Split by common separators
                        skills = re.split(r'[,•·|]', skill_line)
                        for skill in skills:
                            skill = skill.strip()
                            if skill and len(skill) < 50:  # Reasonable skill length
                                self.extracted_data["skills"].append(skill)

    def _parse_job_entries(self, text: str):
        """Parse individual job entries"""
        # Simplified job parsing - look for company and title patterns
        lines = text.split('\n')

        for line in lines:
            line = line.strip()
            if line and '-' in line and any(char.isdigit() for char in line):
                # Likely a date range
                date_match = re.search(r'(\d{4}).*?(\d{4}|\w+)', line)
                if date_match:
                    self.extracted_data["experience"].append({
                        "company": "Unknown",  # Would need more sophisticated parsing
                        "title": "Unknown",
                        "duration": line,
                        "achievements": [],
                        "skills": []
                    })

    def _parse_linkedin_json(self, data: Dict):
        """Parse LinkedIn JSON export"""
        # Extract profile information
        if 'profile' in data:
            profile = data['profile']
            self.extracted_data["personal"].update({
                "name": f"{profile.get('firstName', '')} {profile.get('lastName', '')}".strip(),
                "location": profile.get('location', ''),
                "linkedin": profile.get('publicProfileUrl', '')
            })

            # Professional summary
            if 'summary' in profile:
                self.extracted_data["professional"]["summary"] = profile['summary']

        # Extract experience
        if 'positions' in data:
            for position in data['positions']:
                self.extracted_data["experience"].append({
                    "company": position.get('companyName', ''),
                    "title": position.get('title', ''),
                    "startDate": position.get('startDate', ''),
                    "endDate": position.get('endDate', ''),
                    "description": position.get('description', ''),
                    "skills": []
                })

    def _parse_linkedin_text(self, text: str):
        """Parse LinkedIn profile from text/URL"""
        # For URL, would need web scraping (not implemented in basic version)
        # For now, just handle basic text parsing
        self._parse_resume_text(text)

    def _extract_year(self, text: str) -> Optional[str]:
        """Extract year from text"""
        year_match = re.search(r'\b(19|20)\d{2}\b', text)
        return year_match.group() if year_match else None

    def get_profile_data(self) -> Dict:
        """Return extracted profile data in standard format"""
        return {
            "personal": self.extracted_data["personal"],
            "professional": {
                "title": "",
                "summary": "",
                "yearsExperience": self._calculate_years_experience(),
                "industries": [],
                "specializations": self.extracted_data["skills"][:10]  # Top 10 skills
            },
            "experience": self.extracted_data["experience"],
            "education": self.extracted_data["education"],
            "extraction_source": "document_parser",
            "requires_validation": True
        }

    def _calculate_years_experience(self) -> int:
        """Calculate years of experience from job history"""
        # Simplified calculation
        return len(self.extracted_data["experience"]) * 2  # Rough estimate


def main():
    """CLI interface for testing"""
    import sys

    if len(sys.argv) != 3:
        print("Usage: python document_parser.py <file_type> <file_path>")
        print("file_type: 'resume' or 'linkedin'")
        return

    file_type, file_path = sys.argv[1], sys.argv[2]
    parser = DocumentParser()

    if file_type == 'resume':
        result = parser.parse_resume_pdf(file_path)
    elif file_type == 'linkedin':
        result = parser.parse_linkedin_data(file_path)
    else:
        print("Invalid file type. Use 'resume' or 'linkedin'")
        return

    print(json.dumps(parser.get_profile_data(), indent=2))


if __name__ == "__main__":
    main()