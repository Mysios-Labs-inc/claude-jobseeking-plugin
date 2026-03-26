#!/usr/bin/env python3
"""
File Upload Assistant for Claude Jobseeking Plugin v1.1.1
Smart file detection and upload guidance
"""

import os
import json
from pathlib import Path
from typing import List, Dict, Optional, Tuple
import mimetypes

class FileUploadAssistant:
    def __init__(self):
        self.supported_formats = {
            'resume': {
                'extensions': ['.pdf', '.doc', '.docx'],
                'mimetypes': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                'common_names': ['resume', 'cv', 'curriculum']
            },
            'linkedin': {
                'extensions': ['.json', '.csv', '.txt'],
                'mimetypes': ['application/json', 'text/csv', 'text/plain'],
                'common_names': ['linkedin', 'profile', 'export']
            }
        }

        # Common file locations users might store these files
        self.search_directories = [
            Path.home() / "Downloads",
            Path.home() / "Documents",
            Path.home() / "Desktop",
            Path.home() / "Documents" / "Resume",
            Path.home() / "Documents" / "Career",
            Path.home() / "Documents" / "Job Search"
        ]

    def suggest_files(self, file_type: str = None) -> List[Dict]:
        """Find and suggest relevant files for upload"""
        suggested_files = []

        for directory in self.search_directories:
            if not directory.exists():
                continue

            try:
                for file_path in directory.iterdir():
                    if file_path.is_file():
                        file_info = self._analyze_file(file_path)

                        if file_type:
                            # Filter by specific type
                            if file_info['detected_type'] == file_type:
                                suggested_files.append(file_info)
                        else:
                            # Return all relevant files
                            if file_info['detected_type']:
                                suggested_files.append(file_info)
            except PermissionError:
                continue

        # Sort by confidence score
        suggested_files.sort(key=lambda x: x['confidence'], reverse=True)
        return suggested_files[:10]  # Return top 10 matches

    def _analyze_file(self, file_path: Path) -> Dict:
        """Analyze a file to determine its type and relevance"""
        file_info = {
            'path': str(file_path),
            'name': file_path.name,
            'size': file_path.stat().st_size if file_path.exists() else 0,
            'modified': file_path.stat().st_mtime if file_path.exists() else 0,
            'detected_type': None,
            'confidence': 0,
            'reasons': []
        }

        filename_lower = file_path.name.lower()
        extension = file_path.suffix.lower()

        # Analyze for resume
        resume_confidence = 0
        if extension in self.supported_formats['resume']['extensions']:
            resume_confidence += 40
            file_info['reasons'].append(f"Resume format ({extension})")

        if any(name in filename_lower for name in self.supported_formats['resume']['common_names']):
            resume_confidence += 30
            file_info['reasons'].append("Resume-related filename")

        # Additional resume indicators
        if any(word in filename_lower for word in ['oscar', 'rivas', '2024', '2025', 'updated', 'latest']):
            resume_confidence += 10
            file_info['reasons'].append("Contains personal/date identifiers")

        # Analyze for LinkedIn
        linkedin_confidence = 0
        if extension in self.supported_formats['linkedin']['extensions']:
            linkedin_confidence += 40
            file_info['reasons'].append(f"LinkedIn format ({extension})")

        if any(name in filename_lower for name in self.supported_formats['linkedin']['common_names']):
            linkedin_confidence += 30
            file_info['reasons'].append("LinkedIn-related filename")

        # Additional LinkedIn indicators
        if any(word in filename_lower for word in ['connections', 'export', 'data']):
            linkedin_confidence += 15
            file_info['reasons'].append("Contains LinkedIn export terms")

        # Determine best match
        if resume_confidence >= linkedin_confidence and resume_confidence > 40:
            file_info['detected_type'] = 'resume'
            file_info['confidence'] = resume_confidence
        elif linkedin_confidence > 40:
            file_info['detected_type'] = 'linkedin'
            file_info['confidence'] = linkedin_confidence

        # Boost confidence for recently modified files
        import time
        days_old = (time.time() - file_info['modified']) / (24 * 3600)
        if days_old < 30:  # Modified in last 30 days
            file_info['confidence'] += 10
            file_info['reasons'].append("Recently modified")

        return file_info

    def validate_file(self, file_path: str, expected_type: str) -> Dict:
        """Validate that a file is suitable for processing"""
        validation = {
            'valid': False,
            'file_type': None,
            'size_mb': 0,
            'issues': [],
            'warnings': []
        }

        try:
            path = Path(file_path)
            if not path.exists():
                validation['issues'].append(f"File not found: {file_path}")
                return validation

            # Check file size
            size_bytes = path.stat().st_size
            size_mb = size_bytes / (1024 * 1024)
            validation['size_mb'] = round(size_mb, 2)

            if size_mb > 10:  # 10MB limit
                validation['issues'].append(f"File too large: {size_mb:.1f}MB (max 10MB)")
                return validation

            if size_mb == 0:
                validation['issues'].append("File is empty")
                return validation

            # Check file type
            extension = path.suffix.lower()
            mime_type = mimetypes.guess_type(str(path))[0]

            if expected_type in self.supported_formats:
                format_info = self.supported_formats[expected_type]

                if extension in format_info['extensions']:
                    validation['file_type'] = expected_type
                    validation['valid'] = True
                else:
                    validation['issues'].append(f"Unsupported format for {expected_type}: {extension}")
                    validation['issues'].append(f"Supported formats: {', '.join(format_info['extensions'])}")

            # Additional validation for PDFs
            if extension == '.pdf' and expected_type == 'resume':
                if not self._validate_pdf(path):
                    validation['warnings'].append("PDF may be image-based or encrypted (text extraction might fail)")

            # Additional validation for JSON
            if extension == '.json' and expected_type == 'linkedin':
                if not self._validate_json(path):
                    validation['issues'].append("Invalid JSON format")
                    validation['valid'] = False

        except Exception as e:
            validation['issues'].append(f"Error validating file: {str(e)}")

        return validation

    def _validate_pdf(self, path: Path) -> bool:
        """Quick PDF validation"""
        try:
            import PyPDF2
            with open(path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                if len(pdf_reader.pages) == 0:
                    return False

                # Try to extract text from first page
                first_page_text = pdf_reader.pages[0].extract_text()
                return len(first_page_text.strip()) > 10
        except:
            return False

    def _validate_json(self, path: Path) -> bool:
        """Quick JSON validation"""
        try:
            with open(path, 'r', encoding='utf-8') as file:
                json.load(file)
            return True
        except:
            return False

    def get_upload_instructions(self, file_type: str) -> Dict:
        """Get detailed upload instructions for a file type"""
        instructions = {
            'resume': {
                'title': 'Resume Upload Instructions',
                'description': 'Upload your current resume to automatically extract your professional information',
                'formats': ['PDF (preferred)', 'Word (.doc, .docx)'],
                'tips': [
                    'Ensure your resume is text-based (not a scanned image)',
                    'Include contact information at the top',
                    'Use standard section headers (Experience, Education, Skills)',
                    'Keep file size under 10MB'
                ],
                'what_extracted': [
                    'Personal contact information',
                    'Work experience and job titles',
                    'Education and certifications',
                    'Skills and technologies',
                    'Professional summary'
                ]
            },
            'linkedin': {
                'title': 'LinkedIn Profile Upload Instructions',
                'description': 'Upload your LinkedIn data export to import your professional profile',
                'formats': ['JSON export (preferred)', 'CSV data', 'Text copy'],
                'tips': [
                    'Download your LinkedIn data from Settings & Privacy > Data Privacy > Get a copy of your data',
                    'Select "Profile" data for export',
                    'Wait for LinkedIn to prepare your data (can take up to 72 hours)',
                    'Upload the JSON file from the download'
                ],
                'what_extracted': [
                    'Professional headline and summary',
                    'Complete work history with descriptions',
                    'Education background',
                    'Skills and endorsements',
                    'Connection count and industry'
                ]
            }
        }

        return instructions.get(file_type, {})

    def create_upload_report(self, file_path: str, extraction_result: Dict) -> Dict:
        """Create a comprehensive upload and extraction report"""
        report = {
            'upload_status': 'success' if not extraction_result.get('error') else 'failed',
            'file_info': {
                'path': file_path,
                'name': Path(file_path).name,
                'type': extraction_result.get('metadata', {}).get('extraction_source', 'Unknown')
            },
            'extraction_summary': {},
            'data_quality': {},
            'next_steps': []
        }

        if extraction_result.get('error'):
            report['upload_status'] = 'failed'
            report['error_message'] = extraction_result['error']
            report['next_steps'] = [
                'Check that the file is not corrupted',
                'Try a different file format',
                'Manually enter your information instead'
            ]
        else:
            # Success case
            metadata = extraction_result.get('metadata', {})
            quality = extraction_result.get('extraction_quality', {})

            report['extraction_summary'] = {
                'confidence': f"{metadata.get('extraction_confidence', 0):.0f}%",
                'fields_found': len(metadata.get('fields_extracted', [])),
                'fields_missing': metadata.get('fields_missing', [])
            }

            report['data_quality'] = {
                'status': 'excellent' if quality.get('confidence', 0) >= 80 else 'good' if quality.get('confidence', 0) >= 60 else 'needs_review',
                'requires_validation': quality.get('requires_validation', True)
            }

            # Generate next steps based on quality
            if quality.get('confidence', 0) >= 80:
                report['next_steps'] = [
                    'Review and confirm the extracted information',
                    'Fill in any missing details',
                    'Continue with profile setup'
                ]
            else:
                report['next_steps'] = [
                    'Carefully review all extracted information',
                    'Manually correct any errors',
                    'Consider uploading a different version of your document'
                ]

        return report


def main():
    """CLI interface for file upload assistant"""
    import sys

    assistant = FileUploadAssistant()

    if len(sys.argv) == 1:
        print("File Upload Assistant for Claude Jobseeking Plugin")
        print("\nCommands:")
        print("  suggest [resume|linkedin]  - Find relevant files")
        print("  validate <path> <type>     - Validate a file")
        print("  instructions <type>        - Get upload instructions")
        return

    command = sys.argv[1]

    if command == 'suggest':
        file_type = sys.argv[2] if len(sys.argv) > 2 else None
        suggestions = assistant.suggest_files(file_type)

        print(f"\nFound {len(suggestions)} relevant files:")
        for i, file_info in enumerate(suggestions[:5], 1):
            print(f"\n{i}. {file_info['name']}")
            print(f"   Type: {file_info['detected_type']}")
            print(f"   Confidence: {file_info['confidence']}%")
            print(f"   Path: {file_info['path']}")
            print(f"   Reasons: {', '.join(file_info['reasons'])}")

    elif command == 'validate':
        if len(sys.argv) < 4:
            print("Usage: validate <file_path> <type>")
            return

        file_path, file_type = sys.argv[2], sys.argv[3]
        validation = assistant.validate_file(file_path, file_type)
        print(json.dumps(validation, indent=2))

    elif command == 'instructions':
        if len(sys.argv) < 3:
            print("Usage: instructions <resume|linkedin>")
            return

        file_type = sys.argv[2]
        instructions = assistant.get_upload_instructions(file_type)
        print(json.dumps(instructions, indent=2))


if __name__ == "__main__":
    main()