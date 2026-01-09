---
sidebar_position: 3
---

# API Reference

Complete API documentation for the Enclava platform's external APIs, providing three distinct integration paths for different use cases.

## API Overview

Enclava provides three external APIs, all accessible at `/api/v1/` with API key authentication:

### 1. **Standard OpenAI-Compatible API**
Direct LLM access without RAG or conversation management. Drop-in replacement for OpenAI API.
- **Endpoints**: `/chat/completions`, `/models`, `/embeddings`
- **Use Case**: Applications already using OpenAI API
- **Features**: Standard LLM inference, multiple models, streaming support

### 2. **Chatbot API with RAG (OpenAI-Compatible)**
OpenAI-compatible format enhanced with RAG capabilities and chatbot configuration.
- **Endpoint**: `/chatbot/external/{chatbot_id}/chat/completions`
- **Use Case**: AI assistants with knowledge bases
- **Features**: RAG integration, system prompts, configurable behavior

### 3. **Custom Chatbot API**
Simplified API with automatic conversation history management.
- **Endpoint**: `/chatbot/external/{chatbot_id}/chat`
- **Use Case**: Customer support bots, chat widgets
- **Features**: Conversation tracking, memory management, simple format

## API Comparison

| Feature | Standard OpenAI API | Chatbot OpenAI API | Custom Chatbot API |
|---------|-------------------|-------------------|-------------------|
| **Endpoint** | `/api/v1/chat/completions` | `/api/v1/chatbot/external/{id}/chat/completions` | `/api/v1/chatbot/external/{id}/chat` |
| **RAG Support** | ❌ No | ✅ Yes | ✅ Yes |
| **Conversation History** | ❌ Manual | ⚪ Optional | ✅ Automatic |
| **Request Format** | OpenAI Standard | OpenAI Standard | Simple JSON |
| **Response Format** | OpenAI Standard | OpenAI Standard | Custom JSON |
| **System Prompts** | Per request | Pre-configured | Pre-configured |
| **Memory Management** | None | Optional | Automatic (configurable) |
| **Best For** | Direct LLM access | Knowledge-based AI | Conversational bots |

## Authentication

All external APIs require API key authentication:

```http
Authorization: Bearer enclv_your_api_key_here
```

API keys can be created through the Enclava dashboard or API with specific scopes and rate limits.

---

## 1. Standard OpenAI-Compatible API

Direct LLM inference without RAG or conversation management.

### Chat Completions

Create a chat completion for direct LLM inference.

```http
POST /api/v1/chat/completions
```

**Request:**
```json
{
  "model": "meta-llama/llama-3.1-70b-instruct",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": "What is confidential computing?"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 1000,
  "stream": false
}
```

**Response:**
```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "meta-llama/llama-3.1-70b-instruct",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "Confidential computing is..."
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 150,
    "total_tokens": 175
  }
}
```

### List Models

Get available models for LLM inference.

```http
GET /api/v1/models
```

**Response:**
```json
{
  "object": "list",
  "data": [
    {
      "id": "meta-llama/llama-3.1-70b-instruct",
      "object": "model",
      "created": 1686935002,
      "owned_by": "privatemode"
    },
    {
      "id": "mistralai/mixtral-8x7b-instruct",
      "object": "model",
      "created": 1686935002,
      "owned_by": "privatemode"
    }
  ]
}
```

### Create Embeddings

Generate text embeddings for semantic search.

```http
POST /api/v1/embeddings
```

**Request:**
```json
{
  "input": ["Text to embed", "Another text"],
  "model": "text-embedding-ada-002"
}
```

**Response:**
```json
{
  "object": "list",
  "data": [{
    "object": "embedding",
    "index": 0,
    "embedding": [0.0023, -0.0012, ...]
  }],
  "model": "text-embedding-ada-002",
  "usage": {
    "prompt_tokens": 8,
    "total_tokens": 8
  }
}
```

---

## 2. Chatbot API with RAG (OpenAI-Compatible)

OpenAI-compatible format with RAG integration and pre-configured chatbot settings.

### Setup: Create a Chatbot

First, create a chatbot with RAG configuration:

```http
POST /api/v1/chatbot/create
```

**Request:**
```json
{
  "name": "Knowledge Assistant",
  "chatbot_type": "assistant",
  "model": "meta-llama/llama-3.1-70b-instruct",
  "system_prompt": "You are a helpful assistant with access to company documentation.",
  "use_rag": true,
  "rag_collection": "company-docs",
  "rag_top_k": 5,
  "temperature": 0.7,
  "max_tokens": 1000,
  "memory_length": 10
}
```

### Chat Completions with RAG

Use OpenAI format with your configured chatbot:

```http
POST /api/v1/chatbot/external/{chatbot_id}/chat/completions
```

**Request:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "What is our company's refund policy?"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 500
}
```

**Response:**
```json
{
  "id": "chatcmpl-bot-456",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "meta-llama/llama-3.1-70b-instruct",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "Based on our documentation, the refund policy states..."
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 45,
    "completion_tokens": 200,
    "total_tokens": 245
  }
}
```

**Key Features:**
- System prompt is pre-configured in the chatbot
- RAG automatically searches the configured collection
- Optional conversation history can be maintained
- Model and parameters are pre-set but can be overridden

---

## 3. Custom Chatbot API

Simplified API with automatic conversation management and configurable history.

### Simple Chat Interface

Send a message and receive a response with automatic conversation tracking:

```http
POST /api/v1/chatbot/external/{chatbot_id}/chat
```

**Request:**
```json
{
  "message": "Hello, I need help with my account",
  "conversation_id": "optional-session-123"
}
```

**Response:**
```json
{
  "conversation_id": "session_123",
  "response": "Hello! I'd be happy to help with your account. What specific issue are you experiencing?",
  "sources": [
    {
      "title": "Account Help Guide",
      "content": "Relevant excerpt from documentation...",
      "score": 0.92
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z",
  "chatbot_id": "bot_789"
}
```

**Key Features:**
- **Automatic Conversation Management**: No need to send full history
- **Configurable Memory**: Set `memory_length` to control context (e.g., last 10 messages)
- **RAG Sources**: When RAG is enabled, relevant sources are included
- **Session Continuity**: Use `conversation_id` to continue conversations
- **Simplified Format**: No need for role-based message structure

### Conversation Flow Example

**First Message:**
```json
{
  "message": "What are your business hours?"
}
```

**Second Message (continues conversation):**
```json
{
  "message": "What about weekends?",
  "conversation_id": "session_123"
}
```

The chatbot automatically maintains context from previous messages based on `memory_length` setting.

---

## Chatbot Configuration

When creating chatbots for APIs 2 and 3, configure these parameters:

### Core Settings
- **`name`**: Chatbot identifier
- **`chatbot_type`**: Type of assistant (e.g., "assistant", "support", "sales")
- **`model`**: LLM model to use (e.g., "meta-llama/llama-3.1-70b-instruct")
- **`system_prompt`**: Instructions defining chatbot behavior and personality

### RAG Configuration
- **`use_rag`**: Enable/disable RAG (true/false)
- **`rag_collection`**: Document collection to search
- **`rag_top_k`**: Number of relevant documents to retrieve (default: 5)

### Conversation Settings
- **`memory_length`**: Number of previous messages to remember (default: 10)
- **`temperature`**: Response randomness (0-2, default: 0.7)
- **`max_tokens`**: Maximum response length (default: 1000)
- **`fallback_responses`**: Responses to use when errors occur

### Example Configuration
```json
{
  "name": "Customer Support Bot",
  "chatbot_type": "support",
  "model": "meta-llama/llama-3.1-70b-instruct",
  "system_prompt": "You are a friendly customer support agent. Always be helpful and professional.",
  "use_rag": true,
  "rag_collection": "support-docs",
  "rag_top_k": 3,
  "memory_length": 20,
  "temperature": 0.5,
  "max_tokens": 800,
  "fallback_responses": [
    "I'm having trouble processing that request. Please try again.",
    "Let me connect you with a human agent who can better assist you."
  ]
}
```

---

## Integration Examples

### Python - Standard OpenAI API
```python
from openai import OpenAI

client = OpenAI(
    api_key="enclv_your_api_key_here",
    base_url="https://your-enclava.com/api/v1"
)

response = client.chat.completions.create(
    model="meta-llama/llama-3.1-70b-instruct",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)
```

### Python - Chatbot with RAG (OpenAI Format)
```python
from openai import OpenAI

# Point to specific chatbot endpoint
client = OpenAI(
    api_key="enclv_your_api_key_here",
    base_url="https://your-enclava.com/api/v1/chatbot/external/bot_123"
)

# Use standard OpenAI format - RAG is automatic
response = client.chat.completions.create(
    model="any",  # Model is pre-configured in chatbot
    messages=[{"role": "user", "content": "Search company policies"}]
)
print(response.choices[0].message.content)
```

### Python - Custom Chatbot API
```python
import requests

# Simple format with conversation management
response = requests.post(
    "https://your-enclava.com/api/v1/chatbot/external/bot_123/chat",
    headers={"Authorization": "Bearer enclv_your_api_key_here"},
    json={
        "message": "I need help with billing",
        "conversation_id": "user_session_456"  # Optional
    }
)

data = response.json()
print(f"Bot: {data['response']}")
print(f"Conversation ID: {data['conversation_id']}")

# Continue conversation
follow_up = requests.post(
    "https://your-enclava.com/api/v1/chatbot/external/bot_123/chat",
    headers={"Authorization": "Bearer enclv_your_api_key_here"},
    json={
        "message": "How do I update my payment method?",
        "conversation_id": data['conversation_id']
    }
)
```

### JavaScript/Node.js - Custom Chatbot API
```javascript
// Initial message
const response = await fetch(
    'https://your-enclava.com/api/v1/chatbot/external/bot_123/chat',
    {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer enclv_your_api_key_here',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Hello, I need assistance'
        })
    }
);

const data = await response.json();
console.log('Bot:', data.response);
const conversationId = data.conversation_id;

// Follow-up with context
const followUp = await fetch(
    'https://your-enclava.com/api/v1/chatbot/external/bot_123/chat',
    {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer enclv_your_api_key_here',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Can you help with account recovery?',
            conversation_id: conversationId
        })
    }
);
```

### cURL Examples

**Standard OpenAI API:**
```bash
curl -X POST https://your-enclava.com/api/v1/chat/completions \
  -H "Authorization: Bearer enclv_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "meta-llama/llama-3.1-70b-instruct",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

**Chatbot with RAG:**
```bash
curl -X POST https://your-enclava.com/api/v1/chatbot/external/bot_123/chat/completions \
  -H "Authorization: Bearer enclv_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Search documentation"}]
  }'
```

**Custom Chatbot API:**
```bash
curl -X POST https://your-enclava.com/api/v1/chatbot/external/bot_123/chat \
  -H "Authorization: Bearer enclv_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need help",
    "conversation_id": "session_789"
  }'
```

---

## Rate Limits and Quotas

All APIs share the same rate limiting structure based on your API key tier:

| Tier | Requests/Min | Requests/Hour | Requests/Day |
|------|-------------|---------------|--------------|
| **Standard** | 60 | 1,000 | 10,000 |
| **Premium** | 300 | 5,000 | 50,000 |
| **Enterprise** | Custom | Custom | Custom |

Rate limit headers are included in all responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Unix timestamp when limit resets

---

## Error Handling

All APIs return consistent error responses:

```json
{
  "error": {
    "message": "Invalid API key",
    "type": "authentication_error",
    "code": "invalid_api_key"
  }
}
```

Common error codes:
- `401`: Invalid or missing API key
- `403`: Insufficient permissions or quota exceeded
- `404`: Resource not found (chatbot, model, etc.)
- `429`: Rate limit exceeded
- `500`: Internal server error

---

## Integration Examples

### Python - Standard OpenAI API
```python
from openai import OpenAI

client = OpenAI(
    api_key="enclv_your_api_key_here",
    base_url="https://your-enclava.com/api/v1"
)

response = client.chat.completions.create(
    model="meta-llama/llama-3.1-70b-instruct",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)
```

### Python - Chatbot with RAG (OpenAI Format)
```python
from openai import OpenAI

# Point to specific chatbot endpoint
client = OpenAI(
    api_key="enclv_your_api_key_here",
    base_url="https://your-enclava.com/api/v1/chatbot/external/bot_123"
)

# Use standard OpenAI format - RAG is automatic
response = client.chat.completions.create(
    model="any",  # Model is pre-configured in chatbot
    messages=[{"role": "user", "content": "Search company policies"}]
)
print(response.choices[0].message.content)
```

### Python - Custom Chatbot API
```python
import requests

# Simple format with conversation management
response = requests.post(
    "https://your-enclava.com/api/v1/chatbot/external/bot_123/chat",
    headers={"Authorization": "Bearer enclv_your_api_key_here"},
    json={
        "message": "I need help with billing",
        "conversation_id": "user_session_456"  # Optional
    }
)

data = response.json()
print(f"Bot: {data['response']}")
print(f"Conversation ID: {data['conversation_id']}")

# Continue conversation
follow_up = requests.post(
    "https://your-enclava.com/api/v1/chatbot/external/bot_123/chat",
    headers={"Authorization": "Bearer enclv_your_api_key_here"},
    json={
        "message": "How do I update my payment method?",
        "conversation_id": data['conversation_id']
    }
)
```

### JavaScript/Node.js - Standard OpenAI API
```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: 'enclv_your_api_key_here',
    baseURL: 'https://your-enclava.com/api/v1'
});

const completion = await openai.chat.completions.create({
    model: 'meta-llama/llama-3.1-70b-instruct',
    messages: [{ role: 'user', content: 'Hello!' }]
});

console.log(completion.choices[0].message.content);
```

### JavaScript/Node.js - Chatbot with RAG (OpenAI Format)
```javascript
import OpenAI from 'openai';

// Point to specific chatbot endpoint
const openai = new OpenAI({
    apiKey: 'enclv_your_api_key_here',
    baseURL: 'https://your-enclava.com/api/v1/chatbot/external/bot_123'
});

// Use standard OpenAI format - RAG is automatic
const completion = await openai.chat.completions.create({
    model: 'any',  // Model is pre-configured in chatbot
    messages: [{ role: 'user', content: 'Search company policies' }]
});

console.log(completion.choices[0].message.content);
```

### JavaScript/Node.js - Custom Chatbot API
```javascript
// Initial message
const response = await fetch(
    'https://your-enclava.com/api/v1/chatbot/external/bot_123/chat',
    {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer enclv_your_api_key_here',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Hello, I need assistance'
        })
    }
);

const data = await response.json();
console.log('Bot:', data.response);
const conversationId = data.conversation_id;

// Follow-up with context
const followUp = await fetch(
    'https://your-enclava.com/api/v1/chatbot/external/bot_123/chat',
    {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer enclv_your_api_key_here',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Can you help with account recovery?',
            conversation_id: conversationId
        })
    }
);
```

### cURL Examples

**Standard OpenAI API:**
```bash
curl -X POST https://your-enclava.com/api/v1/chat/completions \
  -H "Authorization: Bearer enclv_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "meta-llama/llama-3.1-70b-instruct",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

**Chatbot with RAG:**
```bash
curl -X POST https://your-enclava.com/api/v1/chatbot/external/bot_123/chat/completions \
  -H "Authorization: Bearer enclv_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Search documentation"}]
  }'
```

**Custom Chatbot API:**
```bash
curl -X POST https://your-enclava.com/api/v1/chatbot/external/bot_123/chat \
  -H "Authorization: Bearer enclv_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need help",
    "conversation_id": "session_789"
  }'
```

---

*Complete API documentation with interactive examples is available at `/api/v1/docs` when running your Enclava instance.*