---
sidebar_position: 2
---

# Enclava Platform Architecture

A comprehensive technical overview of the Enclava platform architecture, including system components, API design, security model, and integration patterns.

## System Architecture Overview

Enclava follows a modern microservices architecture built with scalability, security, and maintainability in mind.

### Core Components

**Backend Services (Python/FastAPI)**
- RESTful API server with async/await support
- Dual API architecture (public and internal)
- Modular plugin and module system
- Integrated security and threat detection
- Background task processing

**Frontend Application (Next.js/React)**
- Modern React-based web interface
- Server-side rendering (SSR) support
- Real-time updates and notifications
- Responsive design for mobile and desktop
- TypeScript for type safety

**Data Layer**
- PostgreSQL: Primary database for structured data
- Redis: Caching and session management
- Qdrant: Vector database for RAG operations
- File Storage: Local file system for document storage

**External Integrations**
- privatemode.ai: Confidential computing LLM provider
- Signal API: Messaging bot integration
- Plugin Ecosystem: Extensible third-party integrations

## API Architecture

### Dual API Design

Enclava implements a sophisticated dual API architecture to separate internal platform operations from external client access.

#### Public API (`/api/v1/`)
**Purpose**: External client integrations and OpenAI-compatible endpoints

**Authentication**: API Key-based with budget enforcement
- Standard API keys: 1,000 requests/min, 20,000/hour
- Premium API keys: 5,000 requests/min, 100,000/hour

**Key Endpoints**:
```
POST /api/v1/chat/completions      # OpenAI-compatible chat completions
GET  /api/v1/models                # List available LLM models
POST /api/v1/embeddings           # Generate text embeddings
GET  /api/v1/llm/providers/status # Check provider health
POST /api/v1/chatbot/interact     # Interact with chatbots
```

#### Internal API (`/api-internal/v1/`)
**Purpose**: Frontend-to-backend communication exclusively

**Authentication**: JWT token-based for authenticated users
- User tokens: 300 requests/min, 5,000/hour

**Key Endpoints**:
```
GET  /api-internal/v1/auth/me          # Get current user info
POST /api-internal/v1/rag/collections  # Manage RAG collections
GET  /api-internal/v1/analytics        # Platform analytics
POST /api-internal/v1/modules/config   # Module configuration
GET  /api-internal/v1/plugins          # Plugin management
```

### OpenAI Compatibility Layer

Full compatibility with OpenAI API specifications enables seamless migration:

**Chat Completions API**
```json
POST /api/v1/chat/completions
{
  "model": "privatemode-llama-3-70b",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"}
  ],
  "temperature": 0.7,
  "max_tokens": 1000
}
```

**Models API**
```json
GET /api/v1/models
{
  "data": [
    {
      "id": "privatemode-llama-3-70b",
      "object": "model",
      "owned_by": "privatemode",
      "permission": []
    }
  ]
}
```

**Embeddings API**
```json
POST /api/v1/embeddings
{
  "input": "Text to embed",
  "model": "text-embedding-ada-002"
}
```

## Security Architecture

### Multi-Layered Security Model

**1. Network Layer**
- TLS 1.3 encryption for all communications
- CORS policies for cross-origin requests
- Nginx reverse proxy for request routing
- Rate limiting at multiple tiers

**2. Authentication & Authorization**
```python
# JWT Authentication (Internal API)
@jwt_required
async def protected_endpoint():
    pass

# API Key Authentication (Public API)
@require_api_key(scopes=["llm.chat"])
async def public_endpoint():
    pass
```

**3. Application Security**
- Real-time threat detection middleware
- SQL injection prevention
- XSS protection with input sanitization
- Command injection detection
- Path traversal prevention

**4. Data Protection**
- Encryption at rest for sensitive data
- API key encryption in database
- Secure session management
- Audit logging for all operations

### Confidential Computing Integration

**privatemode.ai TEE Integration**
```python
# TEE-protected LLM inference
from app.services.llm.providers.privatemode import PrivatemodeProvider

provider = PrivatemodeProvider(
    api_key=encrypted_api_key,
    attestation_required=True,
    cache_mode="none"  # No caching for maximum security
)

response = await provider.chat_completion(
    model="privatemode-llama-3-70b",
    messages=messages,
    temperature=0.7
)
```

**Security Features**:
- Hardware attestation before processing
- End-to-end encryption pipeline
- Memory isolation during inference
- No caching of sensitive data

## Module System Architecture

### Core Module Framework

Enclava's modular architecture enables extensible functionality through a plugin system:

**Base Module Interface**
```python
from app.services.base_module import BaseModule

class CustomModule(BaseModule):
    def __init__(self):
        super().__init__(
            name="custom_module",
            version="1.0.0",
            description="Custom functionality"
        )
    
    async def initialize(self):
        """Initialize module resources"""
        pass
    
    async def cleanup(self):
        """Cleanup module resources"""
        pass
    
    def get_routes(self) -> APIRouter:
        """Return module-specific API routes"""
        return self.router
```

### Active Modules

**Cache Module**
- Redis-based distributed caching
- Intelligent cache invalidation
- Performance optimization
- TTL management

**Chatbot Module**
- AI chatbot creation and management
- Conversation state tracking
- Template-based prompt management
- RAG integration

**RAG Module**
- Document processing pipeline
- Vector embedding generation
- Semantic search capabilities
- Collection management

**Signal Module**
- Signal messenger integration
- Role-based permission system
- Command processing
- Conversation memory

**Workflow Module**
- Multi-step process automation
- Conditional logic support
- Error handling and retries
- Visual workflow builder

## Data Architecture

### Database Schema Design

**Core Entities**
```sql
-- User management
users (id, email, password_hash, role, created_at)
api_keys (id, user_id, key_hash, permissions, budget_limit)

-- AI Services  
chatbot_instances (id, user_id, name, type, config, created_at)
chatbot_conversations (id, chatbot_id, session_id, created_at)
chatbot_messages (id, conversation_id, role, content, timestamp)

-- RAG System
rag_collections (id, user_id, name, qdrant_collection_name)
rag_documents (id, collection_id, filename, content_hash, metadata)

-- Analytics & Monitoring
audit_logs (id, user_id, action, resource, details, timestamp)
usage_tracking (id, user_id, api_key_id, endpoint, cost, timestamp)
```

**Relationships**
- Users have multiple API keys with different permissions
- Chatbots belong to users and have conversations
- RAG collections contain multiple documents
- All operations generate audit logs and usage tracking

### Vector Database (Qdrant)

**Collection Structure**
```python
# RAG collection configuration
collection_config = {
    "vectors": {
        "size": 1536,  # OpenAI embedding dimension
        "distance": "Cosine"
    },
    "optimizers_config": {
        "default_segment_number": 2
    },
    "replication_factor": 1
}
```

**Document Storage Pattern**
```python
# Document points in Qdrant
point = {
    "id": document_id,
    "vector": embedding_vector,
    "payload": {
        "user_id": user_id,
        "collection_id": collection_id,
        "filename": "document.pdf",
        "content": "Document content...",
        "metadata": {...}
    }
}
```

## Performance Architecture

### Caching Strategy

**Multi-Level Caching**
1. **Application Cache**: In-memory caching for frequent operations
2. **Redis Cache**: Distributed caching for session and API data
3. **Model Cache**: LLM model metadata caching (15-minute TTL)
4. **Response Cache**: Optional caching for non-sensitive responses

**Cache Implementation**
```python
from app.core.cache import core_cache

# Cache LLM response (optional)
cache_key = f"llm:{model}:{hash(prompt)}"
if cached_response := await core_cache.get(cache_key):
    return cached_response

response = await llm_provider.chat_completion(request)
await core_cache.set(cache_key, response, ttl=3600)
```

### Async Processing

**FastAPI Async Architecture**
```python
from fastapi import FastAPI, BackgroundTasks

@app.post("/api/v1/rag/documents")
async def upload_document(
    file: UploadFile,
    background_tasks: BackgroundTasks
):
    # Immediate response
    document_id = await save_document_metadata(file)
    
    # Background processing
    background_tasks.add_task(process_document, document_id)
    
    return {"document_id": document_id, "status": "processing"}
```

**Background Task Processing**
- Document processing and embedding generation
- Audit log writing and analytics aggregation
- Cache warming and cleanup operations
- Health monitoring and alerting

### Database Optimization

**Connection Pooling**
```python
# SQLAlchemy async engine with connection pooling
engine = create_async_engine(
    database_url,
    pool_size=20,
    max_overflow=30,
    pool_pre_ping=True,
    pool_recycle=3600
)
```

**Query Optimization**
- Database indexes on frequently queried columns
- Async query execution with SQLAlchemy
- Pagination for large result sets
- Efficient joins and relationship loading

## Integration Patterns

### Client Integration Options

**1. Direct API Integration**
```python
import openai

# Standard OpenAI client works with Enclava
client = openai.OpenAI(
    api_key="enclava-api-key",
    base_url="https://enclava.example.com/api/v1"
)

response = client.chat.completions.create(
    model="privatemode-llama-3-70b",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

**2. SDK Integration**
```python
from enclava_client import EnclavaClient

client = EnclavaClient(
    api_key="enclava-api-key",
    base_url="https://enclava.example.com"
)

# Enhanced features beyond OpenAI API
chatbot = await client.create_chatbot(
    name="Support Bot",
    type="customer_support",
    rag_collection="company_docs"
)
```

**3. Plugin Development**
```python
# Custom plugin structure
from app.services.base_plugin import BasePlugin

class CustomPlugin(BasePlugin):
    manifest = {
        "name": "custom_plugin",
        "version": "1.0.0",
        "description": "Custom functionality",
        "permissions": ["llm.chat", "rag.read"]
    }
    
    async def initialize(self, config: dict):
        self.api_key = config.get("api_key")
        self.endpoint = config.get("endpoint")
    
    def get_routes(self):
        return [
            ("GET", "/custom/status", self.get_status),
            ("POST", "/custom/process", self.process_data)
        ]
```

### Webhook Integration

**Event Notification System**
```python
# Webhook configuration
webhook_config = {
    "url": "https://client.example.com/webhooks/enclava",
    "events": [
        "chatbot.message_received",
        "rag.document_processed",
        "budget.threshold_exceeded"
    ],
    "secret": "webhook-secret-key"
}
```

**Event Payload Structure**
```json
{
  "event_type": "chatbot.message_received",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "chatbot_id": "bot_123",
    "conversation_id": "conv_456", 
    "message": {
      "role": "user",
      "content": "Hello, I need help"
    }
  },
  "signature": "sha256=..."
}
```

## Development Architecture

### Code Organization

```
backend/
├── app/
│   ├── api/                 # API route definitions
│   │   ├── public_v1/      # External client API
│   │   ├── internal_v1/    # Frontend-only API
│   │   └── v1/             # Shared API endpoints
│   ├── core/               # Core infrastructure
│   │   ├── config.py       # Configuration management
│   │   ├── security.py     # Authentication & authorization
│   │   └── cache.py        # Caching infrastructure
│   ├── services/           # Business logic services
│   │   ├── llm/           # LLM service implementation
│   │   ├── rag_service.py # RAG functionality
│   │   └── analytics.py   # Analytics and monitoring
│   ├── models/            # Database models
│   ├── middleware/        # Request/response middleware
│   └── utils/             # Utility functions
├── modules/               # Pluggable modules
│   ├── cache/
│   ├── chatbot/
│   ├── rag/
│   ├── signal/
│   └── workflow/
└── tests/                # Test suites
    ├── unit/
    ├── integration/
    └── e2e/
```

### Testing Architecture

**Test Categories**
- **Unit Tests**: Component isolation testing
- **Integration Tests**: Cross-component interaction
- **End-to-End Tests**: Full workflow validation
- **Performance Tests**: Load and response time testing

**Test Implementation**
```python
# Example integration test
@pytest.mark.asyncio
async def test_llm_chat_completion():
    async with AsyncClient(app=app) as client:
        response = await client.post(
            "/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}"},
            json={
                "model": "test-model",
                "messages": [{"role": "user", "content": "test"}]
            }
        )
        assert response.status_code == 200
        assert "choices" in response.json()
```

---

*This architecture provides a scalable, secure, and maintainable foundation for enterprise AI applications with confidential computing capabilities.*