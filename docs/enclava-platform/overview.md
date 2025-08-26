---
sidebar_position: 1
---

# Enclava Platform Overview

Enclava is a comprehensive AI platform that combines powerful language models with confidential computing capabilities, providing secure, scalable, and feature-rich AI solutions for enterprises and developers.

## Core Value Proposition

**Secure AI with Confidential Computing** - Enclava uniquely combines enterprise-grade AI capabilities with hardware-enforced security through Trusted Execution Environments (TEEs), enabling processing of sensitive data while maintaining privacy guarantees.

## Key Features


### Advanced RAG (Retrieval-Augmented Generation)
- **Document Processing**: Support for PDF, DOCX, TXT, and Markdown files
- **Vector Storage**: Qdrant integration for semantic search and retrieval
- **Collection Management**: Organize documents into searchable collections
- **Embedding Service**: Generate embeddings for semantic search
- **Context Integration**: Seamlessly integrate relevant documents into LLM responses

### Chatbot Builder & Management
- **Dynamic Templates**: Database-stored system prompts with AI-powered improvement
- **Custom Personalities**: Create custom chatbot types beyond predefined templates
- **RAG Integration**: Context-aware responses using knowledge bases (RAG)
- **Multi-Model Support**: Choose from various LLM models for different use cases

### Extensible Plugin Architecture
- **Auto-Discovery**: Automatic plugin detection and registration
- **Sandbox Security**: Isolated plugin execution environment
- **Configuration Management**: GUI-based plugin configuration
- **API Integration**: Plugins can expose custom API endpoints
- **Module System**: Core functionality through modular architecture


## User Interface

### Modern Web Dashboard
- **Next.js Frontend**: Fast, responsive React-based interface
- **Real-time Updates**: Live status monitoring and notifications
- **Multi-tenant Support**: User and organization management
- **Theme Support**: Light and dark mode options
- **Mobile Responsive**: Optimized for desktop and mobile use

### Key Interface Areas
- **LLM Playground**: Interactive chat interface for testing models
- **RAG Management**: Document upload and collection management
- **Chatbot Builder**: Visual chatbot creation and configuration
- **Analytics Dashboard**: Usage metrics and performance insights
- **Plugin Manager**: Install and configure platform extensions
- **Settings Panel**: Security, API, and notification preferences

## API Architecture

### Dual API Design
- **Public API** (`/api/v1/`): External client access with API key authentication
- **Internal API** (`/api-internal/v1/`): Frontend-only access with JWT authentication


## Getting Started

### Quick Start Options

1. **Docker Deployment**: Full platform setup with `docker compose up`
2. **API Integration**: Connect existing applications via OpenAI-compatible endpoints
3. **Web Interface**: Access the dashboard for interactive platform management
4. **Plugin Development**: Extend platform capabilities with custom plugins

### Next Steps

- [Architecture Documentation](/enclava-platform/architecture) - Technical deep-dive
- [API Reference](/enclava-platform/api-reference) - Complete API documentation  
- [Deployment Guide](/enclava-platform/deployment) - Production deployment instructions

---

*Enclava combines the power of modern AI with the security of confidential computing, enabling organizations to process sensitive data while maintaining privacy and compliance requirements.*