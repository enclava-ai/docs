---
sidebar_position: 2
---

# Platform Architecture

## System Overview

Enclava is a open source AI platform.

```
┌─────────────────────────────────────────────────────┐
│                   Client Layer                      │
│            Web Dashboard | API Clients              │
└─────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────┐
│                    API Gateway                      │
│     Public API (/api/v1) | Chatbot  API (/api-int)  │
└─────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────┐
│                  Backend Services                   │
│   FastAPI | Plugins | Modules | Background Tasks    │
└─────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────┐
│              Data & AI Infrastructure               │
│  PostgreSQL | Redis | Qdrant | privatemode.ai TEE   │
└─────────────────────────────────────────────────────┘
```

## Core Components

### Backend (Python/FastAPI)
- **Framework**: FastAPI with async/await support
- **Architecture**: Modular plugin system for extensibility
- **Security**: JWT authentication, API key management, threat detection

### Frontend (Next.js/React)
- **Framework**: Next.js 14 with TypeScript
- **Features**: SSR, real-time updates, responsive design
- **State Management**: React Context + SWR for data fetching
- **UI Components**: Tailwind CSS + shadcn/ui

### Data Layer
| Component | Purpose | Technology |
|-----------|---------|------------|
| PostgreSQL | Primary database | Relational data, user management |
| Redis | Caching & sessions | Fast key-value storage |
| Qdrant | Vector database | RAG embeddings and semantic search |
| File Storage | Documents | Local filesystem with encryption |

## API Architecture

### Dual API Design
```yaml
Public API (/api/v1/):
  - Authentication: API Keys
  - Rate Limits: 1000 req/min (standard)
  - Use Case: External integrations
  - OpenAI Compatible: Yes

Internal API (/api-internal/v1/):
  - Authentication: JWT tokens
  - Rate Limits: 300 req/min
  - Use Case: Frontend only
  - Features: Full platform access
```

### OpenAI Compatibility
Full compatibility with OpenAI API format for easy migration:
- `/chat/completions` - Chat endpoint
- `/embeddings` - Embedding generation
- `/models` - List available models


## Plugin System

### Architecture
```python
class BasePlugin:
    def __init__(self):
        self.name = "plugin_name"
        self.version = "1.0.0"
    
    async def execute(self, context):
        # Plugin logic here
        pass
```

### Features
- Auto-discovery from `plugins/` directory
- Sandboxed execution environment
- Configuration via UI or API
- Custom API endpoint registration

## Deployment Architecture

### Container Stack
```yaml
services:
  backend:
    image: enclava/backend:latest
    replicas: 3
    
  frontend:
    image: enclava/frontend:latest
    replicas: 2
    
  postgres:
    image: postgres:15
    
  redis:
    image: redis:7-alpine
    
  qdrant:
    image: qdrant/qdrant:latest
```

### Infrastructure Requirements
- **Minimum**: 4 CPU cores, 8GB RAM
- **Recommended**: 8 CPU cores, 16GB RAM
- **Storage**: 100GB for documents and vectors
- **Network**: 100Mbps for optimal performance


---

*For API specifications, see [API Reference](/enclava-platform/api-reference)*