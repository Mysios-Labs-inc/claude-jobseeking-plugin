---
name: job-application-qa
description: Generate tailored responses for job application questionnaires using your profile data and experience portfolio. Handles technical PM questions, product management scenarios, AI/ML experience queries, and creates comprehensive application packages with portfolio links and skills checklists.
---

# Job Application Q&A Generator

Generate tailored, authentic responses for job application questionnaires using your stored profile data and experience portfolio. Specializes in technical product management roles, AI/ML positions, and startup environments.

## 🎯 Core Capabilities

### **Response Generation**
- Technical PM scenario questions (prioritization, trade-offs, metrics)
- AI/ML product experience (conversational AI, agent design, evaluation)
- Product engineering hybrid role positioning
- Startup founder experience translation to corporate roles
- Multi-armed bandit and experimentation methodology

### **Experience Translation**
- Startup experience → Corporate role requirements
- Technical implementation → Product management value
- Bootstrap constraints → Resource management skills
- Multi-domain projects → Transferable insights

### **Application Package Creation**
- Complete Q&A response sets
- Skills checklists for specific roles
- Portfolio link curation
- Work sample recommendations
- Technical differentiator highlighting

## 📋 Supported Question Types

### **Product Management Experience**
- Years of PM experience with AI/ML products
- End-to-end product ownership examples
- Hardest prioritization decisions and reasoning
- Cross-functional team leadership
- User research and validation methodologies

### **AI/ML Product Expertise**
- Conversational AI vs traditional UI decision frameworks
- AI agent performance measurement and failure signals
- Human-in-the-loop design patterns
- Prompt engineering and evaluation processes
- Model deployment and monitoring strategies

### **Technical Implementation**
- Rapid prototyping with AI tools (Claude, Cursor, v0)
- Weekend-to-production development cycles
- Technical debt vs feature velocity trade-offs
- Architecture decisions for scalability
- API design and system integration

### **Strategic Thinking**
- Market timing and business model validation
- User value vs monetization prioritization
- Product-market fit indicators
- Competitive analysis and positioning
- Growth strategy and metric optimization

## 🚀 Usage Patterns

### **Single Role Application**
```
/job-application-qa --role "AI Product Manager" --company "Ontop" 
--url "company-job-posting-url"

Generate complete application with:
- Tailored responses using relevant experience
- Skills checklist for role requirements  
- Portfolio work samples selection
- Strategic positioning for company culture
```

### **Multiple Role Preparation**
```
/job-application-qa --batch --roles "AI PM,Technical PM,Product Engineer"

Create response library covering:
- Core PM experience base
- Role-specific technical depth
- Transferable skill highlighting
- Company-agnostic positioning
```

### **Experience Portfolio Update**
```
/job-application-qa --update-portfolio --project "new-project-name"

Add new project to experience database:
- Technical implementation details
- Product impact metrics
- User feedback and validation
- Cross-functional collaboration examples
```

## 📊 Experience Database Integration

### **Project Portfolio**
- **BuscaTuPepa**: Medicine search with OCR, prioritization decisions
- **ChapaTuCandidato**: Political engagement with AI/RAG, rapid deployment
- **HablaDoc**: Telemedicine with conversational AI, medical validation
- **Fudis**: Restaurant CRM with WhatsApp agents, personalization
- **florece.ai**: E-commerce with hybrid chat/web interface design

### **Technical Methodologies**
- Multi-armed bandit optimization (Torre experience)
- Weekend-to-production deployment cycles
- Pareto-efficient development (80/20 approach)
- Human-in-the-loop validation systems
- Bootstrap resource management

### **Product Engineering Skills**
- Full-stack technical implementation
- AI/ML model integration and deployment
- Rapid prototyping with Claude + FastAPI
- Production system architecture
- User research to technical specification translation

## 🔧 Response Framework

### **Storytelling Structure**
```
1. Context: Project/company background and constraints
2. Challenge: Specific problem or decision faced
3. Decision: Action taken with clear reasoning
4. Outcome: Measurable results and lessons learned
5. Transferable Insight: How this applies to target role
```

### **Technical Depth Calibration**
- **High-Level**: Business impact and strategic decisions
- **Medium-Level**: Technical approach and trade-offs  
- **Deep-Level**: Implementation details and system architecture
- **Meta-Level**: Process improvements and methodology

### **Authenticity Markers**
- Real metrics from actual projects
- Genuine constraint acknowledgment (bootstrap, timing)
- Honest outcome reporting (successes and pauses)
- Technical implementation specifics
- Cross-domain learning application

## 📝 Output Templates

### **Complete Application Package**
```markdown
# [Company] [Role] Application

## Application Responses
[Q1-Q6 with tailored answers]

## Skills Checklist
- [x] Skill 1: Demonstrated in Project X
- [x] Skill 2: Proven through Experience Y

## Portfolio Links
- Primary: [Most relevant project URL]
- Secondary: [Supporting work examples]

## Technical Differentiators
- Product Engineer hybrid capability
- Rapid deployment methodology
- Multi-domain AI experience
```

### **Response Quality Standards**
- **Authentic**: Real experience, honest constraints
- **Specific**: Concrete examples with metrics
- **Relevant**: Tailored to role requirements
- **Conversational**: Natural tone, not corporate speak
- **Technical**: Appropriate depth for audience

## 🎯 Strategic Positioning

### **Unique Value Propositions**
- **Product Engineer**: "I walk both ways - can spec it and build it"
- **Rapid Deployment**: Weekend-to-production methodology
- **AI/ML Experience**: 3+ years across multiple domains
- **Constraint Management**: Bootstrap experience translates to resource efficiency
- **User-First Approach**: Proven prioritization of value over monetization

### **Experience Translation**
- Startup Founder → Product Leadership
- Technical Implementation → Engineering Collaboration
- Bootstrap Constraints → Resource Optimization
- Multi-domain Projects → Adaptability and Learning
- Rapid Prototyping → Speed to Market

### **Differentiator Emphasis**
- Multi-armed bandit testing experience
- Conversational AI design across domains
- Human-in-the-loop system implementation
- Real user validation over assumption-based development
- Technical depth enabling better product decisions

## 🔄 Integration Points

### **Profile Setup Integration**
- Pulls from stored profile data automatically
- Updates experience database with new projects
- Maintains consistent personal brand across applications

### **Resume Generator Sync**
- Ensures resume and application responses align
- Uses same project descriptions and metrics
- Maintains technical skill consistency

### **Portfolio Management**
- Curates work samples for specific roles
- Updates project URLs and descriptions
- Tracks application submission history

This skill transforms your raw experience into compelling, role-specific narratives that demonstrate both technical depth and product thinking - essential for modern AI/ML product management positions.