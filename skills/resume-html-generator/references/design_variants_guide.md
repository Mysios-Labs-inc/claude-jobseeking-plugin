# Resume Design Variants Guide

## Variant Selection Matrix

| Variant | Best For | ATS Score | Visual Appeal | Density |
|---------|----------|-----------|---------------|---------|
| Corporate Clean | Traditional industries, conservative companies | 95% | Medium | Medium |
| Modern Professional | Mid-size companies, professional services | 85% | High | Medium |
| Silicon Valley Minimal | Tech startups, creative roles | 80% | Very High | Low |
| Refined Professional ⭐ | All industries, proven format | 90% | High | Very High |

## Corporate Clean

### Design Philosophy
- Maximum ATS compatibility with subtle visual hierarchy
- Conservative professional styling that works in any industry
- Traditional layout that recruiters expect and trust

### Key Features
- **Typography**: Times New Roman headers, Calibri/Arial body
- **Colors**: Black text, gray accents, minimal color usage
- **Layout**: Traditional sections with horizontal rules
- **Headers**: Bold, uppercase section titles with underlines
- **Contact**: Centered header with clear separation

### CSS Characteristics
```css
.section-title {
    font-size: 12pt;
    font-weight: bold;
    text-transform: uppercase;
    border-bottom: 1px solid #cccccc;
}

.name {
    font-size: 20pt;
    text-transform: uppercase;
    letter-spacing: 1px;
}
```

### Use Cases
- Finance, consulting, law, healthcare
- Large corporations and traditional industries
- Conservative company cultures
- Maximum ATS compatibility required

## Modern Professional

### Design Philosophy
- Contemporary design balancing visual appeal with professionalism
- Strategic use of color and modern typography
- Professional card-style layout with enhanced readability

### Key Features
- **Typography**: Source Sans Pro/Segoe UI system fonts
- **Colors**: Blue accent colors (#3498db), strategic highlighting
- **Layout**: Card-style job entries with modern spacing
- **Skills**: Categorized layout with labels
- **Summary**: Highlighted box with background color

### CSS Characteristics
```css
.section-title::before {
    content: '';
    width: 3px;
    background: #3498db;
    position: absolute;
    left: -2px;
}

.bullet::before {
    content: "▸";
    color: #3498db;
}
```

### Use Cases
- Technology companies, agencies, consulting
- Mid-size companies with modern cultures
- Roles requiring design sensibility
- Professional services targeting millennials/Gen Z

## Silicon Valley Minimal

### Design Philosophy
- Ultra-clean minimal design with strategic color usage
- Tech-forward aesthetic optimized for startup environments
- Modern typography with emphasis on metrics and technology

### Key Features
- **Typography**: Inter, SF Pro Display system fonts
- **Colors**: Purple primary (#6366f1), orange AI highlights (#f59e0b)
- **Layout**: Grid-based with generous whitespace
- **Skills**: Chip-style tags with color coding
- **Metrics**: Color-coded highlighting for numbers and tech

### CSS Characteristics
```css
.skill-primary {
    background: #6366f1;
    color: white;
    border-radius: 12px;
    padding: 4px 10px;
}

.metric-highlight {
    color: #059669;
    font-weight: 600;
}

.tech-highlight {
    color: #6366f1;
    font-weight: 500;
}
```

### Use Cases
- Startups, tech companies, creative agencies
- Product manager, designer, developer roles
- Companies with modern, innovative cultures
- Silicon Valley and tech hub applications

## Refined Professional ⭐ (Recommended)

### Design Philosophy
- Based on proven resume layouts with maximum content density
- Balances traditional professionalism with modern optimization
- Compact design that maximizes information while maintaining readability

### Key Features
- **Typography**: Times New Roman headers, system font body
- **Colors**: Black primary, strategic bold highlighting for metrics/tech
- **Layout**: Compact, dense information layout
- **Density**: Maximum content in minimal space (9pt base font)
- **Emphasis**: Bold highlighting for metrics and key technologies

### CSS Characteristics
```css
body {
    font-size: 9pt;
    line-height: 1.15;
    margin: 0.45in;
}

.metric {
    font-weight: 600;
}

.tech {
    font-weight: 500;
}

.section-rule {
    border-top: 1px solid #ccc;
}
```

### Use Cases
- **Universal application**: Works across all industries
- **Proven effectiveness**: Based on successful resume formats
- **Content-rich roles**: Senior positions with extensive experience
- **ATS + Human optimal**: Best balance of machine and human readability

## Selection Criteria

### By Industry
- **Finance/Law/Healthcare**: Corporate Clean or Refined Professional
- **Technology/Startups**: Silicon Valley Minimal or Refined Professional
- **Consulting/Agencies**: Modern Professional or Refined Professional
- **Government/Non-profit**: Corporate Clean
- **Creative Industries**: Silicon Valley Minimal or Modern Professional

### By Role Level
- **Entry Level**: Modern Professional (visual appeal)
- **Mid Level**: Any variant based on industry
- **Senior/Executive**: Refined Professional (content density)
- **Technical Roles**: Silicon Valley Minimal or Refined Professional

### By Application Method
- **ATS Systems**: Corporate Clean or Refined Professional
- **Direct Email**: Any variant
- **Portfolio/Website**: Silicon Valley Minimal or Modern Professional
- **Print/PDF**: All variants optimized for print

## Customization Guidelines

### Color Adaptation
- **Corporate**: Maintain conservative color palette
- **Modern**: Adjust accent colors to match company branding
- **Minimal**: Swap color scheme while maintaining contrast
- **Refined**: Add subtle color for company-specific customization

### Content Adaptation
- **Skills Highlighting**: Adjust based on job requirements
- **Section Ordering**: Prioritize relevant sections first
- **Metric Emphasis**: Highlight most relevant achievements
- **Technology Focus**: Emphasize tech stack matching job needs

### Layout Modifications
- **Page Breaks**: Adjust for optimal 2-page layout
- **Spacing**: Fine-tune for content density needs
- **Font Sizes**: Minor adjustments for readability vs. density
- **Section Sizing**: Expand/contract based on content strength