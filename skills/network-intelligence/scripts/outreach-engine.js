#!/usr/bin/env bun

/**
 * Outreach Engine - Smart Communication Templates & Personalization
 * AI-powered outreach generation, timing optimization, and performance tracking
 */

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

class OutreachEngine {
  constructor(options = {}) {
    this.templates = this.initializeTemplates();
    this.timingData = this.initializeTimingData();
    this.config = {
      personalizationLevel: options.personalizationLevel || 'high',
      tonePreference: options.tonePreference || 'professional',
      ...options
    };
    this.outreachHistory = [];
  }

  async generateOutreach(contact, purpose, context = {}) {
    console.log(`📧 Generating outreach for: ${contact.name} (${purpose})`);

    const outreach = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      contact: contact,
      purpose: purpose,
      message: {},
      timing: {},
      personalization: {},
      tracking: {}
    };

    try {
      // Generate personalized message
      outreach.message = await this.generatePersonalizedMessage(contact, purpose, context);

      // Optimize timing
      outreach.timing = this.optimizeTiming(contact, purpose);

      // Score personalization
      outreach.personalization = this.scorePersonalization(outreach.message, contact);

      // Predict response probability
      outreach.tracking = {
        response_probability: this.predictResponseProbability(outreach),
        recommended_followup: this.generateFollowUpPlan(outreach),
        status: 'draft'
      };

      this.outreachHistory.push(outreach);

      console.log(`✅ Outreach generated with ${outreach.personalization.score}/100 personalization`);
      return outreach;
    } catch (error) {
      console.error('🚨 Outreach generation failed:', error.message);
      return this.generateFallbackOutreach(contact, purpose);
    }
  }

  async generatePersonalizedMessage(contact, purpose, context) {
    const template = this.selectTemplate(purpose);
    const personalizations = this.gatherPersonalizations(contact, context);

    const message = {
      subject: this.generateSubject(contact, purpose, personalizations),
      body: this.applyPersonalizations(template, contact, personalizations, context),
      closing: this.generateClosing(purpose),
      format: purpose === 'linkedin_post' ? 'post' : 'message'
    };

    return message;
  }

  selectTemplate(purpose) {
    return this.templates[purpose] || this.templates.general;
  }

  gatherPersonalizations(contact, context) {
    return {
      shared_connections: context.shared_connections || [],
      shared_experiences: context.shared_experiences || [],
      recent_activity: context.recent_activity || '',
      mutual_interests: context.mutual_interests || [],
      specific_project: context.specific_project || '',
      company_news: context.company_news || '',
      role_reference: context.target_role || ''
    };
  }

  generateSubject(contact, purpose, personalizations) {
    const subjects = {
      referral_request: [
        `Quick question about ${contact.company} — ${personalizations.role_reference || 'PM roles'}`,
        `Exploring opportunities at ${contact.company}`,
        `Your perspective on the ${contact.company} product team?`
      ],
      introduction_request: [
        `Would love an intro to your ${contact.company} connection`,
        `Quick favor — warm introduction request`,
        `Connecting the dots — ${contact.company}`
      ],
      informational_interview: [
        `15 min chat about ${contact.company} product culture?`,
        `Learning from your experience at ${contact.company}`,
        `Your insights on ${personalizations.mutual_interests[0] || 'AI product management'}`
      ],
      reconnection: [
        `Been a while — thought of you re: ${personalizations.recent_activity || 'AI products'}`,
        `Catching up + exciting update`,
        `Great seeing your recent work at ${contact.company}`
      ],
      thank_you: [
        `Thank you — really appreciated your time`,
        `Following up from our conversation`,
        `Grateful for the intro + quick update`
      ]
    };

    const options = subjects[purpose] || [`Reaching out — ${purpose}`];
    return options[Math.floor(Math.random() * options.length)];
  }

  applyPersonalizations(template, contact, personalizations, context) {
    let body = template.body;

    // Replace placeholders
    body = body.replace(/\{name\}/g, contact.name.split(' ')[0]);
    body = body.replace(/\{company\}/g, contact.company);
    body = body.replace(/\{title\}/g, contact.title);
    body = body.replace(/\{specific_project\}/g, personalizations.specific_project || 'your recent work');
    body = body.replace(/\{role_reference\}/g, personalizations.role_reference || 'product leadership roles');
    body = body.replace(/\{mutual_interest\}/g, personalizations.mutual_interests[0] || 'AI product strategy');
    body = body.replace(/\{company_news\}/g, personalizations.company_news || 'the exciting product developments');
    body = body.replace(/\{shared_context\}/g, personalizations.shared_experiences[0] || 'our shared interest in AI products');

    return body;
  }

  generateClosing(purpose) {
    const closings = {
      referral_request: 'Happy to work around your schedule. Thanks for considering!',
      introduction_request: 'No pressure at all — I appreciate your time either way.',
      informational_interview: 'Even a quick 15 minutes would be incredibly helpful. Thank you!',
      reconnection: 'Would love to catch up when you have a moment. Hope all is well!',
      thank_you: 'Really grateful for your generosity. Looking forward to staying in touch.'
    };

    return closings[purpose] || 'Looking forward to connecting. Best regards!';
  }

  optimizeTiming(contact, purpose) {
    const timingRecommendations = {
      best_day: this.getBestSendDay(purpose),
      best_time: this.getBestSendTime(purpose),
      avoid_days: ['Friday', 'Saturday', 'Sunday'],
      timezone_consideration: contact.timezone || 'US/Pacific',
      urgency_window: this.getUrgencyWindow(purpose)
    };

    return timingRecommendations;
  }

  getBestSendDay(purpose) {
    const dayMap = {
      referral_request: 'Tuesday',
      introduction_request: 'Wednesday',
      informational_interview: 'Tuesday',
      reconnection: 'Monday',
      linkedin_post: 'Tuesday or Thursday'
    };
    return dayMap[purpose] || 'Tuesday';
  }

  getBestSendTime(purpose) {
    const timeMap = {
      referral_request: '9:00-10:30 AM',
      introduction_request: '10:00-11:00 AM',
      informational_interview: '9:00-10:00 AM',
      reconnection: '8:30-10:00 AM',
      linkedin_post: '8:00 AM or 12:00 PM'
    };
    return timeMap[purpose] || '9:00-10:30 AM';
  }

  getUrgencyWindow(purpose) {
    const urgencyMap = {
      referral_request: 'Send within 48 hours of identifying opportunity',
      introduction_request: 'Send within 1 week of identifying bridge contact',
      informational_interview: 'Flexible — 1-2 week window',
      reconnection: 'Flexible — anytime',
      thank_you: 'Send within 24 hours of interaction'
    };
    return urgencyMap[purpose] || 'Within 1 week';
  }

  scorePersonalization(message, contact) {
    let score = 50; // Base score

    // Check for specific company mention
    if (message.body.includes(contact.company)) score += 10;

    // Check for role/title reference
    if (message.body.includes(contact.title) || message.body.includes(contact.company)) score += 10;

    // Check for specific project or news reference
    if (message.body.includes('specific') || message.body.includes('recent')) score += 10;

    // Check for mutual connection or shared context
    if (message.body.includes('shared') || message.body.includes('mutual')) score += 10;

    // Check for value proposition (not just asking)
    if (message.body.includes('insight') || message.body.includes('perspective') || message.body.includes('thought you')) score += 10;

    return {
      score: Math.min(100, score),
      rating: score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Fair' : 'Needs Improvement',
      improvement_suggestions: this.getPersonalizationImprovements(score, message, contact)
    };
  }

  getPersonalizationImprovements(score, message, contact) {
    const improvements = [];

    if (score < 70) improvements.push('Add a reference to a specific project or achievement of theirs');
    if (score < 80) improvements.push('Include a shared experience or mutual connection');
    if (score < 90) improvements.push('Reference recent company news or their recent content');

    return improvements;
  }

  predictResponseProbability(outreach) {
    let probability = 30; // Base probability

    // Adjust for relationship strength
    probability += (outreach.contact.relationship_strength || 0.3) * 30;

    // Adjust for personalization
    probability += (outreach.personalization.score / 100) * 20;

    // Adjust for purpose
    const purposeBonus = {
      referral_request: 10,
      informational_interview: 5,
      reconnection: 8,
      introduction_request: 3,
      thank_you: 15
    };
    probability += purposeBonus[outreach.purpose] || 0;

    return Math.min(95, Math.round(probability));
  }

  generateFollowUpPlan(outreach) {
    return {
      first_followup: {
        timing: '5 days after initial send',
        approach: 'Gentle bump with additional value',
        template: `Hi {name}, just circling back on my note from last week. Also wanted to share {relevant_content} — thought you might find it interesting regardless. Hope to connect!`
      },
      second_followup: {
        timing: '10 days after initial send',
        approach: 'Final touch with different angle',
        template: `Hi {name}, I know things get busy! If the timing isn't right, totally understand. I'll keep following your work at {company} — always learning from what your team ships.`
      },
      max_followups: 2,
      grace_period: 'Stop outreach if no response after 2 follow-ups'
    };
  }

  async generateBatchOutreach(contacts, purpose, context = {}) {
    console.log(`📧 Generating batch outreach for ${contacts.length} contacts...`);

    const results = [];

    for (const contact of contacts) {
      const outreach = await this.generateOutreach(contact, purpose, context);
      results.push(outreach);
    }

    // Generate outreach schedule
    const schedule = this.generateOutreachSchedule(results);

    console.log('✅ Batch outreach generation complete!');

    return { outreach_messages: results, schedule: schedule };
  }

  generateOutreachSchedule(outreachList) {
    const schedule = [];
    let dayOffset = 0;

    outreachList.forEach((outreach, index) => {
      // Max 3 outreach messages per day
      if (index > 0 && index % 3 === 0) dayOffset++;

      schedule.push({
        day: dayOffset + 1,
        contact: outreach.contact.name,
        purpose: outreach.purpose,
        best_time: outreach.timing.best_time,
        response_probability: outreach.tracking.response_probability
      });
    });

    return schedule;
  }

  async generateLinkedInContent(topic, contentType = 'post', context = {}) {
    console.log(`📝 Generating LinkedIn ${contentType}: ${topic}`);

    const contentTemplates = {
      post: this.generateLinkedInPost(topic, context),
      article: this.generateLinkedInArticle(topic, context),
      comment: this.generateLinkedInComment(topic, context)
    };

    const content = contentTemplates[contentType] || contentTemplates.post;

    return {
      content: content,
      timing: {
        best_post_day: 'Tuesday or Thursday',
        best_post_time: '8:00 AM or 12:00 PM',
        engagement_prediction: 'High' // Simplified prediction
      },
      hashtags: this.generateRelevantHashtags(topic),
      engagement_tips: [
        'Ask a question at the end to encourage comments',
        'Tag 2-3 relevant people for visibility',
        'Respond to every comment within 4 hours',
        'Share in relevant LinkedIn groups'
      ]
    };
  }

  generateLinkedInPost(topic, context) {
    return `One thing I've learned about ${topic}:

The conventional wisdom says [common belief]. But after [your experience], I've found the opposite is often true.

Here's what actually works:

1. [Specific insight with supporting evidence]
2. [Practical framework or methodology]
3. [Unexpected outcome or counterintuitive result]

The key takeaway? [Compelling summary].

What's been your experience with ${topic}?

${this.generateRelevantHashtags(topic).map(h => '#' + h).join(' ')}`;
  }

  generateLinkedInArticle(topic, context) {
    return `# ${topic}: What I Learned from [Experience]\n\n[Opening hook that challenges assumptions]\n\n## The Problem\n[Define the challenge clearly]\n\n## What I Tried\n[Specific approaches with context]\n\n## What Actually Worked\n[Results with metrics]\n\n## Key Takeaways\n1. [Insight 1]\n2. [Insight 2]\n3. [Insight 3]\n\n## What's Next\n[Call to action or question for engagement]`;
  }

  generateLinkedInComment(topic, context) {
    return `Great perspective on ${topic}. In my experience at [company], we found that [specific insight]. The key was [actionable detail]. Would love to hear how others have approached this.`;
  }

  generateRelevantHashtags(topic) {
    const topicHashtags = {
      'ai': ['AI', 'MachineLearning', 'ArtificialIntelligence', 'ProductManagement', 'TechLeadership'],
      'product': ['ProductManagement', 'ProductStrategy', 'UserExperience', 'Innovation', 'TechLeadership'],
      'leadership': ['Leadership', 'Management', 'TeamBuilding', 'TechLeadership', 'CareerGrowth'],
      'startup': ['Startup', 'Entrepreneurship', 'Innovation', 'Growth', 'ProductMarketFit']
    };

    const topicLower = topic.toLowerCase();
    for (const [key, tags] of Object.entries(topicHashtags)) {
      if (topicLower.includes(key)) return tags;
    }
    return ['ProductManagement', 'TechLeadership', 'Innovation', 'CareerGrowth'];
  }

  // Template initialization
  initializeTemplates() {
    return {
      referral_request: {
        body: `Hi {name},

I've been following {specific_project} at {company} — impressive execution on that.

I'm actively exploring {role_reference} opportunities and noticed {company} has been expanding the product team. Given your perspective there, I'd love to hear your take on the team culture and what they value in candidates.

Would you be open to a quick 15-minute chat this week? Happy to work around your schedule.

Also, I recently came across something on {mutual_interest} that reminded me of {shared_context}. Thought you might find it interesting.

Best,`
      },
      introduction_request: {
        body: `Hi {name},

Hope things are going well at {company}! I wanted to reach out because I'm exploring {role_reference} opportunities, and I noticed you might be connected with someone at the company I'm targeting.

Given my background in {mutual_interest}, I think there could be some interesting alignment. Would you be comfortable making an introduction? Happy to send you a brief blurb to make it easy.

No pressure at all — I appreciate your time either way!`
      },
      informational_interview: {
        body: `Hi {name},

I've been really impressed by what {company} has been building, especially {company_news}. As someone exploring {role_reference}, your perspective would be incredibly valuable.

Would you have 15 minutes for a quick chat? I'd love to hear about your experience and any insights on what makes the product team at {company} successful.

Happy to work around your schedule — even a quick coffee chat would be great.`
      },
      reconnection: {
        body: `Hi {name},

It's been a while — hope things are going great at {company}! I've been following {specific_project} and it's been exciting to see the progress.

I wanted to reconnect because I'm at an interesting career inflection point — exploring {role_reference} and your perspective would be really valuable.

Would love to catch up when you have a free moment. No rush at all!`
      },
      thank_you: {
        body: `Hi {name},

Thank you so much for taking the time to chat today. Your insights on {mutual_interest} at {company} were incredibly helpful.

I especially appreciated your point about {specific_project} — it reframed how I'm thinking about my approach.

I'll definitely follow up on {shared_context} as you suggested. Looking forward to staying connected!`
      },
      general: {
        body: `Hi {name},

I hope this message finds you well! I wanted to reach out because {shared_context} and I think there could be some interesting alignment.

Would love to connect and exchange perspectives on {mutual_interest}.

Looking forward to hearing from you!`
      }
    };
  }

  initializeTimingData() {
    return {
      optimal_days: { 'Tuesday': 0.67, 'Wednesday': 0.58, 'Monday': 0.52, 'Thursday': 0.48, 'Friday': 0.28 },
      optimal_hours: { '9': 0.72, '10': 0.68, '8': 0.55, '11': 0.50, '14': 0.45 }
    };
  }

  generateId() {
    return `out_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateFallbackOutreach(contact, purpose) {
    return {
      fallback: true,
      contact: contact,
      purpose: purpose,
      message: { subject: `Connecting with ${contact.name}`, body: 'Template generation failed — use manual personalization' },
      basic_tips: [
        'Reference a specific shared experience or mutual connection',
        'Lead with value (insight, article, congratulations) before asking',
        'Keep the message under 150 words',
        'Include a specific, low-commitment ask (15-min chat, quick question)'
      ]
    };
  }
}

// CLI interface
async function runOutreachEngine() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help') {
    console.log(`
📧 Outreach Engine

Usage:
  bun outreach-engine.js generate <contact.json> <purpose>
  bun outreach-engine.js batch <contacts.json> <purpose>
  bun outreach-engine.js linkedin <topic> [type]
  bun outreach-engine.js templates

Purposes: referral_request, introduction_request, informational_interview, reconnection, thank_you

Examples:
  bun outreach-engine.js generate contact.json referral_request
  bun outreach-engine.js batch contacts.json informational_interview
  bun outreach-engine.js linkedin "AI product management" post
  bun outreach-engine.js templates
`);
    return;
  }

  const engine = new OutreachEngine();

  try {
    switch (command) {
      case 'generate':
        const contactFile = args[1];
        const purpose = args[2];
        if (!contactFile || !purpose) {
          console.error('❌ Contact file and purpose required');
          process.exit(1);
        }
        const contact = JSON.parse(await readFile(contactFile, 'utf-8'));
        const outreach = await engine.generateOutreach(contact, purpose);
        console.log(`\n📧 Subject: ${outreach.message.subject}`);
        console.log(`📝 Message:\n${outreach.message.body}`);
        console.log(`\n⏰ Best Send: ${outreach.timing.best_day} ${outreach.timing.best_time}`);
        console.log(`📊 Response Probability: ${outreach.tracking.response_probability}%`);
        await writeFile(`outreach_${Date.now()}.json`, JSON.stringify(outreach, null, 2));
        break;

      case 'linkedin':
        const topic = args[1] || 'AI product management';
        const contentType = args[2] || 'post';
        const content = await engine.generateLinkedInContent(topic, contentType);
        console.log(`\n📝 LinkedIn ${contentType}:\n`);
        console.log(content.content);
        console.log(`\n⏰ Best Post Time: ${content.timing.best_post_day} ${content.timing.best_post_time}`);
        break;

      case 'templates':
        console.log('\n📧 Available Outreach Templates:');
        Object.keys(engine.templates).forEach(t => console.log(`• ${t}`));
        break;

      default:
        console.error(`❌ Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error(`🚨 Outreach generation failed: ${error.message}`);
    process.exit(1);
  }
}

export { OutreachEngine };

if (import.meta.main) {
  runOutreachEngine();
}