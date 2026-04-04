// Job Application Q&A Response Generator
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export class JobApplicationGenerator {
    constructor() {
        this.experienceDB = this.loadExperienceDatabase();
        this.responseTemplates = this.loadResponseTemplates();
    }

    loadExperienceDatabase() {
        return {
            projects: {
                buscatupepa: {
                    name: "BuscaTuPepa",
                    url: "https://buscatupepa.com",
                    year: "2024",
                    description: "Medicine search platform with AI-powered OCR for handwritten prescriptions",
                    keyMetrics: "89% prescription recognition accuracy, 300% user growth",
                    challenge: "Monetization vs user value prioritization under bootstrap constraints",
                    outcome: "Proved product-market fit but paused due to market timing"
                },
                chapatucandidato: {
                    name: "ChapaTuCandidato",
                    url: "https://chapatucandidato.com",
                    year: "2026",
                    description: "Political engagement platform for Peru's 2026 elections with AI-powered RAG system",
                    keyMetrics: "Weekend-to-production deployment, real voter engagement by week 2",
                    challenge: "Complex political information accessibility",
                    outcome: "Validated conversational AI for complex information consumption"
                },
                habladoc: {
                    name: "HablaDoc",
                    url: "https://habladoc.com",
                    year: "2025",
                    description: "WhatsApp-based telemedicine platform with AI medical assistant",
                    keyMetrics: "92% diagnostic accuracy, ICD-11 integration",
                    challenge: "Medical handwriting OCR vs diagnostic accuracy prioritization",
                    outcome: "Built medical professional trust through accuracy-first approach"
                },
                fudis: {
                    name: "Fudis",
                    url: "https://fudis.app",
                    year: "2026",
                    description: "FoodTech CRM with AI conversational agents on WhatsApp",
                    keyMetrics: "95% task completion rates for restaurant orders",
                    challenge: "Conversational AI for food orders requiring context and preferences",
                    outcome: "Proved value of conversation for complex, personalized transactions"
                },
                florece: {
                    name: "florece.ai",
                    year: "2025",
                    description: "Flower delivery with hybrid conversational/web interface",
                    keyMetrics: "88% personalization relevance",
                    challenge: "When to use conversation vs traditional UI",
                    outcome: "Established framework: conversation for exploration, UI for transactions"
                }
            },
            methodologies: {
                multiArmedBandit: {
                    context: "Torre cold email campaigns",
                    result: "40% conversion rate improvement",
                    application: "Dynamic traffic allocation to highest-performing variants"
                },
                weekendToProduction: {
                    context: "ChapaTuCandidato deployment",
                    process: "Build on weekend → Production by following week → Real user feedback",
                    advantage: "Rapid validation over assumption-based development"
                },
                paretoEfficiency: {
                    principle: "80% of value from 20% of work",
                    application: "Focus on core user problems before feature expansion",
                    examples: "OCR accuracy before monetization, diagnostic accuracy before scope expansion"
                }
            },
            skills: {
                productEngineering: "Can both spec and build - technical execution capability",
                rapidPrototyping: "Claude + FastAPI for production-ready MVPs in days",
                conversationalAI: "Cross-domain experience: healthcare, politics, food tech, e-commerce",
                humanInLoop: "Medical validation, prescription OCR correction, content moderation",
                agenticArchitecture: "MCP integration, autonomous social media management",
                crossDomainLearning: "Healthcare → Politics → Food Tech → E-commerce pattern recognition"
            }
        };
    }

    generateResponse(questionType, context = {}) {
        const templates = {
            experienceYears: () => this.generateExperienceResponse(context),
            endToEndProduct: () => this.generateEndToEndResponse(context),
            conversationalAI: () => this.generateConversationalAIResponse(context),
            aiAgentMetrics: () => this.generateMetricsResponse(context),
            rapidPrototyping: () => this.generatePrototypingResponse(context),
            first30Days: () => this.generateFirst30DaysResponse(context)
        };

        return templates[questionType] ? templates[questionType]() : null;
    }

    generateExperienceResponse(context) {
        return `5+ years total product management experience since 2021, with 3+ years specifically leading AI/ML-powered products. My first major AI product was BuscaTuPepa in 2024 - a medicine search platform with AI-powered OCR for handwritten prescriptions. Since then I've launched agentic platforms including Fudis (AI conversational agents for restaurants), HablaDoc (AI medical assistant), and ChapaTuCandidato (political engagement platform for Peru's 2026 elections).`;
    }

    generateEndToEndResponse(context) {
        const project = context.project || 'buscatupepa';
        const projectData = this.experienceDB.projects[project];

        return `I led ${projectData.name} from concept to production - ${projectData.description}. ${projectData.challenge}. I chose to prioritize ${context.prioritization || 'core user value'} first, achieving ${projectData.keyMetrics}. ${projectData.outcome}. The decision validated that ${context.lesson || 'user value creation enables sustainable business models'}.`;
    }

    generateConversationalAIResponse(context) {
        return `Conversational AI excels when information is complex and users need guidance. In ChapaTuCandidato, we used conversational interfaces for political information because nobody reads full government plans - users could ask 'What does candidate X propose for healthcare?' and get digestible comparisons. In florece.ai, we used a hybrid approach: conversational AI on WhatsApp for the shopping experience and personalization (because flower selection benefits from dialogue about occasion, preferences, budget), but traditional web app for checkout and order management (because users want quick, visual confirmation of their order details and delivery tracking). The key insight: use conversation for exploration and personalization, traditional UI for transactional efficiency. Match the interface to the cognitive load - high-context decisions need conversation, low-context transactions need speed.`;
    }

    generateMetricsResponse(context) {
        return `I've learned to watch both the technical side and what users actually experience. On the technical side, I track things like how often the AI gets it right, how fast it responds, and whether it's getting worse over time - you know, the usual suspects. But honestly, the business metrics tell you more about what's really happening: are people actually completing their tasks? Are they coming back? Are they frustrated? The red flags I watch for are when people start doing more manual work to fix what the AI messed up, or when you see patterns like users abandoning sessions or repeatedly asking the same thing different ways. That usually means something's broken before your technical metrics even catch it. Each domain has its quirks, but frustrated users behave pretty similarly whether they're trying to find medicine or pick flowers - they just give up and find another way.`;
    }

    generatePrototypingResponse(context) {
        const project = context.project || 'chapatucandidato';
        const projectData = this.experienceDB.projects[project];

        return `I used Claude and FastAPI to build ${projectData.name}'s AI-powered system over one weekend, then launched it to real users the following week. Built complete ${context.technical || 'RAG workflows'} using Claude for ${context.aiRole || 'processing government plans'} and FastAPI for ${context.backend || 'document ingestion and query routing'}. My approach is to build production-ready MVPs fast and iterate based on real user feedback. By week two, ${context.users || 'actual voters'} were ${context.usage || 'asking questions and getting sourced answers from government documents'}. This rapid production deployment validated that ${context.validation || 'voters would engage with political content when it was digestible and conversational'}. The weekend-to-production approach let me learn from real usage immediately and adapt the product based on actual user behavior rather than assumptions.`;
    }

    generateFirst30DaysResponse(context) {
        return `Week 1: I'd dig into the actual product and talk to real users - not just read reports, but use the platform myself and watch user sessions to understand where people get frustrated. Week 2: Sit with engineering to understand the current tech stack, what's possible with existing infrastructure, and what would require major changes. Week 3: Build something small but real - probably a quick AI feature that solves an obvious pain point I found in week 1, get it in front of users fast. Week 4: Based on what I learned from that experiment, map out which AI opportunities actually move the needle vs. which are just cool tech demos. I'd apply the same Pareto-efficient approach I've used across my products - 80% of the value from 20% of the work. Whether it was multi-armed bandit testing at Torre, weekend-to-production launches like ChapaTuCandidato, or the user-first prioritization that drove BuscaTuPepa's growth. As a product engineer, I walk both ways - I can spec it and build it. This is the way.`;
    }

    generateApplicationPackage(roleData) {
        const packageContent = {
            position: roleData.title,
            company: roleData.company,
            url: roleData.url,
            responses: {},
            skillsChecklist: this.generateSkillsChecklist(roleData.requiredSkills),
            portfolioLinks: this.selectPortfolioLinks(roleData.focus),
            differentiators: this.generateDifferentiators()
        };

        // Generate responses based on question types
        if (roleData.questions) {
            roleData.questions.forEach((q, index) => {
                packageContent.responses[`Q${index + 1}`] = {
                    question: q.text,
                    response: this.generateResponse(q.type, q.context || {})
                };
            });
        }

        return packageContent;
    }

    generateSkillsChecklist(requiredSkills) {
        const skillMapping = {
            'Conversational AI / Agent Design': 'Fudis WhatsApp agents, ChapaTuCandidato Q&A, HablaDoc medical assistant',
            'LLM Product Management': '3+ years AI/ML products with metrics and user focus',
            'Prompt Engineering & Evals': 'Claude integration across all platforms, rapid prototyping',
            'Human-in-the-Loop Design': 'Medical validation, prescription OCR, personalization feedback',
            'MCP / Agentic Architectures': 'Social media manager plugin, autonomous system design',
            'Product Analytics': 'Technical and business metrics across healthcare, politics, food tech',
            'Vibecoding / AI Prototyping': 'Weekend-to-production methodology with Claude + FastAPI',
            'Executive Stakeholder Communication': 'Bootstrap constraint management, prioritization decisions'
        };

        return requiredSkills.map(skill => ({
            skill,
            checked: true,
            evidence: skillMapping[skill] || 'Cross-platform experience and proven methodology'
        }));
    }

    selectPortfolioLinks(focus) {
        const focusMapping = {
            'ai': 'chapatucandidato',
            'conversational': 'fudis',
            'healthcare': 'habladoc',
            'rapid': 'chapatucandidato',
            'default': 'chapatucandidato'
        };

        const primary = this.experienceDB.projects[focusMapping[focus] || focusMapping.default];
        return {
            primary: {
                url: primary.url,
                description: primary.description
            },
            secondary: Object.values(this.experienceDB.projects)
                .filter(p => p.url && p !== primary)
                .slice(0, 2)
        };
    }

    generateDifferentiators() {
        return [
            'Product Engineer: Can both spec and build - technical execution capability',
            'Rapid MVP Approach: Weekend-to-production deployment methodology',
            'Cross-Domain Experience: Healthcare, politics, food tech, e-commerce',
            'Pareto Efficiency Focus: 80% value from 20% work philosophy',
            'Real User Validation: Production-first learning vs prototype assumptions',
            'Multi-armed Bandit Optimization: Proven conversion improvement (40% at Torre)'
        ];
    }

    saveApplicationPackage(packageData, filename) {
        const content = this.formatApplicationMarkdown(packageData);
        writeFileSync(resolve(filename), content);
        return filename;
    }

    formatApplicationMarkdown(packageData) {
        let markdown = `# ${packageData.company} ${packageData.position} Application\n\n`;
        markdown += `**Position**: ${packageData.position}\n`;
        markdown += `**Company**: ${packageData.company}\n`;
        markdown += `**URL**: ${packageData.url}\n`;
        markdown += `**Date**: ${new Date().toISOString().split('T')[0]}\n\n`;

        // Skills checklist
        markdown += `## Key Skills to Check ✅\n`;
        packageData.skillsChecklist.forEach(skill => {
            markdown += `- [${skill.checked ? 'x' : ' '}] ${skill.skill}\n`;
        });
        markdown += '\n';

        // Responses
        markdown += `## Application Responses\n\n`;
        Object.values(packageData.responses).forEach((resp, index) => {
            markdown += `### Q${index + 1}: ${resp.question}\n\n`;
            markdown += `"${resp.response}"\n\n`;
        });

        // Portfolio
        markdown += `## Work Sample\n\n`;
        markdown += `**Link**: ${packageData.portfolioLinks.primary.url}\n\n`;
        markdown += `**Description**: ${packageData.portfolioLinks.primary.description}\n\n`;

        // Differentiators
        markdown += `## Key Differentiators\n`;
        packageData.differentiators.forEach(diff => {
            markdown += `- ${diff}\n`;
        });

        return markdown;
    }
}

// Export for use in other modules
export default JobApplicationGenerator;