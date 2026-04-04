# Example: Ontop AI Product Manager Application

This is a complete example showing how the job-application-qa skill generates tailored responses for AI/ML product management roles.

## Role Configuration

```javascript
const ontopRole = {
    title: "AI Product Manager",
    company: "Ontop",
    url: "https://www.getontop.com/job-post/ai-product-manager",
    focus: "ai",
    requiredSkills: [
        "Conversational AI / Agent Design",
        "LLM Product Management",
        "Prompt Engineering & Evals",
        "Human-in-the-Loop Design",
        "MCP / Agentic Architectures",
        "Product Analytics",
        "Vibecoding / AI Prototyping",
        "Executive Stakeholder Communication"
    ],
    questions: [
        {
            type: "experienceYears",
            text: "How many years have you worked as a Product Manager, and how many of those have been leading AI or ML-powered products specifically?"
        },
        {
            type: "endToEndProduct",
            text: "Describe an AI product you've owned end-to-end. What was the hardest prioritization decision you faced, and how did you make it?",
            context: { project: "buscatupepa" }
        },
        {
            type: "conversationalAI",
            text: "How do you decide when conversational AI is the right interface and when it isn't? Give a concrete example."
        },
        {
            type: "aiAgentMetrics",
            text: "How would you define and measure whether an AI agent is working well in production? What signals would tell you it's failing?"
        },
        {
            type: "rapidPrototyping",
            text: "Tell us about a time you used vibecoding or AI-assisted tools (Claude, Cursor, v0, Figma Make or similar) to prototype or validate an idea. What did you build and what was the outcome?",
            context: { project: "chapatucandidato" }
        },
        {
            type: "first30Days",
            text: "If you were joining Ontop on day one as AI Product Manager, what would your first 30 days look like? What would you prioritize and why?"
        }
    ]
};
```

## Generated Application Package

### Skills Checklist ✅
- [x] **Conversational AI / Agent Design**: Fudis WhatsApp agents, ChapaTuCandidato Q&A, HablaDoc medical assistant
- [x] **LLM Product Management**: 3+ years AI/ML products with metrics and user focus
- [x] **Prompt Engineering & Evals**: Claude integration across all platforms, rapid prototyping
- [x] **Human-in-the-Loop Design**: Medical validation, prescription OCR, personalization feedback
- [x] **MCP / Agentic Architectures**: Social media manager plugin, autonomous system design
- [x] **Product Analytics**: Technical and business metrics across healthcare, politics, food tech
- [x] **Vibecoding / AI Prototyping**: Weekend-to-production methodology with Claude + FastAPI
- [x] **Executive Stakeholder Communication**: Bootstrap constraint management, prioritization decisions

### Application Responses

**Q1: Years of Experience**
"5+ years total product management experience since 2021, with 3+ years specifically leading AI/ML-powered products. My first major AI product was BuscaTuPepa in 2024 - a medicine search platform with AI-powered OCR for handwritten prescriptions. Since then I've launched agentic platforms including Fudis (AI conversational agents for restaurants), HablaDoc (AI medical assistant), and ChapaTuCandidato (political engagement platform for Peru's 2026 elections)."

**Q2: End-to-End Product Ownership**
"I led BuscaTuPepa from concept to production - a medicine search platform in Peru with AI-powered OCR for handwritten prescriptions. The hardest prioritization was between building monetization features (pharmacy commission system, premium search rankings) vs. core user value features like OCR for handwritten prescriptions. Being fully bootstrapped, we had immediate pressure to generate revenue, but users desperately needed the OCR since doctors write prescriptions by hand in Peru. I chose to build OCR first, achieving 89% prescription recognition accuracy and driving 300% user growth. However, we ultimately put the project on hold because the market timing wasn't right for that business model. The decision to prioritize user value over monetization was correct - we proved product-market fit for the core feature, but learned that timing matters as much as execution in healthcare markets."

### Work Sample
**Primary**: https://chapatucandidato.com - Political engagement platform for Peru's 2026 elections with candidate information system, voter engagement interface, and AI-powered political analysis.

### Key Differentiators
- Product Engineer: Can both spec and build - technical execution capability
- Rapid MVP Approach: Weekend-to-production deployment methodology  
- Cross-Domain Experience: Healthcare, politics, food tech, e-commerce
- Pareto Efficiency Focus: 80% value from 20% work philosophy
- Real User Validation: Production-first learning vs prototype assumptions
- Multi-armed Bandit Optimization: Proven conversion improvement (40% at Torre)

## Usage

```bash
# Generate this application package
const generator = new JobApplicationGenerator();
const package = generator.generateApplicationPackage(ontopRole);
generator.saveApplicationPackage(package, 'ontop-ai-pm-application.md');
```

This example demonstrates how the job-application-qa skill transforms raw experience into compelling, role-specific narratives that showcase both technical depth and product thinking essential for AI/ML product management positions.