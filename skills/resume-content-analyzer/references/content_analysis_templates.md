# Content Analysis Templates

Comprehensive templates and checklists for systematic resume content evaluation.

## Section-by-Section Analysis Template

### Work Experience Analysis
```yaml
section: work_experience
evaluation_criteria:
  content_depth:
    - bullet_count_per_role: "Target 2-4 bullets per position"
    - achievement_quantification: "80%+ bullets should include metrics"
    - technical_detail_level: "Specific tools/technologies mentioned"
    - business_impact_clarity: "User/business outcomes connected"

  optimization_opportunities:
    - generic_bullets: "Identify bullets lacking specifics"
    - missing_metrics: "Achievements without quantification"
    - weak_action_verbs: "Replace passive with active voice"
    - keyword_integration: "Natural technical term placement"

  quality_indicators:
    - xyz_formula_compatibility: "Can be transformed to X→Y→Z format"
    - credibility_markers: "Specific companies, scales, outcomes"
    - progression_narrative: "Career growth and increasing responsibility"
```

### Project Section Analysis
```yaml
section: projects
evaluation_criteria:
  condensation_potential:
    - bullet_count: "3+ bullets = high condensation opportunity"
    - redundant_information: "Technical overlap between bullets"
    - consolidation_feasibility: "Can combine into single comprehensive sentence"

  purpose_clarity:
    - user_value_proposition: "Who benefits and how?"
    - specific_problem_solved: "Beyond technical implementation"
    - real_world_application: "Actual usage and impact"

  technical_emphasis:
    - key_technologies_highlighted: "Core technical stack preserved"
    - metrics_maintained: "Quantified results included"
    - complexity_indicators: "Scale, performance, architectural choices"

transformation_templates:
  multi_bullet_to_oneliner:
    input_structure: |
      ### Project Name | Year
      Brief description
      - Technical implementation detail
      - Feature/capability description
      - Outcome/result achieved

    output_structure: |
      ### Project Name | Year
      [Project type] with [key technologies] achieving [metrics/outcomes] for [specific user value/purpose].

    example_transformation:
      before: |
        ### BuscaTuPepa Search | 2024
        Search platform with natural language understanding and voice capabilities
        - Built search engine with NLP query understanding and context awareness
        - Implemented voice search integration with multi-modal interaction capabilities
        - Developed search optimization with personalized results and ranking algorithms

      after: |
        ### BuscaTuPepa Search | 2024
        Medicine price comparison platform with NLP query understanding and voice integration, enabling users to find medicines at cheapest prices across pharmacies through intelligent search algorithms.
```

### Skills Section Analysis
```yaml
section: core_skills
evaluation_criteria:
  keyword_coverage:
    - silicon_valley_2026_terms: "Claude Agent SDK, MCP Protocol, AI Agent Orchestration"
    - fundamental_technologies: "Python, TypeScript, JavaScript"
    - framework_relevance: "React, Next.js, FastAPI, Node.js"
    - infrastructure_keywords: "AWS, Kubernetes, Docker"

  strategic_positioning:
    - skill_prioritization: "Most relevant first"
    - density_optimization: "15-25 total skills target"
    - highlighting_strategy: "Bold primary technologies"
    - natural_flow: "Logical grouping and progression"
```

## Missing Context Evaluation

### Travel/Global Experience Assessment
```yaml
context_type: global_experience
evaluation_checklist:
  explicit_mentions:
    - [ ] "Remote work" capability specified
    - [ ] "Multiple countries" or specific countries mentioned
    - [ ] "Global clients" or international scope indicated
    - [ ] "Cross-cultural" or "distributed team" experience

  professional_positioning:
    - [ ] Remote work as competitive advantage
    - [ ] Cultural adaptability demonstrated
    - [ ] Timezone management capability
    - [ ] International business acumen

  integration_strategies:
    summary_integration: "Currently helping AI-first companies build production systems while working remotely across multiple countries."
    experience_integration: "Built systems for global client base across [specific regions/countries]"
    skills_integration: "Remote Collaboration, Cross-cultural Communication"
```

### Institutional Prestige Assessment
```yaml
context_type: institutional_details
evaluation_checklist:
  education_specificity:
    - [ ] Full institutional names (not abbreviations)
    - [ ] Specific schools/programs within universities
    - [ ] Relevant honors, distinctions, or special programs
    - [ ] Industry-relevant coursework or thesis topics

  enhancement_opportunities:
    generic_to_specific:
      before: "University of London"
      after: "University of London - London School of Economics"

    program_specificity:
      before: "Bachelor of Science"
      after: "Bachelor of Science, Management and Digital Innovation"

    additional_context:
      - Relevant thesis topics
      - Academic achievements
      - Special programs or tracks
```

### Project Purpose Clarification
```yaml
context_type: project_purposes
evaluation_framework:
  purpose_clarity_levels:
    level_1_generic: "Search platform with advanced capabilities"
    level_2_technical: "NLP-powered search with voice integration"
    level_3_user_focused: "Medicine price comparison enabling cost savings"
    level_4_impact_specific: "Helping users find medicines at 30% lower prices across 500+ pharmacies"

  transformation_process:
    step_1_identify: "What specific problem does this solve?"
    step_2_clarify: "Who are the actual users?"
    step_3_quantify: "What measurable value is provided?"
    step_4_integrate: "Combine technical excellence with user impact"
```

## Content Density Optimization

### Space Allocation Analysis
```yaml
section_targets:
  work_experience:
    percentage: 60%
    justification: "High-value detailed achievements"
    optimization: "Maintain depth, improve flow"

  projects:
    percentage: 25%
    justification: "Supplementary evidence of capabilities"
    optimization: "Condense to one-liners, preserve impact"

  header_summary_skills:
    percentage: 10%
    justification: "Essential professional presentation"
    optimization: "Compact but comprehensive"

  education_publications:
    percentage: 5%
    justification: "Credential validation only"
    optimization: "Essential information, remove fluff"

pdf_page_estimation:
  calculation_method: "words_per_page * content_density_factor"
  target_words_per_page: 350
  font_size_factor: 0.9  # 9pt base font
  spacing_factor: 1.2    # line height
  margin_factor: 0.85    # effective content area
```

### Condensation Decision Matrix
```yaml
condensation_priorities:
  high_priority:
    - multi_bullet_projects: "3+ bullets → 1 sentence"
    - redundant_descriptions: "Overlapping technical details"
    - generic_achievements: "Vague outcomes without metrics"

  medium_priority:
    - wordy_bullets: "Long sentences → concise impact statements"
    - supplementary_sections: "Publications, certifications trimming"
    - skill_list_optimization: "Remove less relevant technologies"

  low_priority:
    - header_optimization: "Contact info formatting"
    - summary_tightening: "Minor wordsmithing"
    - education_details: "Degree description refinement"

quality_preservation:
  must_maintain:
    - quantified_achievements: "All metrics and scale indicators"
    - technical_keywords: "Core technologies and frameworks"
    - business_impact: "User outcomes and value creation"
    - authentic_voice: "Personal style and personality"

  can_optimize:
    - implementation_details: "How vs. what and why"
    - redundant_phrases: "Repeated concepts across bullets"
    - generic_descriptions: "Vague or obvious statements"
```

## Quality Validation Checklist

### Content Completeness Assessment
```yaml
completeness_criteria:
  professional_context:
    - [ ] Role progression narrative clear
    - [ ] Industry expertise demonstrated
    - [ ] Technical depth appropriate for level
    - [ ] Business impact consistently shown

  missing_elements_common:
    - [ ] Leadership/mentoring examples
    - [ ] Cross-functional collaboration
    - [ ] Problem-solving methodology
    - [ ] Innovation or optimization examples

  context_gaps_systematic:
    - [ ] Geographic/cultural experience
    - [ ] Institutional affiliations complete
    - [ ] Project user value explicit
    - [ ] Industry domain knowledge shown
```

### Professional Standards Validation
```yaml
professional_quality:
  authentic_voice:
    - [ ] Personality preserved while optimized
    - [ ] Consistent tone throughout
    - [ ] Genuine achievements, not inflated
    - [ ] Natural language flow maintained

  technical_accuracy:
    - [ ] Only claimed skills actually possessed
    - [ ] Metrics and dates verifiable
    - [ ] Technical stack current and relevant
    - [ ] Industry terminology appropriate

  visual_professionalism:
    - [ ] Consistent formatting and style
    - [ ] Logical information hierarchy
    - [ ] Clean, readable presentation
    - [ ] Professional contact information
```

These templates provide systematic evaluation criteria for comprehensive content analysis, ensuring both optimization opportunities and quality preservation.