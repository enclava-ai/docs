---
sidebar_position: 2
---

# Privatemode.ai Technical Architecture

A deep dive into the technical architecture of privatemode.ai, examining how confidential computing is implemented for secure AI inference at scale.

## System Architecture Overview

### High-Level Architecture

**System Architecture Components:**

**User Environment:** Client Application → privatemode-proxy → API Integration

**Public Internet:** Encrypted Communication Channel

**Scaleway Cloud Infrastructure:** Load Balancer → Attestation Service → Confidential Computing Nodes (Multiple TEE Environments)

**TEE Internal Components:** vLLM Engine → Model Storage → Inference Pipeline → Memory Encryption

![Privatemode.ai Architecture](https://docs.privatemode.ai/assets/images/privatemode-architecture-overview.png)

*Reference: [Privatemode.ai Technical Documentation](https://docs.privatemode.ai/architecture/overview)*

## Client-Side Architecture

### privatemode-proxy Component

The client-side proxy is the critical security component that ensures end-to-end protection:

#### Core Functions

```typescript
interface PrivatemodeProxy {
  // Attestation and Trust Establishment
  attestateServer(endpoint: string): Promise<AttestationResult>
  verifyTrustedExecutionEnvironment(): Promise<boolean>
  
  // Encryption and Key Management  
  establishSecureChannel(): Promise<EncryptionContext>
  deriveSessionKeys(): Promise<KeyPair>
  
  // Secure Communication
  encryptRequest(payload: InferenceRequest): Promise<EncryptedRequest>
  decryptResponse(payload: EncryptedResponse): Promise<InferenceResponse>
}
```

#### Attestation Process

**Attestation Process Steps:**
1. Client initializes connection through proxy
2. Proxy requests attestation evidence from TEE
3. TEE generates evidence via attestation service
4. Attestation service signs the evidence
5. TEE returns signed evidence to proxy
6. Proxy verifies the evidence chain
7. Proxy returns attestation result to client
8. **If successful:** Secure channel establishment and key exchange
9. **If failed:** Connection rejection

*For detailed attestation flows, see: [Privatemode.ai Security Documentation](https://docs.privatemode.ai/security)*

### API Integration Patterns

#### Standard Integration
```python
import privatemode

# Initialize with automatic attestation
client = privatemode.Client(
    endpoint="https://api.privatemode.ai",
    api_key="your-api-key",
    attestation_policy="strict"
)

# Secure inference call
response = client.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": "Sensitive query"}],
    encrypted=True
)
```

#### Advanced Configuration
```python
# Custom attestation configuration
config = privatemode.Config(
    attestation_timeout=30,
    key_rotation_interval=3600,
    encryption_algorithm="AES-256-GCM",
    verify_model_integrity=True
)

client = privatemode.Client(endpoint="...", config=config)
```

## Server-Side Architecture

### Trusted Execution Environment Setup

#### Hardware Platform Configuration

**Scaleway Infrastructure:**
- **Instance Type**: Confidential Computing VMs
- **CPU Support**: Intel SGX or AMD SEV-based TEEs
- **Memory**: Hardware-encrypted RAM
- **Storage**: Encrypted persistent storage
- **Network**: Secure network isolation

#### TEE Initialization Process

**TEE Initialization Sequence:**
1. Hardware Boot
2. Secure Boot Verification  
3. TEE Enclave Creation
4. Memory Encryption Setup
5. Load AI Model
6. Initialize vLLM Engine
7. Start Attestation Service
8. Register with Load Balancer
9. Ready for Inference

*This process ensures hardware-verified, secure initialization of the confidential AI inference environment.*

### vLLM Integration Architecture

#### Confidential vLLM Configuration

```yaml
# vLLM Confidential Computing Configuration
model:
  name: "llama-2-7b-chat"
  path: "/encrypted/models/llama-2-7b"
  trust_domain: "privatemode-inference"

engine:
  tensor_parallel_size: 1
  max_model_len: 4096
  block_size: 16
  max_num_batched_tokens: 8192
  
security:
  memory_encryption: true
  model_integrity_check: true
  output_sanitization: true
  logging_disabled: true

attestation:
  measurement_log: true
  remote_attestation: true
  policy_enforcement: strict
```

#### Inference Pipeline Security

**Inference Pipeline Security Flow:**

**Encrypted Input Processing:** Encrypted Request → Decrypt in TEE → Input Validation → Tokenization

**Secure Model Execution:** Model Loading → Inference Computation → Output Generation  

**Encrypted Output Processing:** Output Sanitization → Response Encryption → Secure Transmission

*All processing occurs within the hardware-protected TEE environment with no plaintext exposure.*

## Security Architecture

### Trust Model Implementation

#### Hardware Root of Trust

**Trust Model Architecture Layers:**

**Hardware Trust Foundation:**
- CPU Security Features → Secure Boot
- Hardware Random Number Generator → Measured Boot  
- Secure Key Storage → TEE Firmware
- Memory Encryption Engine → Attestation Keys

**Firmware Trust Layer:**
- Secure Boot → TEE Runtime
- Measured Boot → vLLM Enclave
- TEE Firmware → Attestation Service
- Attestation Keys → Key Management

**Software Trust Layer:** TEE Runtime, vLLM Enclave, Attestation Service, Key Management

*Each layer builds upon the previous to establish a complete chain of trust from hardware to application.*

### Cryptographic Implementation

#### Key Management Architecture

**Key Management and Communication Flow:**

**Key Derivation Process:**
1. Client initiates session with TEE
2. TEE requests hardware seed from HSM
3. HSM returns cryptographic entropy
4. TEE derives session-specific keys
5. Key metadata stored in KMS  
6. KMS confirms secure storage
7. Session establishment confirmed to client

**Secure Communication:**
1. Client sends encrypted request to TEE
2. TEE decrypts using session key
3. Processing occurs in secure memory
4. Response encrypted with session key  
5. Encrypted response returned to client

*All key operations occur within hardware-protected environments with perfect forward secrecy.*

#### Encryption Specifications

**Data in Transit:**
- **Algorithm**: TLS 1.3 with additional end-to-end encryption
- **Key Exchange**: ECDH with P-384 curve
- **Symmetric Encryption**: AES-256-GCM
- **Authentication**: HMAC-SHA-256

**Data in Processing:**
- **Memory Encryption**: Hardware-based AES-128/256
- **Key Derivation**: HKDF with hardware entropy
- **Key Rotation**: Automatic every 1 hour
- **Perfect Forward Secrecy**: Per-session ephemeral keys

### Attestation Implementation

#### Remote Attestation Protocol

**Remote Attestation Protocol Steps:**
1. Verifier requests attestation quote from service
2. Attestation service generates quote request for TEE
3. TEE collects hardware measurements  
4. Hardware provides cryptographic evidence
5. TEE creates signed attestation quote
6. Attestation service returns quote with certificates
7. Verifier validates the chain of trust
8. Verification result communicated back to service

*This protocol ensures cryptographic proof of platform integrity before any data processing.*

#### Evidence Structure

```json
{
  "version": "1.0",
  "timestamp": "2024-01-15T10:30:00Z",
  "platform": {
    "tee_type": "SGX",
    "cpu_svn": "0x0001",
    "platform_svn": "0x0002"
  },
  "measurements": {
    "mr_enclave": "sha256:abcd1234...",
    "mr_signer": "sha256:efgh5678...",
    "config_id": "sha256:ijkl9012..."
  },
  "attributes": {
    "debug_mode": false,
    "production_mode": true,
    "key_sharing": false
  },
  "signature": {
    "algorithm": "ECDSA-P256",
    "value": "base64:signature_data..."
  }
}
```

## Performance Architecture

### Optimization Strategies

#### Model Optimization in TEEs

```yaml
performance_optimizations:
  model_serving:
    - quantization: "INT8 with dynamic range"
    - batching: "dynamic batching with timeout"
    - caching: "KV-cache optimization"
    - memory_management: "efficient tensor allocation"
  
  tee_specific:
    - encrypted_memory_access: "optimized access patterns"
    - attestation_caching: "cached attestation results"
    - key_reuse: "session key persistence"
    - secure_channels: "connection pooling"

monitoring:
  metrics:
    - inference_latency_p99
    - encryption_overhead_percent
    - memory_utilization_tee
    - attestation_success_rate
```

#### Scalability Patterns

**Scalability Architecture:**

**Load Distribution Flow:**
API Gateway → Health Check → Load Balancer → Multiple TEE Instances

**Auto Scaling Process:**
1. Metrics Collector gathers performance data from TEE instances
2. Scaling Controller analyzes demand and capacity
3. TEE Provisioning creates new confidential instances
4. Attestation Verification ensures new instances are secure
5. Service Registration adds verified instances to load balancer

*This enables automatic, secure scaling while maintaining confidential computing guarantees.*

## Deployment Architecture

### Container Integration

#### Confidential Container Configuration

```dockerfile
# Dockerfile for privatemode.ai confidential inference
FROM confidential-base:latest

# Install vLLM with confidential computing support
RUN pip install vllm-confidential==0.2.1

# Copy model files (encrypted)
COPY --encrypted models/ /opt/models/

# Configure TEE runtime
COPY tee-config.json /etc/tee/config.json

# Set up attestation service
COPY attestation-service /usr/local/bin/

EXPOSE 8080
CMD ["python", "-m", "privatemode.server"]
```

#### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: privatemode-inference
spec:
  replicas: 3
  selector:
    matchLabels:
      app: privatemode-inference
  template:
    metadata:
      labels:
        app: privatemode-inference
      annotations:
        confidential-computing: "true"
        tee-type: "SGX"
    spec:
      nodeSelector:
        confidential-computing: "enabled"
      containers:
      - name: inference-engine
        image: privatemode/inference:latest
        resources:
          requests:
            sgx/epc: "512Mi"
            memory: "16Gi"
          limits:
            sgx/epc: "1Gi"
            memory: "32Gi"
        env:
        - name: TEE_MODE
          value: "production"
        - name: ATTESTATION_URL
          value: "https://attestation.privatemode.ai"
```

## Operational Architecture

### Monitoring and Observability

#### Security Monitoring

```yaml
monitoring_stack:
  security_metrics:
    - attestation_failures
    - encryption_errors
    - unauthorized_access_attempts
    - key_rotation_events
    
  performance_metrics:
    - inference_latency
    - throughput_per_tee
    - memory_utilization
    - encryption_overhead
    
  availability_metrics:
    - tee_health_status
    - service_uptime
    - error_rate
    - capacity_utilization

alerting:
  critical_alerts:
    - attestation_failure
    - tee_compromise_detected
    - encryption_key_compromise
    - service_unavailable
```

#### Log Management

```json
{
  "log_policy": {
    "plaintext_logging": "forbidden",
    "encrypted_metrics": "allowed",
    "audit_events": "required",
    "retention_policy": "30_days_encrypted"
  },
  "audit_events": [
    "attestation_requests",
    "key_generation",
    "session_establishment",
    "policy_violations"
  ]
}
```

---

*This technical architecture demonstrates how confidential computing can be practically implemented for production AI services, providing strong security guarantees while maintaining performance and scalability.*