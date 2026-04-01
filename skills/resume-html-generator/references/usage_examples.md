# Resume HTML Generator Usage Examples

## Basic Usage Workflow

### 1. Input Processing
The skill expects markdown resume content with these sections:
```markdown
# Oscar Rivas Delgado
Product Engineer & Founder

Phone: +51949767204 | Email: oj.rivasds@gmail.com
LinkedIn: linkedin.com/in/mrcord | GitHub: github.com/mrcord

## PROFESSIONAL SUMMARY
Product Engineer & Founder with obsession for solving real user problems...

## CORE SKILLS
Python, TypeScript, JavaScript, React, Next.js, FastAPI...

## WORK EXPERIENCE
### Mysios Labs Inc. – Founder & Technical Leader | Feb 2026 – Present | Remote
- Built AI business automation systems for 10+ clients...

## PROJECTS & PLATFORMS
### social-media-manager Claude Plugin | 2026
Cross-platform automation system managing Instagram, X, LinkedIn, TikTok, and Substack with 10+ specialized AI skills using Claude Agent SDK and MCP Protocol for 24/7 autonomous operations.

## EDUCATION
### Universidad del Pacifico Peru | 2022
Bachelor of Science, Ingenieria Empresarial
```

### 2. Enhanced Processing Steps
1. **Content Analysis**: Evaluate space usage, identify optimization opportunities
   - Analyze section density (work experience vs projects vs other)
   - Identify missing context (travel, institutions, project purposes)
   - Plan content allocation strategy for 2-page optimization
2. **User Collaboration**: Validate context and gather missing information
   - Clarify travel/remote work experience
   - Specify institutional details (e.g., "LSE" for University of London)
   - Confirm project purposes (e.g., medicine price comparison vs generic search)
3. **Strategic Content Optimization**:
   - Apply X→Y→Z Formula to work experience bullets
   - Condense Projects: Convert 2-3 bullets → 1 comprehensive sentence
   - Add Highlighting: Apply metric and tech keyword emphasis
   - Verify content accuracy and professional tone
4. **HTML Generation**: Create 4 variants with 2-page optimized styling
5. **Quality Review**: User feedback on spacing, typography, visual hierarchy
6. **Refinement**: Apply styling feedback and regenerate if needed
7. **Final Delivery**: Clean file organization with version management

### 3. Output Files
- `resume_variant_a_corporate.html` - Corporate Clean
- `resume_variant_b_modern.html` - Modern Professional
- `resume_variant_c_minimal.html` - Silicon Valley Minimal
- `resume_variant_d_refined.html` - Refined Professional ⭐
- `resume_comparison_board.html` - Interactive comparison

## Example Transformations

### Experience Bullet Transformation

**Input Markdown:**
```markdown
- Built AI business automation systems for 10+ clients across Healthcare, FinTech, Industrial, and AgroTech sectors using Claude Agent SDK, MCP Protocol, and Python
```

**Output HTML (X→Y→Z Applied):**
```html
<li>Built AI business automation systems for <span class="metric">10+ clients</span> across Healthcare, FinTech, Industrial, and AgroTech sectors using <span class="tech">Claude Agent SDK, MCP Protocol, and Python</span></li>
```

### Project Section Transformation (New Format)

**Input Markdown:**
```markdown
### social-media-manager Claude Plugin | 2026
Production automation system for autonomous social media management
- Built cross-platform management system for Instagram, X, LinkedIn, TikTok, and Substack with 10+ specialized AI skills using Claude Agent SDK and MCP Protocol
- Architected enterprise system with FastAPI backend, PostHog analytics, and real-time performance monitoring enabling 24/7 autonomous operations
- Implemented data-driven optimization workflows that automatically adjust content strategy based on engagement metrics across platforms
```

**Output HTML (One-liner Format):**
```html
<div class="project">
    <div class="project-header">
        <div class="project-name">social-media-manager Claude Plugin</div>
        <div class="project-year">2026</div>
    </div>
    <div class="project-summary">Cross-platform automation system managing Instagram, X, LinkedIn, TikTok, and Substack with <span class="metric">10+ specialized AI skills</span> using <span class="tech">Claude Agent SDK and MCP Protocol</span> for <span class="metric">24/7 autonomous operations</span>.</div>
</div>
```

### Skills Section Transformation

**Input Markdown:**
```markdown
Python, TypeScript, JavaScript, React, Next.js, FastAPI, Claude Agent SDK, MCP Protocol
```

**Output HTML (Corporate Clean):**
```html
<p class="skills-text"><span class="skills-highlight">Python, TypeScript, JavaScript</span>, React, Next.js, FastAPI, <span class="skills-highlight">Claude Agent SDK, MCP Protocol</span></p>
```

**Output HTML (Silicon Valley Minimal):**
```html
<div class="skills">
    <span class="skill skill-primary">Python</span>
    <span class="skill skill-primary">TypeScript</span>
    <span class="skill skill-ai">Claude Agent SDK</span>
    <span class="skill skill-ai">MCP Protocol</span>
    <span class="skill">React</span>
</div>
```

## Advanced Usage Patterns

### Company-Specific Optimization

**For Google Applications:**
```markdown
Input: "Built scalable system processing user data"
Output: "Built scalable system processing <span class="metric">100M+ user records</span> with <span class="tech">distributed algorithms and system design principles</span> optimizing for <span class="metric">99.9% uptime</span>"
```

**For Startup Applications:**
```markdown
Input: "Led product development from concept to launch"
Output: "Led full-stack product development from <span class="metric">0-to-1</span>, achieving <span class="metric">PMF with 40% month-over-month growth</span> through rapid iteration and <span class="tech">MVP development</span>"
```

### Variant Selection by Use Case

**ATS-Heavy Application Process:**
```javascript
// Prioritize Corporate Clean or Refined Professional
variant_selection = {
    primary: "refined_professional",
    fallback: "corporate_clean",
    reasoning: "Maximum ATS compatibility with proven layout"
}
```

**Direct Email to Hiring Manager:**
```javascript
// Visual appeal matters more
variant_selection = {
    primary: "silicon_valley_minimal",
    fallback: "modern_professional",
    reasoning: "Human reader values design and modern aesthetic"
}
```

**Portfolio Website Integration:**
```javascript
// Web-optimized version
variant_selection = {
    primary: "silicon_valley_minimal",
    customization: {
        responsive: true,
        web_fonts: true,
        interactive_elements: true
    }
}
```

## Content Quality Standards

### Required Elements for Optimal Processing

1. **Quantified Achievements**: Include specific numbers, percentages, scale indicators
2. **Technology Stack**: Mention specific tools, frameworks, languages
3. **Business Impact**: Connect technical work to business outcomes
4. **Timeline Information**: Include dates, duration, progression
5. **Scope Indicators**: Team size, project scale, user numbers

### Common Input Issues and Solutions

**Issue**: Vague bullet points without metrics
```markdown
❌ "Improved system performance"
✅ "Improved system performance by 45% (2.3s → 1.3s page load) for 500K daily users"
```

**Issue**: Missing technology context
```markdown
❌ "Built a platform for data processing"
✅ "Built data processing platform handling 2M+ events/day using Python, FastAPI, and PostgreSQL"
```

**Issue**: No business impact connection
```markdown
❌ "Implemented machine learning algorithms"
✅ "Implemented ML-powered recommendation engine increasing user engagement by 40% and session duration by 25%"
```

## Integration Patterns

### With Profile Data
```javascript
// When integrated with profile-setup data
const resumeData = {
    personal: profile.personal_info,
    experience: profile.work_history.map(job => optimizeForXYZ(job)),
    skills: profile.skills.prioritize(jobRequirements),
    achievements: profile.achievements.quantify()
}
```

### With Job Application Workflow
```javascript
// Part of application process
workflow = [
    "job-search.find_opportunities()",
    "resume-html-generator.create_targeted_resume(job_requirements)",
    "cover-letter-generator.create_letter(resume_variant)",
    "application.submit(resume_html, cover_letter)"
]
```

### PDF Generation Pipeline
```bash
# Browser-based PDF generation
1. Generate HTML variant
2. Open in browser (Chrome/Safari/Firefox)
3. Print → Save as PDF
4. Settings: Letter size, normal margins
5. Output: ATS-optimized PDF ready for submission
```

## Validation and Testing

### HTML Validation
- Valid HTML5 structure
- Proper semantic markup
- Print-friendly CSS
- Cross-browser compatibility

### ATS Testing Checklist
- [ ] Single-column layout verified
- [ ] Contact info in body text
- [ ] Standard section headings used
- [ ] Keyword density 1-3%
- [ ] Plain text URLs included
- [ ] Print preview shows proper layout

### Quality Metrics
- **ATS Compatibility**: 65-75% target match rate
- **Readability**: 6-8 second scan for key info
- **Content Density**: Maximum relevant information
- **Visual Appeal**: Professional presentation
- **Print Quality**: Clean PDF output

## 2-Page PDF Optimization Techniques

### HTML Structure Adaptations

**Page Container & Margins:**
```css
@page {
    size: Letter;
    margin: 0.5in 0.4in;  /* Top/bottom: breathing room, sides: content space */
}

body {
    margin: 0;
    padding: 0;
    max-width: none;  /* Remove content width restrictions */
}

.page-container {
    width: 100%;
    max-width: 7.5in;  /* Optimize for print width */
    margin: 0 auto;
}
```

**Strategic Spacing System:**
```css
/* Section spacing hierarchy */
.section { margin-bottom: 12px; }      /* Major sections */
.job { margin-bottom: 10px; }         /* Job entries */
.project { margin-bottom: 8px; }      /* Projects (condensed) */
.job-bullets li { margin-bottom: 3px; } /* Bullet spacing */

/* Strategic page break placement */
.page-break {
    page-break-before: always;
    break-before: page;
}
```

**Content Condensation Strategy:**
- **Projects**: Convert 2-3 bullet points → 1 comprehensive sentence
- **Font Sizing**: 9pt base with 8.5pt for job bullets, 8pt for projects
- **Line Heights**: 1.2 for readability without waste
- **Selective Content**: Maintain full work experience, condense supplementary sections

### CSS Template Modifications Required

**1. Replace Project Bullets with Summary:**
```css
/* Old format */
.project-bullets {
    margin: 0; padding-left: 14px;
}
.project-bullets li {
    margin-bottom: 2px; font-size: 8pt;
}

/* New format */
.project-summary {
    font-size: 8pt;
    line-height: 1.3;
    text-align: justify;
    margin: 2px 0 0 0;
}
```

**2. Optimize Print CSS:**
```css
@media print {
    body { margin: 0; padding: 0; }
    .section, .job, .project {
        page-break-inside: avoid;
        break-inside: avoid;
    }
}
```

### PDF Generation Settings

**Puppeteer Configuration:**
```javascript
await page.pdf({
    path: pdfFile,
    format: 'Letter',
    margin: {
        top: '0.5in',    // Header breathing room
        right: '0.4in',  // Maximize content width
        bottom: '0.5in', // Footer breathing room
        left: '0.4in'    // Maximize content width
    },
    printBackground: true,      // Preserve styling
    preferCSSPageSize: true,    // Use CSS @page rules
    displayHeaderFooter: false  // Clean output
});
```

### Content Optimization Rules

**Project Section Strategy:**
1. **Keep Core Impact**: Maintain key metrics and technologies
2. **Merge Related Points**: Combine similar functionality descriptions
3. **Technical Emphasis**: Preserve `<span class="tech">` and `<span class="metric">` highlighting
4. **One-Sentence Rule**: Each project = 1 comprehensive sentence covering scope, tech, and outcome

**Space Allocation Balance:**
- **Work Experience**: 60% (detailed X→Y→Z bullets)
- **Projects**: 25% (concise one-liners)
- **Other Sections**: 15% (skills, education, publications)

**Page Break Strategy:**
- Page 1: Header + Summary + Skills + First 5 jobs
- Page 2: Remaining 1 job + All projects + Publications + Education
- Strategic break after Torre B2B role for clean page division