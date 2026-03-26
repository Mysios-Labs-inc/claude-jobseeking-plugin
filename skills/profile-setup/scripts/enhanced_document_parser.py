#!/usr/bin/env python3
"""
Enhanced Document Parser for Claude Jobseeking Plugin v1.1.1
Improved parsing with better accuracy and error handling
"""

import json
import re
import PyPDF2
from typing import Dict, List, Optional, Tuple
from pathlib import Path
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EnhancedDocumentParser:
    def __init__(self):
        self.extracted_data = {
            "personal": {},
            "professional": {},
            "experience": [],
            "education": [],
            "skills": [],
            "metadata": {
                "extraction_confidence": 0.0,
                "extraction_source": "",
                "fields_extracted": [],
                "fields_missing": []
            }
        }

        # Improved patterns
        self.patterns = {
            "email": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            "phone": r'(\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})',
            "linkedin": r'(?:linkedin\.com/in/|/in/)([A-Za-z0-9-]+)',
            "github": r'(?:github\.com/)([A-Za-z0-9-]+)',
            "year": r'\b(19|20)\d{2}\b',
            "gpa": r'(?:GPA|G\.P\.A\.)\s*:?\s*([0-9]\.[0-9]+)',
            "degree": r'(Bachelor|Master|PhD|B\.A\.|B\.S\.|M\.A\.|M\.S\.|Ph\.D\.)[^,\n]*',
        }

        # Enhanced section markers
        self.section_markers = {
            'experience': [
                'experience', 'employment', 'work history', 'professional experience',
                'work experience', 'career history', 'employment history'
            ],
            'education': [
                'education', 'educational background', 'academic background',
                'degrees', 'university', 'college', 'school'
            ],
            'skills': [
                'skills', 'technical skills', 'core competencies', 'technologies',
                'programming languages', 'tools', 'expertise', 'proficiencies'
            ],
            'summary': [
                'summary', 'profile', 'objective', 'about', 'professional summary',
                'career objective', 'personal statement'
            ]
        }

    def parse_resume_pdf(self, pdf_path: str) -> Dict:
        """Enhanced PDF parsing with better error handling"""
        try:
            self.extracted_data["metadata"]["extraction_source"] = f"PDF: {pdf_path}"

            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""

                # Extract text from all pages
                for page_num, page in enumerate(pdf_reader.pages):
                    try:
                        page_text = page.extract_text()
                        text += f"\n--- Page {page_num + 1} ---\n{page_text}"
                    except Exception as e:
                        logger.warning(f"Error extracting page {page_num + 1}: {e}")
                        continue

            if not text.strip():
                raise ValueError("No text could be extracted from PDF")

            # Parse with confidence scoring
            self._parse_resume_text_enhanced(text)
            self._calculate_extraction_confidence()

            logger.info(f"Extraction confidence: {self.extracted_data['metadata']['extraction_confidence']:.2f}")
            return self.get_profile_data()

        except Exception as e:
            logger.error(f"Error parsing PDF: {e}")
            return {
                "error": str(e),
                "metadata": {
                    "extraction_confidence": 0.0,
                    "extraction_source": f"PDF: {pdf_path}",
                    "fields_extracted": [],
                    "fields_missing": ["all"]
                }
            }

    def _parse_resume_text_enhanced(self, text: str):
        """Enhanced text parsing with section detection"""
        lines = text.split('\n')
        cleaned_lines = [line.strip() for line in lines if line.strip()]

        # Extract personal information
        self._extract_personal_info_enhanced(text, cleaned_lines)

        # Parse sections
        sections = self._detect_sections(cleaned_lines)

        for section_type, content in sections.items():
            if section_type == 'experience':
                self._extract_experience_enhanced(content)
            elif section_type == 'education':
                self._extract_education_enhanced(content)
            elif section_type == 'skills':
                self._extract_skills_enhanced(content)
            elif section_type == 'summary':
                self._extract_summary_enhanced(content)

    def _detect_sections(self, lines: List[str]) -> Dict[str, List[str]]:
        """Detect resume sections with improved accuracy"""
        sections = {}
        current_section = None
        current_content = []

        for line in lines:
            line_lower = line.lower()

            # Check if line is a section header
            section_found = None
            for section_type, markers in self.section_markers.items():
                if any(marker in line_lower for marker in markers):
                    # Check if this is likely a section header (not just containing the word)
                    if len(line.split()) <= 4 or line.endswith(':') or line.isupper():
                        section_found = section_type
                        break

            if section_found:
                # Save previous section
                if current_section and current_content:
                    sections[current_section] = current_content

                # Start new section
                current_section = section_found
                current_content = []
            elif current_section:
                current_content.append(line)

        # Save final section
        if current_section and current_content:
            sections[current_section] = current_content

        return sections

    def _extract_personal_info_enhanced(self, text: str, lines: List[str]):
        """Enhanced personal information extraction"""
        fields_found = []

        # Email extraction
        email_match = re.search(self.patterns["email"], text)
        if email_match:
            self.extracted_data["personal"]["email"] = email_match.group()
            fields_found.append("email")

        # Phone extraction with multiple formats
        phone_matches = re.findall(self.patterns["phone"], text)
        if phone_matches:
            # Take the first phone number found
            self.extracted_data["personal"]["phone"] = phone_matches[0]
            fields_found.append("phone")

        # LinkedIn extraction
        linkedin_match = re.search(self.patterns["linkedin"], text)
        if linkedin_match:
            username = linkedin_match.group(1)
            self.extracted_data["personal"]["linkedin"] = f"https://linkedin.com/in/{username}"
            fields_found.append("linkedin")

        # GitHub extraction
        github_match = re.search(self.patterns["github"], text)
        if github_match:
            username = github_match.group(1)
            self.extracted_data["personal"]["github"] = f"https://github.com/{username}"
            fields_found.append("github")

        # Name extraction (improved heuristics)
        name = self._extract_name_enhanced(lines)
        if name:
            self.extracted_data["personal"]["name"] = name
            fields_found.append("name")

        # Location extraction
        location = self._extract_location(text)
        if location:
            self.extracted_data["personal"]["location"] = location
            fields_found.append("location")

        self.extracted_data["metadata"]["fields_extracted"].extend(fields_found)

    def _extract_name_enhanced(self, lines: List[str]) -> Optional[str]:
        """Enhanced name extraction with better heuristics"""
        for i, line in enumerate(lines[:10]):  # Check first 10 lines
            line = line.strip()

            # Skip empty lines, emails, phones, URLs
            if not line or '@' in line or any(char in line for char in ['(', ')', '+', 'http', 'www']):
                continue

            # Skip lines with too many words (likely not a name)
            words = line.split()
            if len(words) > 4:
                continue

            # Skip lines that are clearly not names
            if any(keyword in line.lower() for keyword in ['resume', 'cv', 'curriculum', 'profile']):
                continue

            # Check if it looks like a name (2-3 words, capitalized)
            if 2 <= len(words) <= 3 and all(word[0].isupper() for word in words if word):
                return line

        return None

    def _extract_location(self, text: str) -> Optional[str]:
        """Extract location information"""
        # Look for common location patterns
        location_patterns = [
            r'([A-Z][a-z]+,\s*[A-Z]{2})',  # City, ST
            r'([A-Z][a-z]+,\s*[A-Z][a-z]+)',  # City, State
            r'([A-Z][a-z\s]+,\s*[A-Z]{2}\s*\d{5})',  # City, ST ZIP
        ]

        for pattern in location_patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(1)

        return None

    def _extract_experience_enhanced(self, content: List[str]):
        """Enhanced work experience extraction"""
        current_job = None

        for line in content:
            line = line.strip()
            if not line:
                continue

            # Look for job titles and companies
            # Check for date patterns to identify job entries
            if re.search(r'\b\d{4}\b.*\b\d{4}\b|\b\d{4}\b.*present|\b\d{4}\b.*current', line.lower()):
                # This looks like a date range, might be a job entry
                if current_job:
                    self.extracted_data["experience"].append(current_job)

                current_job = {
                    "company": "Unknown",
                    "title": "Unknown",
                    "duration": line,
                    "achievements": [],
                    "skills": []
                }
            elif current_job and line:
                # Look for achievements (bullet points, action words)
                if line.startswith(('•', '-', '*')) or any(word in line.lower() for word in ['developed', 'created', 'managed', 'led', 'improved']):
                    current_job["achievements"].append(line.lstrip('•-* '))

        # Add the last job
        if current_job:
            self.extracted_data["experience"].append(current_job)

    def _extract_education_enhanced(self, content: List[str]):
        """Enhanced education extraction"""
        for line in content:
            # Look for degree patterns
            degree_match = re.search(self.patterns["degree"], line)
            year_match = re.search(self.patterns["year"], line)
            gpa_match = re.search(self.patterns["gpa"], line)

            if degree_match:
                edu_entry = {
                    "degree": degree_match.group(),
                    "institution": "Unknown",
                    "year": year_match.group() if year_match else "",
                    "gpa": gpa_match.group(1) if gpa_match else ""
                }

                # Try to extract institution name
                # Remove the degree part and see what's left
                remaining = line.replace(degree_match.group(), "").strip()
                if remaining and len(remaining.split()) <= 5:
                    edu_entry["institution"] = remaining

                self.extracted_data["education"].append(edu_entry)

    def _extract_skills_enhanced(self, content: List[str]):
        """Enhanced skills extraction"""
        for line in content:
            # Split by common separators
            skills = re.split(r'[,•·|;]', line)
            for skill in skills:
                skill = skill.strip()
                # Filter out non-skills
                if skill and len(skill) < 50 and not any(word in skill.lower() for word in ['years', 'experience', 'proficient']):
                    self.extracted_data["skills"].append(skill)

    def _extract_summary_enhanced(self, content: List[str]):
        """Extract professional summary"""
        summary_text = " ".join(content)
        if summary_text:
            self.extracted_data["professional"]["summary"] = summary_text[:500]  # Limit length

    def _calculate_extraction_confidence(self):
        """Calculate confidence score based on extracted fields"""
        total_fields = 8  # name, email, phone, linkedin, experience, education, skills, summary
        extracted_count = 0

        # Check what we extracted
        if self.extracted_data["personal"].get("name"):
            extracted_count += 1
        if self.extracted_data["personal"].get("email"):
            extracted_count += 1
        if self.extracted_data["personal"].get("phone"):
            extracted_count += 1
        if self.extracted_data["personal"].get("linkedin"):
            extracted_count += 1
        if self.extracted_data["experience"]:
            extracted_count += 1
        if self.extracted_data["education"]:
            extracted_count += 1
        if self.extracted_data["skills"]:
            extracted_count += 1
        if self.extracted_data["professional"].get("summary"):
            extracted_count += 1

        confidence = (extracted_count / total_fields) * 100
        self.extracted_data["metadata"]["extraction_confidence"] = confidence

        # Track missing fields
        if not self.extracted_data["personal"].get("name"):
            self.extracted_data["metadata"]["fields_missing"].append("name")
        if not self.extracted_data["personal"].get("email"):
            self.extracted_data["metadata"]["fields_missing"].append("email")

    def parse_linkedin_data(self, data_path: str) -> Dict:
        """Enhanced LinkedIn data parsing"""
        try:
            self.extracted_data["metadata"]["extraction_source"] = f"LinkedIn: {data_path}"

            if data_path.endswith('.json'):
                with open(data_path, 'r', encoding='utf-8') as file:
                    linkedin_data = json.load(file)
                    self._parse_linkedin_json_enhanced(linkedin_data)
            else:
                # Handle text or CSV format
                self._parse_linkedin_text_enhanced(data_path)

            self._calculate_extraction_confidence()
            return self.get_profile_data()

        except Exception as e:
            logger.error(f"Error parsing LinkedIn data: {e}")
            return {"error": str(e)}

    def _parse_linkedin_json_enhanced(self, data: Dict):
        """Enhanced LinkedIn JSON parsing"""
        # This would handle the actual LinkedIn export format
        # LinkedIn exports can have various structures depending on the export type

        # Basic profile info
        if 'profile' in data:
            profile = data['profile']
            self.extracted_data["personal"]["name"] = f"{profile.get('firstName', '')} {profile.get('lastName', '')}".strip()
            self.extracted_data["personal"]["location"] = profile.get('location', '')

            if 'summary' in profile:
                self.extracted_data["professional"]["summary"] = profile['summary']

        # Experience data
        if 'positions' in data:
            for position in data['positions']:
                self.extracted_data["experience"].append({
                    "company": position.get('companyName', ''),
                    "title": position.get('title', ''),
                    "duration": f"{position.get('startDate', '')} - {position.get('endDate', 'Present')}",
                    "description": position.get('description', ''),
                    "achievements": [position.get('description', '')] if position.get('description') else [],
                    "skills": []
                })

    def _parse_linkedin_text_enhanced(self, file_path: str):
        """Handle LinkedIn profile as text file"""
        with open(file_path, 'r', encoding='utf-8') as file:
            text = file.read()
            self._parse_resume_text_enhanced(text)

    def get_profile_data(self) -> Dict:
        """Return enhanced profile data with metadata"""
        return {
            "personal": self.extracted_data["personal"],
            "professional": {
                "title": self.extracted_data["professional"].get("title", ""),
                "summary": self.extracted_data["professional"].get("summary", ""),
                "yearsExperience": self._calculate_years_experience(),
                "industries": [],
                "specializations": self.extracted_data["skills"][:10]
            },
            "experience": self.extracted_data["experience"],
            "education": self.extracted_data["education"],
            "skills": self.extracted_data["skills"],
            "metadata": self.extracted_data["metadata"],
            "extraction_quality": {
                "confidence": self.extracted_data["metadata"]["extraction_confidence"],
                "fields_extracted": len(self.extracted_data["metadata"]["fields_extracted"]),
                "fields_missing": self.extracted_data["metadata"]["fields_missing"],
                "requires_validation": self.extracted_data["metadata"]["extraction_confidence"] < 80
            }
        }

    def _calculate_years_experience(self) -> int:
        """Calculate years of experience from job history"""
        if not self.extracted_data["experience"]:
            return 0

        total_years = 0
        for job in self.extracted_data["experience"]:
            # Simple estimation: each job = ~2 years average
            total_years += 2

        return min(total_years, 20)  # Cap at 20 years


def main():
    """CLI interface for testing enhanced parser"""
    import sys

    if len(sys.argv) != 3:
        print("Usage: python enhanced_document_parser.py <file_type> <file_path>")
        print("file_type: 'resume' or 'linkedin'")
        return

    file_type, file_path = sys.argv[1], sys.argv[2]
    parser = EnhancedDocumentParser()

    if file_type == 'resume':
        result = parser.parse_resume_pdf(file_path)
    elif file_type == 'linkedin':
        result = parser.parse_linkedin_data(file_path)
    else:
        print("Invalid file type. Use 'resume' or 'linkedin'")
        return

    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()