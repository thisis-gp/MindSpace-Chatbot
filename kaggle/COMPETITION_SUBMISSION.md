# Mindspace: Multi-Agent Mental Wellness Companion

## Bridging the Gap Between Silent Struggle and Seeking Help

**Submission Track:** Agents for Good

**Card and Thumbnail Image:** 
A calming, supportive visual showing:
- A stylized brain/heart icon in soft blue and green tones
- Multiple interconnected nodes representing the multi-agent system
- A gentle upward arrow suggesting progress and hope
- Minimal, clean design that conveys safety and trust
- Colors: Soft blues (#4A90E2), calming greens (#7ED321), warm grays (#F5F5F5)

*Alternative: A simple diagram showing a user connecting to multiple AI agents (Listener, Distress, Journal, Escalation) with a central Orchestrator, all leading to a professional psychologist icon.*

---

## Problem Statement

Students face critical barriers to accessing mental health support:

- **Stigma**: Fear of judgment prevents students from seeking help, leading to delayed intervention
- **Limited Availability**: Counselor shortages and long wait times create bottlenecks
- **No Anonymous First Contact**: Lack of safe, non-judgmental entry point for expressing concerns
- **No Early Detection**: Institutions lack systematic ways to identify students in distress before crisis

**Impact**: Students suffer silently → increased crisis cases → higher counselor workload → reduced engagement with mental health resources → higher dropout rates.

This is important because early intervention is critical for mental health outcomes, but current systems fail to provide accessible, anonymous first contact that can identify and route students to appropriate care.

---

## Why Agents?

This problem uniquely requires a multi-agent approach:

1. **Specialized Expertise**: Different tasks need different capabilities—listening requires empathy, analysis requires objectivity, escalation requires guidance. Single agents can't excel at all simultaneously.

2. **Parallel Processing**: Users need immediate empathetic responses while the system simultaneously assesses risk. **ParallelAgent** enables Listener and Distress agents to run simultaneously, improving both speed and accuracy.

3. **Stateful Conversations**: Mental wellness is a journey requiring context across sessions. **InMemorySessionService** maintains conversation history, mood patterns, and progress tracking for personalized support.

4. **Orchestrated Workflows**: The system must coordinate multiple agents, tools (booking, email, reports), and external services (MCP server). An orchestrator agent manages complex routing decisions.

5. **Tool Integration**: Seamless connection to external systems (booking APIs, email, databases) requires agents that can use custom tools effectively.

Traditional chatbots or single-agent systems cannot provide this level of specialized, coordinated, stateful support.

---

## What You Created

**Mindspace** is a multi-agent mental wellness companion with the following architecture:

### Architecture

```
User → Orchestrator Agent → [Listener | Distress | Journal | Escalation] → Tools → MCP Server
```

### Components

**5 Specialized LLM Agents (Gemini 2.5 Flash Lite):**
- **Listener Agent**: Empathetic, non-judgmental conversation
- **Distress Classification Agent**: Sentiment analysis + risk assessment (LLM + rule-based)
- **Journal Analyzer Agent**: Mood tracking and pattern extraction
- **Escalation Agent**: Guided booking with psychologists
- **Orchestrator Agent**: Coordinates all agents and workflows

**ParallelAgent Pattern:**
- Listener + Distress agents run simultaneously for real-time empathetic responses with parallel risk assessment

**10+ Custom Tools:**
- Memory management (mood history, session context)
- Distress scoring (rule-based + LLM analysis)
- MCP client functions (booking, escalation logging)
- Email notifications (confirmations, reminders)
- Session report management (remedies, progress tracking)

**MCP Server (FastAPI):**
- Separate FastAPI service for booking management, escalation logging, session reports
- SQLite database (production-ready for PostgreSQL/MySQL)
- RESTful API endpoints

**Stateful Sessions:**
- **InMemorySessionService** with **InMemoryRunner** for conversation context
- Long-term memory for mood history and session context
- Cross-session personalization

### Key Features

- **Anonymous 24/7 Access**: Stigma-free emotional space
- **Early Detection**: Pattern recognition identifies distress before crisis
- **Seamless Escalation**: Guided connection to verified psychologists
- **Mood Tracking**: AI-powered journal analysis with trend detection
- **Progress Tracking**: Integration with psychologist session reports

---

## Demo

The system demonstrates four key scenarios:

1. **Regular Conversation (Medium Distress)**: User expresses exam stress → System provides empathetic response while assessing distress level → Stores session context

2. **Journal Entry Analysis**: User logs daily reflection → Journal Analyzer extracts mood (score 0.6, "mixed"), themes, and trends → Stores in mood history

3. **High Distress Escalation**: User expresses hopelessness → Distress score 0.85 (high risk) → Escalation Agent guides booking with psychologist → Email confirmation sent

4. **Mood History Query**: User requests mood history → System retrieves entries, calculates trends using linear regression → Shows improving/declining patterns

**Observability**: All interactions are logged via structured logging (`log_event()`), tracking tool calls, agent decisions, escalations, and errors for monitoring and evaluation.

---

## The Build

### Technologies Used

- **Google ADK (Agent Development Kit)**: Core framework for multi-agent system
- **Gemini 2.5 Flash Lite**: LLM powering all agents
- **Python**: Implementation language
- **FastAPI**: MCP server framework
- **SQLAlchemy**: Database ORM
- **SQLite**: Database (demo), production-ready for PostgreSQL/MySQL
- **SMTP**: Email notifications

### ADK Concepts Implemented (5+)

1. **Multi-Agent System**
   - 5 LLM agents + **ParallelAgent** for simultaneous execution
   - Orchestrator pattern for coordination

2. **Custom Tools**
   - 10+ FunctionTools for domain-specific functionality
   - MCP (Model Context Protocol) server with FastAPI
   - External API integration (SMTP)

3. **Sessions & Memory**
   - **InMemorySessionService** for stateful conversations
   - **InMemoryRunner** for session execution
   - Long-term memory storage

4. **Observability**
   - Structured logging with `log_event()` throughout codebase
   - Event tracking (tool calls, agent decisions, escalations)
   - Evaluation metrics (engagement, mood trends, distress patterns)

5. **Context Engineering**
   - Cross-session memory for personalized responses
   - Mood trend analysis with linear regression
   - Progress tracking on recommendations

**Bonus:**
- Effective use of Gemini across all agents
- Production-ready architecture (MCP server, error handling, deployment docs)

### Code Structure

- **Notebook Sections**: Setup → Custom Tools → Agents → Testing → Evaluation → Deployment
- **MCP Server**: Inline FastAPI server with SQL database
- **Testing**: 4 comprehensive test scenarios
- **Documentation**: Inline markdown cells with architecture diagrams

---

## If I Had More Time, This Is What I'd Do

1. **Enhanced Memory**: Replace in-memory storage with Vertex AI Memory Bank for scalable, production-grade memory management

2. **Real-Time Monitoring**: Integrate Cloud Logging, error tracking (Sentry), and alerting for production observability

3. **Advanced Risk Detection**: Implement more sophisticated risk models using historical patterns, behavioral analysis, and multi-factor assessment

4. **A/B Testing Framework**: Test different agent response styles and distress scoring algorithms to optimize outcomes

5. **Multi-Language Support**: Extend agents to support multiple languages for broader accessibility

6. **Analytics Dashboard**: Build counselor-facing dashboard showing trends, escalation patterns, and anonymized insights

7. **Voice Interface**: Add voice input/output for users who prefer speaking over typing

8. **Integration with Real Booking Systems**: Connect to actual psychologist scheduling systems (Calendly, Practice Fusion, etc.)

9. **HIPAA/GDPR Compliance**: Implement encryption, audit logs, and compliance measures for production deployment

10. **Automated Evaluation Pipeline**: Set up continuous evaluation to measure agent performance, user satisfaction, and clinical outcomes

---

## Attachments

**Kaggle Notebook:**
[Link to Kaggle Notebook: `mindspace-agentic.ipynb`]

*The notebook contains the complete implementation including all 5 agents, ParallelAgent, 10+ custom tools, MCP server code (inline), InMemorySessionService setup, structured logging, 4 test scenarios, evaluation metrics, and deployment documentation.*

---

**Competition Submission Details:**
- **Track**: Agents for Good
- **Submission Date**: December 1, 2025
- **Key Concepts Demonstrated**: 5+ (Multi-Agent System, Custom Tools, Sessions & Memory, Observability, Context Engineering)
- **Bonus Points**: Effective Use of Gemini, Production-Ready Architecture
