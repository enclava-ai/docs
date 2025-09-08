---
sidebar_position: 3
---

# API Reference

Complete API documentation for the Enclava platform, covering both public and internal APIs with authentication, request/response formats, and integration examples.



## Chat Completion API (`/api/v1/`)

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


### Chatbot <!-- Services -->

#### Simple Chat Interface

Basic message/response interaction.

```http
POST /api/v1/chatbot/external/{chatbot_id}/chat
```

**Request Body:**
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
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### OpenAI-Compatible Chat

Uses standard OpenAI format for compatibility.

```http
POST /api/v1/chatbot/external/{chatbot_id}/chat/completions
```

**Request/Response:** Same as standard OpenAI format above.

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
```

## Integration Examples

### Standard OpenAI API

#### Python
```python
from openai import OpenAI

client = OpenAI(
    api_key="enclv_your_api_key_here",
    base_url="https://your-enclava-instance.com/api/v1"
)

response = client.chat.completions.create(
    model="privatemode-llama-3-70b",
    messages=[{"role": "user", "content": "What is confidential computing?"}],
    temperature=0.7
)

print(response.choices[0].message.content)
```

#### JavaScript
```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: 'enclv_your_api_key_here',
    baseURL: 'https://your-enclava-instance.com/api/v1'
});

const response = await openai.chat.completions.create({
    model: 'privatemode-llama-3-70b',
    messages: [{ role: 'user', content: 'What is a TEE?' }]
});

console.log(response.choices[0].message.content);
```

#### cURL
```bash
curl -X POST https://your-enclava-instance.com/api/v1/chat/completions \
  -H "Authorization: Bearer enclv_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "privatemode-llama-3-70b",
    "messages": [{"role": "user", "content": "Hello!"}],
    "temperature": 0.7
  }'
```

### Chatbot Simple API

#### Python
```python
import requests

response = requests.post(
    "https://your-enclava-instance.com/api/v1/chatbot/external/your-chatbot-id/chat",
    headers={"Authorization": "Bearer enclv_your_api_key_here"},
    json={"message": "I need help with billing"}
)

data = response.json()
print(data["response"])
```

#### JavaScript
```javascript
const response = await fetch(
    'https://your-enclava-instance.com/api/v1/chatbot/external/your-chatbot-id/chat',
    {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer enclv_your_api_key_here',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: 'I need help with billing' })
    }
);

const data = await response.json();
console.log(data.response);
```

#### cURL
```bash
curl -X POST https://your-enclava-instance.com/api/v1/chatbot/external/your-chatbot-id/chat \
  -H "Authorization: Bearer enclv_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{"message": "I need help with billing"}'
```

### Chatbot OpenAI API

#### Python
```python
from openai import OpenAI

client = OpenAI(
    api_key="enclv_your_api_key_here",
    base_url="https://your-enclava-instance.com/api/v1/chatbot/external/your-chatbot-id"
)

response = client.chat.completions.create(
    model="any",  # Model determined by chatbot config
    messages=[{"role": "user", "content": "Help me with customer support"}]
)

print(response.choices[0].message.content)
```

#### JavaScript
```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: 'enclv_your_api_key_here',
    baseURL: 'https://your-enclava-instance.com/api/v1/chatbot/external/your-chatbot-id'
});

const response = await openai.chat.completions.create({
    model: 'any',
    messages: [{ role: 'user', content: 'I need technical support' }]
});

console.log(response.choices[0].message.content);
```

#### cURL
```bash
curl -X POST https://your-enclava-instance.com/api/v1/chatbot/external/your-chatbot-id/chat/completions \
  -H "Authorization: Bearer enclv_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "any",
    "messages": [{"role": "user", "content": "Hi there!"}]
  }'
```

 
*Complete API documentation with interactive examples is available at `/api/v1/docs` when running your Enclava instance.*