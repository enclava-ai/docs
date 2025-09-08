---
sidebar_position: 1
---

# Confidential Computing for Enclava

## Overview

Enclava uses confidential computing to protect sensitive data during AI processing. This technology ensures your data remains encrypted even while being processed by AI models.

## Key Concepts

**Trusted Execution Environments (TEEs)**: Hardware-secured areas where data is processed in isolation. Even cloud providers and system administrators cannot access data inside a TEE.

**Remote Attestation**: Cryptographic proof that your workload is running in a genuine, unmodified TEE before processing begins.

**End-to-End Encryption**: Data remains encrypted from client to TEE, during processing, and back to client.

## Security Guarantees

### What TEEs Protect Against
- **Cloud Provider Access**: Administrators cannot view your data
- **Host OS Compromise**: Malicious software on the host cannot access TEE memory
- **Physical Attacks**: Hardware-level memory encryption prevents physical extraction
- **Co-tenant Threats**: Other workloads on the same hardware cannot access your data

### Known Limitations
- Some side-channel attacks remain partially mitigated
- Performance overhead of 3-5% for encryption operations
- Requires trust in hardware manufacturer's implementation

## Technologies Used by Enclava

### NVIDIA H100 TEEs
- Hardware-accelerated AI inference with GPU memory encryption
- Multi-Instance GPU (MIG) for secure workload isolation
- Used for high-performance model serving

Learn more: [NVIDIA Confidential Computing](https://developer.nvidia.com/confidential-computing)

### privatemode.ai
- Confidential LLM inference service
- No data retention or logging
- Verified TEE deployment with attestation

Learn more: [privatemode.ai Security](https://privatemode.ai/security)

## Further Reading

- [Confidential Computing Consortium](https://confidentialcomputing.io/) - Industry standards and best practices
- [Intel SGX Documentation](https://www.intel.com/content/www/us/en/developer/tools/software-guard-extensions/overview.html)
- [AMD SEV Technology](https://www.amd.com/en/developer/sev.html)

---

*For detailed implementation specifics, see the [NVIDIA TEE](/confidential-computing/nvidia-enclaves/overview) and [privatemode.ai](/confidential-computing/privatemode/overview) sections.*