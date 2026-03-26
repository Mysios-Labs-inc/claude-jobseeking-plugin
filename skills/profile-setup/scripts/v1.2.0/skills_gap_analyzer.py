#!/usr/bin/env python3
"""
Skills Gap Analyzer v1.2.0
Analyzes user profile skills against job requirements to identify gaps
and provide targeted learning recommendations.
"""

import re
import json
import logging
from typing import Dict, Any, List, Set, Tuple, Optional
from collections import Counter
from datetime import datetime

class SkillsGapAnalyzer:
    """
    Analyzes skills gaps between user profile and job requirements.

    Features:
    - Job description parsing to extract required skills
    - Skills matching with synonyms and variants
    - Gap categorization (critical, nice-to-have, level gaps)
    - Learning recommendations with resources
    - Skills market frequency analysis
    """

    def __init__(self, profile_data: Dict[str, Any]):
        """
        Initialize Skills Gap Analyzer.

        Args:
            profile_data: Complete user profile JSON structure
        """
        self.profile_data = profile_data
        self.logger = self._setup_logging()
        self.user_skills = self._extract_user_skills()

        # Skills taxonomy for matching variants and synonyms
        self.skills_taxonomy = self._build_skills_taxonomy()

        # Common skills from job market data (would be loaded from external source)
        self.market_skills_frequency = self._get_market_skills_data()

    def _setup_logging(self) -> logging.Logger:
        """Set up logging for skills analysis."""
        logger = logging.getLogger('skills_gap_analyzer')
        logger.setLevel(logging.INFO)

        if not logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            logger.addHandler(handler)

        return logger

    def _extract_user_skills(self) -> Set[str]:
        """Extract all skills mentioned in user profile."""
        skills = set()

        # Extract from skills section
        profile_skills = self.profile_data.get('professional', {}).get('specializations', [])
        if isinstance(profile_skills, list):
            skills.update([skill.lower().strip() for skill in profile_skills])

        # Extract from experience
        for exp in self.profile_data.get('experience', []):
            exp_skills = exp.get('skills', [])
            if isinstance(exp_skills, list):
                skills.update([skill.lower().strip() for skill in exp_skills])

        # Extract from education (technologies, courses)
        for edu in self.profile_data.get('education', []):
            relevant_coursework = edu.get('relevant_coursework', [])
            if isinstance(relevant_coursework, list):
                skills.update([course.lower().strip() for course in relevant_coursework])

        self.logger.info(f"Extracted {len(skills)} skills from user profile")
        return skills

    def _build_skills_taxonomy(self) -> Dict[str, List[str]]:
        """
        Build skills taxonomy for matching variants and synonyms.

        Returns:
            Dictionary mapping canonical skill names to variants
        """
        taxonomy = {
            'javascript': ['js', 'javascript', 'ecmascript', 'es6', 'es2015', 'node.js', 'nodejs'],
            'python': ['python', 'python3', 'py'],
            'react': ['react', 'reactjs', 'react.js'],
            'vue': ['vue', 'vuejs', 'vue.js'],
            'angular': ['angular', 'angularjs', 'angular.js'],
            'docker': ['docker', 'containerization', 'containers'],
            'kubernetes': ['kubernetes', 'k8s', 'container orchestration'],
            'aws': ['aws', 'amazon web services', 'amazon cloud'],
            'azure': ['azure', 'microsoft azure', 'azure cloud'],
            'gcp': ['gcp', 'google cloud', 'google cloud platform'],
            'sql': ['sql', 'mysql', 'postgresql', 'postgres', 'sqlite'],
            'nosql': ['nosql', 'mongodb', 'dynamodb', 'cassandra'],
            'git': ['git', 'version control', 'source control'],
            'agile': ['agile', 'scrum', 'kanban', 'sprint'],
            'rest': ['rest', 'restful', 'rest api', 'restful api'],
            'graphql': ['graphql', 'graph ql'],
            'typescript': ['typescript', 'ts'],
            'java': ['java', 'java programming'],
            'c++': ['c++', 'cpp', 'c plus plus'],
            'c#': ['c#', 'csharp', 'c sharp'],
            'go': ['go', 'golang'],
            'rust': ['rust', 'rust language'],
            'php': ['php', 'php programming'],
            'ruby': ['ruby', 'ruby on rails', 'rails'],
            'swift': ['swift', 'swift programming', 'ios development'],
            'kotlin': ['kotlin', 'android development'],
            'machine learning': ['machine learning', 'ml', 'artificial intelligence', 'ai'],
            'data science': ['data science', 'data analysis', 'analytics'],
            'devops': ['devops', 'dev ops', 'continuous integration', 'ci/cd'],
            'microservices': ['microservices', 'micro services', 'service oriented architecture'],
            'api': ['api', 'apis', 'application programming interface'],
            'testing': ['testing', 'unit testing', 'integration testing', 'test automation']
        }

        return taxonomy

    def _get_market_skills_data(self) -> Dict[str, int]:
        """
        Get market frequency data for skills.

        Returns:
            Dictionary mapping skills to market frequency percentage
        """
        # This would typically be loaded from external market data
        # For now, using representative data
        market_data = {
            'javascript': 85,
            'python': 78,
            'react': 72,
            'aws': 68,
            'docker': 65,
            'sql': 82,
            'git': 90,
            'agile': 75,
            'typescript': 58,
            'kubernetes': 45,
            'machine learning': 42,
            'vue': 35,
            'angular': 40,
            'nosql': 55,
            'devops': 62,
            'api': 80,
            'testing': 70,
            'microservices': 38,
            'java': 65,
            'c#': 45,
            'go': 25,
            'rust': 15,
            'graphql': 30,
            'azure': 48,
            'gcp': 35
        }

        return market_data

    def normalize_skill(self, skill: str) -> str:
        """
        Normalize skill name to canonical form.

        Args:
            skill: Raw skill name

        Returns:
            Canonical skill name
        """
        skill_lower = skill.lower().strip()

        # Check taxonomy for canonical name
        for canonical, variants in self.skills_taxonomy.items():
            if skill_lower in variants:
                return canonical

        # Return cleaned version if no match found
        return skill_lower

    def extract_job_skills(self, job_description: str) -> Dict[str, Any]:
        """
        Extract required skills from job description text.

        Args:
            job_description: Full job description text

        Returns:
            Dictionary containing extracted skills with metadata
        """
        self.logger.info("Extracting skills from job description")

        # Convert to lowercase for processing
        job_text = job_description.lower()

        # Find skills mentioned in job description
        found_skills = {}

        # Check each skill in taxonomy
        for canonical_skill, variants in self.skills_taxonomy.items():
            skill_mentions = 0
            mentioned_variants = []

            for variant in variants:
                # Use word boundaries to avoid partial matches
                pattern = r'\b' + re.escape(variant) + r'\b'
                matches = re.findall(pattern, job_text)
                if matches:
                    skill_mentions += len(matches)
                    mentioned_variants.extend(matches)

            if skill_mentions > 0:
                # Determine if skill is required vs preferred
                is_required = self._determine_skill_criticality(canonical_skill, job_text)

                found_skills[canonical_skill] = {
                    'mentions': skill_mentions,
                    'variants_found': mentioned_variants,
                    'is_required': is_required,
                    'market_frequency': self.market_skills_frequency.get(canonical_skill, 0)
                }

        # Extract years of experience if mentioned
        experience_patterns = [
            r'(\d+)\+?\s*years?\s*(?:of\s+)?experience',
            r'(\d+)\+?\s*years?\s*in',
            r'minimum\s*(\d+)\s*years?',
            r'at\s*least\s*(\d+)\s*years?'
        ]

        years_required = []
        for pattern in experience_patterns:
            matches = re.findall(pattern, job_text)
            years_required.extend([int(match) for match in matches])

        min_experience = max(years_required) if years_required else None

        result = {
            'skills_found': found_skills,
            'total_skills': len(found_skills),
            'required_skills': [skill for skill, data in found_skills.items() if data['is_required']],
            'preferred_skills': [skill for skill, data in found_skills.items() if not data['is_required']],
            'min_experience_years': min_experience,
            'extracted_timestamp': datetime.now().isoformat()
        }

        self.logger.info(f"Extracted {len(found_skills)} skills from job description")
        return result

    def _determine_skill_criticality(self, skill: str, job_text: str) -> bool:
        """
        Determine if a skill is required vs preferred based on context.

        Args:
            skill: Canonical skill name
            job_text: Job description text (lowercase)

        Returns:
            True if skill appears to be required, False if preferred
        """
        # Look for context around skill mentions
        skill_variants = self.skills_taxonomy.get(skill, [skill])

        for variant in skill_variants:
            # Look for required context
            required_patterns = [
                r'(?:required|must\s+have|essential|mandatory|need).*?' + re.escape(variant),
                re.escape(variant) + r'.*?(?:required|essential|mandatory)',
                r'minimum.*?' + re.escape(variant),
                r'(?:expertise|proficiency|experience)\s+(?:in|with)\s+' + re.escape(variant)
            ]

            for pattern in required_patterns:
                if re.search(pattern, job_text):
                    return True

            # Look for preferred context
            preferred_patterns = [
                r'(?:preferred|nice\s+to\s+have|bonus|plus).*?' + re.escape(variant),
                re.escape(variant) + r'.*?(?:preferred|bonus|plus)',
                r'familiarity\s+with\s+' + re.escape(variant)
            ]

            for pattern in preferred_patterns:
                if re.search(pattern, job_text):
                    return False

        # Default to required if mentioned and high market frequency
        market_freq = self.market_skills_frequency.get(skill, 0)
        return market_freq > 50

    def analyze_gaps(self, target_job: Optional[str] = None) -> Dict[str, Any]:
        """
        Analyze skills gaps between user profile and target job requirements.

        Args:
            target_job: Job description text. If None, performs general market analysis.

        Returns:
            Dictionary containing gap analysis results
        """
        self.logger.info("Starting skills gap analysis")

        # Normalize user skills
        normalized_user_skills = {self.normalize_skill(skill) for skill in self.user_skills}

        if target_job:
            # Analyze against specific job
            job_skills = self.extract_job_skills(target_job)
            return self._analyze_job_specific_gaps(normalized_user_skills, job_skills)
        else:
            # General market analysis
            return self._analyze_market_gaps(normalized_user_skills)

    def _analyze_job_specific_gaps(self, user_skills: Set[str], job_skills: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze gaps against a specific job description.

        Args:
            user_skills: Normalized user skills
            job_skills: Extracted job skills data

        Returns:
            Gap analysis results
        """
        required_skills = set(job_skills['required_skills'])
        preferred_skills = set(job_skills['preferred_skills'])
        all_job_skills = required_skills | preferred_skills

        # Calculate gaps
        missing_required = required_skills - user_skills
        missing_preferred = preferred_skills - user_skills
        matching_skills = user_skills & all_job_skills

        # Calculate match percentage
        total_job_skills = len(all_job_skills)
        matching_count = len(matching_skills)
        match_percentage = (matching_count / total_job_skills * 100) if total_job_skills > 0 else 0

        # Generate gap details
        gaps_identified = []

        # Critical missing skills (required)
        for skill in missing_required:
            skill_data = job_skills['skills_found'].get(skill, {})
            gaps_identified.append({
                'skill': skill.title(),
                'gap_type': 'critical_missing',
                'job_frequency': skill_data.get('market_frequency', 0),
                'mentions_in_job': skill_data.get('mentions', 1),
                'recommendation': f'Learn {skill.title()} - this is a required skill for the role',
                'learning_resources': self._get_learning_resources(skill),
                'priority': 'high'
            })

        # Nice-to-have missing skills (preferred)
        for skill in missing_preferred:
            skill_data = job_skills['skills_found'].get(skill, {})
            gaps_identified.append({
                'skill': skill.title(),
                'gap_type': 'nice_to_have',
                'job_frequency': skill_data.get('market_frequency', 0),
                'mentions_in_job': skill_data.get('mentions', 1),
                'recommendation': f'Consider learning {skill.title()} to strengthen your application',
                'learning_resources': self._get_learning_resources(skill),
                'priority': 'medium'
            })

        # Sort gaps by priority (required first, then by market frequency)
        gaps_identified.sort(key=lambda x: (
            0 if x['gap_type'] == 'critical_missing' else 1,
            -x['job_frequency']
        ))

        # Calculate overall score
        critical_score = max(0, 100 - (len(missing_required) * 15))  # Penalize missing required skills heavily
        preferred_score = max(0, 100 - (len(missing_preferred) * 5))  # Lighter penalty for preferred
        skills_score = (critical_score + preferred_score) / 2

        return {
            'analysis_type': 'job_specific',
            'skills_score': round(skills_score, 1),
            'match_percentage': round(match_percentage, 1),
            'total_job_skills': total_job_skills,
            'matching_skills': list(matching_skills),
            'missing_required': list(missing_required),
            'missing_preferred': list(missing_preferred),
            'gaps_identified': gaps_identified,
            'strong_skills': list(matching_skills)[:5],  # Top 5 matching skills
            'market_readiness': self._assess_readiness(skills_score),
            'job_skills_data': job_skills
        }

    def _analyze_market_gaps(self, user_skills: Set[str]) -> Dict[str, Any]:
        """
        Analyze gaps against general market demand.

        Args:
            user_skills: Normalized user skills

        Returns:
            Market gap analysis results
        """
        # Get top market skills user is missing
        high_demand_skills = {
            skill: freq for skill, freq in self.market_skills_frequency.items()
            if freq > 60 and skill not in user_skills
        }

        # Sort by market frequency
        missing_high_demand = sorted(
            high_demand_skills.items(),
            key=lambda x: x[1],
            reverse=True
        )

        # Generate gap recommendations
        gaps_identified = []
        for skill, frequency in missing_high_demand[:8]:  # Top 8 gaps
            gap_type = 'critical_missing' if frequency > 75 else 'market_opportunity'

            gaps_identified.append({
                'skill': skill.title(),
                'gap_type': gap_type,
                'job_frequency': frequency,
                'recommendation': f'Learn {skill.title()} - high market demand ({frequency}% of jobs)',
                'learning_resources': self._get_learning_resources(skill),
                'priority': 'high' if frequency > 75 else 'medium'
            })

        # Calculate market coverage score
        total_high_demand = len([s for s, f in self.market_skills_frequency.items() if f > 60])
        user_high_demand = len([s for s in user_skills if self.market_skills_frequency.get(s, 0) > 60])
        market_coverage = (user_high_demand / total_high_demand * 100) if total_high_demand > 0 else 0

        return {
            'analysis_type': 'market_general',
            'skills_score': round(market_coverage, 1),
            'market_coverage': round(market_coverage, 1),
            'user_skills_count': len(user_skills),
            'high_demand_skills_owned': user_high_demand,
            'total_high_demand_skills': total_high_demand,
            'gaps_identified': gaps_identified,
            'strong_skills': self._get_user_strong_skills(user_skills),
            'market_readiness': self._assess_readiness(market_coverage)
        }

    def _get_user_strong_skills(self, user_skills: Set[str]) -> List[str]:
        """Get user's strongest skills based on market frequency."""
        skill_strengths = []

        for skill in user_skills:
            frequency = self.market_skills_frequency.get(skill, 0)
            if frequency > 0:
                skill_strengths.append((skill, frequency))

        # Sort by market frequency and return top skills
        skill_strengths.sort(key=lambda x: x[1], reverse=True)
        return [skill.title() for skill, _ in skill_strengths[:5]]

    def _get_learning_resources(self, skill: str) -> List[str]:
        """
        Get learning resources for a specific skill.

        Args:
            skill: Canonical skill name

        Returns:
            List of learning resource URLs
        """
        # Resource mapping (would be expanded with real resources)
        resources = {
            'javascript': [
                'https://developer.mozilla.org/en-US/docs/Learn/JavaScript',
                'https://javascript.info/',
                'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/'
            ],
            'python': [
                'https://www.python.org/about/gettingstarted/',
                'https://docs.python.org/3/tutorial/',
                'https://www.codecademy.com/learn/learn-python-3'
            ],
            'react': [
                'https://react.dev/learn',
                'https://www.freecodecamp.org/learn/front-end-development-libraries/#react',
                'https://scrimba.com/learn/learnreact'
            ],
            'docker': [
                'https://docs.docker.com/get-started/',
                'https://www.docker.com/101-tutorial',
                'https://www.coursera.org/learn/docker-container'
            ],
            'kubernetes': [
                'https://kubernetes.io/docs/tutorials/',
                'https://www.edx.org/course/introduction-kubernetes',
                'https://www.cncf.io/certification/cka/'
            ],
            'aws': [
                'https://aws.amazon.com/training/',
                'https://aws.amazon.com/certification/',
                'https://www.coursera.org/aws'
            ]
        }

        return resources.get(skill, [f'Search for "{skill.title()} tutorial" online'])

    def _assess_readiness(self, score: float) -> str:
        """Assess market readiness based on skills score."""
        if score >= 85:
            return 'excellent'
        elif score >= 75:
            return 'strong'
        elif score >= 65:
            return 'good'
        elif score >= 50:
            return 'developing'
        else:
            return 'needs_improvement'

if __name__ == "__main__":
    # Example usage
    sample_profile = {
        'professional': {
            'specializations': ['Python', 'React', 'PostgreSQL']
        },
        'experience': [
            {
                'skills': ['JavaScript', 'Node.js', 'AWS']
            }
        ]
    }

    analyzer = SkillsGapAnalyzer(sample_profile)

    # Example job description
    job_desc = """
    We are looking for a Senior Software Engineer with 5+ years of experience.
    Required skills: Python, React, Docker, AWS, SQL
    Preferred: Kubernetes, TypeScript, GraphQL
    """

    results = analyzer.analyze_gaps(job_desc)
    print(f"Skills match: {results['match_percentage']}%")
    print(f"Skills score: {results['skills_score']}")
    print(f"Gaps identified: {len(results['gaps_identified'])}")