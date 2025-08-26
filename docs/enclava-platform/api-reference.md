---
sidebar_position: 3
---

# API Reference

Complete API documentation for the Enclava platform, covering both public and internal APIs with authentication, request/response formats, and integration examples.

## Authentication

Enclava supports two authentication methods depending on the API tier:

### API Key Authentication (Public API)
For external integrations and programmatic access:

```http
Authorization: Bearer enclv_1234567890abcdef
```

**API Key Tiers:**
- **Standard**: 1,000 requests/min, 20,000/hour
- **Premium**: 5,000 requests/min, 100,000/hour

### JWT Token Authentication (Internal API)
For web application frontend access:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**User Tiers:**
- **Authenticated Users**: 300 requests/min, 5,000/hour

## Public API (`/api/v1/`)

External client access with OpenAI compatibility for seamless integration.

### LLM Services

#### Chat Completions

Create a chat completion response for the given conversation.

```http
POST /api/v1/chat/completions
```

**Request Body:**
```json
{
  "model": "privatemode-llama-3-70b",
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
  "model": "privatemode-llama-3-70b",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Confidential computing is a security model..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 150,
    "total_tokens": 175
  }
}
```

**Parameters:**
- `model` (required): Model identifier
- `messages` (required): Array of conversation messages
- `temperature` (optional): Sampling temperature (0-2)
- `max_tokens` (optional): Maximum tokens to generate
- `stream` (optional): Stream partial message deltas
- `stop` (optional): Stop sequences
- `presence_penalty` (optional): Presence penalty (-2 to 2)
- `frequency_penalty` (optional): Frequency penalty (-2 to 2)

#### List Models

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
      "id": "privatemode-llama-3-70b",
      "object": "model",
      "created": 1686935002,
      "owned_by": "privatemode",
      "permission": [],
      "root": "privatemode-llama-3-70b",
      "parent": null
    },
    {
      "id": "privatemode-llama-3-8b",
      "object": "model", 
      "created": 1686935002,
      "owned_by": "privatemode",
      "permission": [],
      "root": "privatemode-llama-3-8b",
      "parent": null
    }
  ]
}
```

#### Create Embeddings

Generate text embeddings for semantic search and RAG applications.

```http
POST /api/v1/embeddings
```

**Request Body:**
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
  "data": [
    {
      "object": "embedding",
      "index": 0,
      "embedding": [0.0023, -0.0012, ...]
    }
  ],
  "model": "text-embedding-ada-002",
  "usage": {
    "prompt_tokens": 8,
    "total_tokens": 8
  }
}
```

#### Provider Status

Check health status of LLM providers.

```http
GET /api/v1/llm/providers/status
```

**Response:**
```json
{
  "providers": [
    {
      "name": "privatemode",
      "status": "healthy",
      "models": ["privatemode-llama-3-70b", "privatemode-llama-3-8b"],
      "latency_ms": 245,
      "last_check": "2024-01-15T10:30:00Z"
    }
  ],
  "overall_status": "healthy"
}
```

### Chatbot Services

#### Interact with Chatbot

Send a message to a specific chatbot instance.

```http
POST /api/v1/chatbot/{chatbot_id}/interact
```

**Request Body:**
```json
{
  "message": "Hello, I need help with my account",
  "session_id": "session_123",
  "context": {
    "user_id": "user_456",
    "metadata": {}
  }
}
```

**Response:**
```json
{
  "response": "Hello! I'd be happy to help with your account. What specific issue are you experiencing?",
  "session_id": "session_123",
  "chatbot_id": "bot_789",
  "usage": {
    "prompt_tokens": 45,
    "completion_tokens": 28,
    "total_tokens": 73
  },
  "cost": 0.0015
}
```

#### List Chatbots

Get available chatbot instances.

```http
GET /api/v1/chatbot/list
```

**Response:**
```json
{
  "chatbots": [
    {
      "id": "bot_789",
      "name": "Support Assistant",
      "type": "customer_support", 
      "model": "privatemode-llama-3-70b",
      "description": "Customer support chatbot",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
``
## Integration Examples

### Python (OpenAI Client)

```python
import openai

# Configure client for Enclava
client = openai.OpenAI(
    api_key="enclv_your_api_key_here",
    base_url="https://your-enclava-instance.com/api/v1"
)

# Chat completion
response = client.chat.completions.create(
    model="privatemode-llama-3-70b",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain confidential computing"}
    ]
)

print(response.choices[0].message.content)
```

### JavaScript/Node.js

```javascript
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: 'enclv_your_api_key_here',
  baseURL: 'https://your-enclava-instance.com/api/v1'
});

async function chatCompletion() {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'What is a TEE?' }
    ],
    model: 'privatemode-llama-3-70b'
  });

  console.log(completion.choices[0].message);
}
```

### cURL

```bash
# Chat completion
curl -X POST https://your-enclava-instance.com/api/v1/chat/completions \
  -H "Authorization: Bearer enclv_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "privatemode-llama-3-70b",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ],
    "temperature": 0.7
  }'

# List models
curl https://your-enclava-instance.com/api/v1/models \
  -H "Authorization: Bearer enclv_your_api_key_here"
```

## Webhooks

Configure webhooks to receive real-time notifications about platform events.

### Webhook Configuration

```http
POST /api-internal/v1/webhooks
```

**Request Body:**
```json
{
  "url": "https://your-app.com/webhooks/enclava",
  "events": [
    "chatbot.message_received",
    "rag.document_processed", 
    "budget.threshold_exceeded"
  ],
  "secret": "your-webhook-secret"
}
```

### Event Payload

```json
{
  "event": "chatbot.message_received",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "chatbot_id": "bot_123",
    "conversation_id": "conv_456",
    "message": {
      "role": "user",
      "content": "Hello, I need help"
    },
    "session_id": "session_789"
  },
  "webhook_id": "webhook_012"
}
```

---

*Complete API documentation with interactive examples is available at `/api/v1/docs` when running your Enclava instance.*