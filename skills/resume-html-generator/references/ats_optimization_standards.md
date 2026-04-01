# ATS Optimization Standards

## Target Compatibility
**Goal**: 65-75% ATS match rates for top Silicon Valley companies

## HTML Structure Requirements

### Semantic HTML
- Use proper heading hierarchy: `<h1>` for name, `<h2>` for sections
- Structure content with meaningful tags: `<section>`, `<div class="job">`, `<ul class="job-bullets">`
- Maintain logical document flow for screen readers and parsers

### Single-Column Layout
- **Never use**: Tables, multiple columns, text boxes, or complex layouts
- **Always use**: Single-column, top-to-bottom flow
- **Flexbox**: Only for horizontal alignment (job title + dates)
- **Grid**: Only for simple two-column layouts (school name + year)

### Typography Standards
- **Primary fonts**: Arial, Calibri, Helvetica, Times New Roman
- **Font sizes**:
  - Name: 20-24pt
  - Section headers: 10.5-12pt
  - Body text: 9-11pt
  - Supporting text: 8-10pt
- **Font weights**: Normal, bold only (avoid light, thin, heavy)

### Contact Information
- **Location**: Must be in document body, never in headers/footers
- **Format**: Plain text only, no special formatting
- **Links**: Include full URLs in plain text format
- **Phone**: Include country code: +1234567890
- **Email**: Standard format: name@domain.com

## CSS Guidelines

### Print-Friendly Styles
```css
@page {
    margin: 0.45in;
    size: A4;
}

@media print {
    body {
        font-size: 10.5pt;
    }
    .section {
        page-break-inside: avoid;
        break-inside: avoid;
    }
}
```

### Page Break Control
- Use `page-break-inside: avoid` for job entries and projects
- Strategic page breaks to maintain readability
- Ensure proper content flow across pages

### Color Usage
- **Safe colors**: Black (#000), dark gray (#333), blue links (#0066cc)
- **Avoid**: Bright colors, gradients, background colors in print
- **Print fallback**: Ensure all text remains readable in black and white

## Content Formatting

### Section Headers
- **Standard names**: Professional Summary, Core Skills, Work Experience, Education
- **Avoid**: Creative names like "About Me", "Expertise", "Career Journey"
- **Format**: ALL CAPS with consistent styling
- **Separation**: Horizontal rules or consistent spacing

### Experience Sections
- **Company name**: Bold, prominent
- **Job title**: Italics or regular weight, distinct from company
- **Dates**: Consistent format (Jan 2023 – Present)
- **Location**: Include city, state/country
- **Bullets**: Simple bullets (•), consistent formatting

### Skills Section
- **Format**: Comma-separated list or simple categories
- **Length**: 15-25 total skills for optimal parsing
- **Order**: Most important/relevant first
- **Avoid**: Skill levels, ratings, complex categorization

## Keyword Optimization

### Strategic Placement
1. **Professional Summary**: 3-5 priority keywords
2. **Core Skills**: 15-25 relevant skills/technologies
3. **Experience bullets**: Naturally integrated keywords
4. **Project descriptions**: Supporting technologies

### Keyword Density
- **Target range**: 1-3% of total document
- **Natural integration**: Keywords must read naturally
- **Avoid stuffing**: >4% density flags as spam

### High-Value Keywords (2026)
- **Programming**: Python, TypeScript, JavaScript, Go, Java
- **AI/ML**: Claude Agent SDK, MCP Protocol, LLMs, Machine Learning
- **Cloud**: Kubernetes, Docker, AWS, Azure, Google Cloud
- **Frameworks**: React, Next.js, FastAPI, Node.js
- **Data**: PostgreSQL, MongoDB, Redis, Data Pipelines
- **Product**: Product Engineering, Growth Engineering, A/B Testing

## File Format Requirements

### Primary Format
- **HTML**: Semantic, valid HTML5
- **Conversion**: Optimized for browser print-to-PDF
- **Fallback**: Plain text readable version

### PDF Generation
- **Source**: Browser print (Cmd+P → Save as PDF)
- **Settings**: Letter/A4 size, normal margins
- **Quality**: High resolution, embedded fonts
- **Accessibility**: Selectable text, proper structure

## Validation Checklist

### Structure Validation
- [ ] Single-column layout verified
- [ ] Contact info in body text
- [ ] Standard section headings used
- [ ] Consistent date formatting
- [ ] Plain text URLs included

### Content Validation
- [ ] 15-25 keywords in Skills section
- [ ] X→Y→Z format for experience bullets
- [ ] Quantified achievements included
- [ ] No marketing buzzwords
- [ ] Technical accuracy verified

### Formatting Validation
- [ ] Print preview shows proper layout
- [ ] All text selectable in PDF
- [ ] No content cut off or overlapping
- [ ] Consistent fonts and sizes
- [ ] Proper page breaks

## ATS Testing

### Automated Testing
- **Tools**: Jobscan.io, ResumeWorded, TopResume
- **Target**: 65-75% match rate with job descriptions
- **Frequency**: Test each variant before deployment

### Manual Testing
1. **Copy-paste test**: Paste resume into plain text editor
2. **Format preservation**: Verify structure remains intact
3. **Keyword extraction**: Confirm keywords are easily identifiable
4. **Readability**: 6-8 second scan for key information

### Common Issues to Avoid
- Headers/footers (content gets lost)
- Tables and columns (content scrambled)
- Special characters (parsing errors)
- Images/graphics (completely ignored)
- Complex formatting (text boxes, borders, shading)