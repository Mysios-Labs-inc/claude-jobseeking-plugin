#!/usr/bin/env python3
"""
Foundation Tests for AI Intelligence Manager v1.2.0
Tests basic functionality of the AI intelligence system.
"""

import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ai_intelligence_manager import AIIntelligenceManager
from skills_gap_analyzer import SkillsGapAnalyzer

def test_ai_manager_initialization():
    """Test that AI Intelligence Manager initializes correctly."""
    sample_profile = {
        'personal': {
            'name': 'Test User',
            'email': 'test@example.com'
        },
        'professional': {
            'title': 'Software Engineer',
            'specializations': ['Python', 'JavaScript', 'React']
        },
        'experience': [
            {
                'company': 'Test Corp',
                'skills': ['Python', 'SQL', 'AWS']
            }
        ]
    }

    try:
        ai_manager = AIIntelligenceManager(sample_profile)
        print("✅ AI Intelligence Manager initialized successfully")

        # Test that skills analyzer was created
        assert hasattr(ai_manager, 'skills_analyzer'), "Skills analyzer not initialized"
        assert isinstance(ai_manager.skills_analyzer, SkillsGapAnalyzer), "Skills analyzer wrong type"
        print("✅ Skills Gap Analyzer initialized successfully")

        return True
    except Exception as e:
        print(f"❌ AI Manager initialization failed: {str(e)}")
        return False

def test_skills_gap_analyzer():
    """Test Skills Gap Analyzer functionality."""
    sample_profile = {
        'professional': {
            'specializations': ['Python', 'React', 'SQL']
        },
        'experience': [
            {
                'skills': ['JavaScript', 'AWS', 'Docker']
            }
        ]
    }

    try:
        analyzer = SkillsGapAnalyzer(sample_profile)
        print("✅ Skills Gap Analyzer created successfully")

        # Test user skills extraction
        user_skills = analyzer.user_skills
        print(f"✅ Extracted {len(user_skills)} user skills: {list(user_skills)[:3]}...")

        # Test market gap analysis
        market_analysis = analyzer.analyze_gaps(target_job=None)
        print(f"✅ Market analysis completed - Score: {market_analysis['skills_score']}")

        # Test job-specific analysis
        job_description = """
        We need a Senior Developer with Python, React, and Docker experience.
        Required: Python, React, SQL, AWS
        Preferred: Kubernetes, TypeScript
        """

        job_analysis = analyzer.analyze_gaps(target_job=job_description)
        print(f"✅ Job analysis completed - Match: {job_analysis['match_percentage']}%")

        return True
    except Exception as e:
        print(f"❌ Skills Gap Analyzer test failed: {str(e)}")
        return False

def test_ai_manager_analysis():
    """Test full AI intelligence analysis."""
    sample_profile = {
        'personal': {
            'name': 'Test Developer',
            'email': 'test@dev.com'
        },
        'professional': {
            'title': 'Senior Software Engineer',
            'specializations': ['Python', 'React', 'AWS', 'SQL']
        },
        'experience': [
            {
                'company': 'Tech Startup',
                'title': 'Full Stack Developer',
                'skills': ['JavaScript', 'Node.js', 'PostgreSQL', 'Docker'],
                'achievements': ['Built scalable microservices', 'Led team of 3 developers']
            }
        ]
    }

    try:
        ai_manager = AIIntelligenceManager(sample_profile)
        print("✅ AI Manager initialized for analysis test")

        # Run analysis with just skills_gap feature to test the real implementation
        results = ai_manager.analyze_profile(features=['skills_gap'])
        print(f"✅ AI analysis completed")

        # Verify results structure
        assert 'skills_gap_analysis' in results, "Skills gap analysis not in results"
        assert 'analysis_timestamp' in results, "Analysis timestamp missing"
        assert 'features_analyzed' in results, "Features analyzed not recorded"

        skills_data = results['skills_gap_analysis']
        assert 'skills_score' in skills_data, "Skills score missing"
        assert 'market_readiness' in skills_data, "Market readiness missing"

        print(f"✅ Skills Score: {skills_data['skills_score']}")
        print(f"✅ Market Readiness: {skills_data['market_readiness']}")

        # Test intelligence summary
        summary = ai_manager.get_intelligence_summary()
        print(f"✅ Intelligence summary generated - Overall score: {summary['overall_score']}")

        return True
    except Exception as e:
        print(f"❌ AI Manager analysis test failed: {str(e)}")
        return False

def run_all_tests():
    """Run all foundation tests."""
    print("🧪 Running AI Intelligence Manager v1.2.0 Foundation Tests")
    print("=" * 60)

    tests = [
        ("AI Manager Initialization", test_ai_manager_initialization),
        ("Skills Gap Analyzer", test_skills_gap_analyzer),
        ("AI Manager Analysis", test_ai_manager_analysis)
    ]

    passed = 0
    total = len(tests)

    for test_name, test_func in tests:
        print(f"\n🔬 Testing: {test_name}")
        print("-" * 40)

        if test_func():
            passed += 1
            print(f"✅ {test_name} PASSED")
        else:
            print(f"❌ {test_name} FAILED")

    print("\n" + "=" * 60)
    print(f"📊 Test Results: {passed}/{total} tests passed")

    if passed == total:
        print("🎉 All tests passed! Foundation is ready for v1.2.0")
        return True
    else:
        print("⚠️  Some tests failed. Check implementation before proceeding.")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)