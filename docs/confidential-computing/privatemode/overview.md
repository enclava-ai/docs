---
sidebar_position: 1
---

# privatemode.ai Integration

## Overview

privatemode.ai is a confidential LLM inference service that Enclava uses for processing sensitive data. It provides strong privacy guarantees through hardware-based trusted execution environments.

## Key Features

### Privacy Guarantees
- **No Data Retention**: Conversations are never stored or logged
- **No Training on User Data**: Your data is never used to improve models
- **Encrypted Processing**: All inference happens within TEEs
- **Remote Attestation**: Cryptographic proof of secure environment

### Technical Implementation
- Runs on Intel SGX and AMD SEV trusted execution environments
- End-to-end encryption from client to TEE
- Stateless inference with no persistent storage
- Regular security audits and compliance certifications



### Security Flow
1. **Request Encryption**: Enclava encrypts user prompts before transmission
2. **Attestation Check**: Verify privatemode.ai TEE status
3. **Secure Inference**: Model processes data within TEE
4. **Encrypted Response**: Results returned without data exposure



## Compliance & Certifications

- GDPR compliant data processing
- HIPAA eligible for healthcare workloads
- SOC 2 Type II certification (in progress)
- ISO 27001 compliance

## Performance Characteristics

- Latency: 50-200ms overhead for TEE operations
- Throughput: 100-500 tokens/second depending on model
- Availability: 99.9% SLA for enterprise customers

## External Resources

- [privatemode.ai Documentation](https://docs.privatemode.ai)
- [API Reference](https://api.privatemode.ai/docs)
- [Edgeless Systems](https://www.edgeless.systems/) - Company behind privatemode.ai

---

*For threat analysis, see [privatemode.ai Threat Profile](/confidential-computing/privatemode/threat-profile)*