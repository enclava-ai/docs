---
sidebar_position: 3
---

# Business Value Documentation - Research Sources

This document lists all source materials and references used in the "Why Confidential Computing Matters for Your Business" guide.

## Primary Industry Sources

### Confidential Computing Consortium
- **Organization**: Linux Foundation project, founded by Microsoft, Google, Intel, AMD, ARM, Meta, IBM
- **Website**: https://confidentialcomputing.io/
- **Purpose**: Industry standards body for confidential computing
- **Key Resource**: [The Case for Confidential Computing](https://www.linuxfoundation.org/research/confidential-computing-use-case-study)
  - Business value through protected, confidential data processing
  - Industry-wide use case research
  - Cross-vertical adoption analysis

### Linux Foundation Research
- **Report**: "The Case for Confidential Computing: Business Value Through Protected, Confidential Data Processing"
- **URL**: https://www.linuxfoundation.org/research/confidential-computing-use-case-study
- **Key Findings**:
  - Industries adopting: Healthcare, financial services, retail, manufacturing, energy, government
  - Use cases: Fraud prevention, anticorruption, records management, intelligence analysis, customer analytics, blockchain, disease diagnostics, drug development

## Technology Vendors & Specifications

### AMD Secure Encrypted Virtualization (SEV)
- **Official Documentation**: https://www.amd.com/en/developer/sev.html
- **Technologies Covered**:
  - **SEV-ES** (Encrypted State): Encrypts CPU register contents
  - **SEV-SNP** (Secure Nested Paging): Memory integrity protection, attestation
  - **SEV-TIO** (Trusted I/O): Extends protection to PCIe devices
  - **TSME**: Transparent Secure Memory Encryption

- **Hardware Support**:
  - AMD EPYC 7001 (Naples): 128 threads, 15 keys, 128-bit AES-XEX
  - AMD EPYC 7002 (Rome): 256 threads, 509 keys, Encrypted State
  - AMD EPYC 7003 (Milan): SNP support with attestation
  - AMD EPYC 9004 (Genoa): 512 threads, 1006 keys, 256-bit AES-XTS, CXL memory encryption
  - AMD EPYC 9005 (Turin): Trusted I/O (TDISP), Segmented RMP, Secure AVIC

- **Key Specifications**:
  - [SEV-SNP Firmware ABI Specification](https://www.amd.com/content/dam/amd/en/documents/developer/56860.pdf) - Version 1.58
  - [VCEK Certificate and KDS Interface](https://docs.amd.com/v/u/en-US/57230) - Attestation infrastructure
  - [Guest Hypervisor Communication Block (GHCB)](https://www.amd.com/content/dam/amd/en/documents/epyc-technical-docs/specifications/56421.pdf) - Version 2.04

- **White Papers**:
  - "AMD Memory Encryption" (October 2021)
  - "SEV-SNP: Strengthening VM Isolation with Integrity Protection and More" (January 2020)
  - "Protecting VM Register State with SEV-ES" (February 2017)

### AWS Nitro Enclaves
- **Official Documentation**: https://aws.amazon.com/ec2/nitro/nitro-enclaves/
- **Features**:
  - CPU and memory isolation via Nitro Hypervisor
  - Cryptographic attestation
  - AWS KMS integration
  - No persistent storage, no interactive access, no external networking
  - No additional charges beyond EC2 instance costs

- **Key Benefits**:
  - Fully isolated virtual machines
  - Proven isolation technology at scale
  - Flexible resource allocation (CPU cores and memory)
  - Processor agnostic (Intel and AMD)
  - Open source components for validation

### Microsoft Azure Confidential Computing
- **Official Documentation**: https://azure.microsoft.com/en-us/solutions/confidential-compute/
- **Key Points**:
  - Protects data in use via memory encryption
  - Verification of trusted execution environment
  - Prevents access by cloud operators, malicious admins, privileged software
  - Support for AMD SEV-SNP and Intel TDX

- **Use Cases Documented**:
  - Fraud and waste reduction
  - Anticorruption, antiterrorism
  - Records and evidence management
  - Intelligence analysis
  - Vulnerable population protection
  - Money laundering prevention
  - Digital currencies and blockchain
  - Customer analytics and proprietary algorithms
  - Disease diagnostics and drug development

### NVIDIA Confidential Computing
- **Official Documentation**: https://developer.nvidia.com/confidential-computing
- **Technology**: NVIDIA H100 with confidential computing
- **Features**:
  - Hardware-accelerated AI inference with GPU memory encryption
  - Multi-Instance GPU (MIG) for secure workload isolation
  - High-performance model serving with protection

## Company Case Studies & Testimonials

All case studies below are verified public statements from company websites and official documentation.

### Financial Services

#### Itaú Unibanco
- **Profile**: Brazil's largest bank
- **Use Case**: Digital assets and cryptographic key management
- **Technology**: AWS Nitro Enclaves
- **Application**: Cryptoassets custody services
- **Source**: AWS Nitro Enclaves customer testimonials (https://aws.amazon.com/ec2/nitro/nitro-enclaves/)
- **Quote**: Carlos Eduardo Mazzei, Chief Technology Officer
  - "This high-level of protection was a key factor that allowed the execution of complex solutions associated with the excellence in security, one of the main pillars of our institution."

#### Fireblocks
- **Profile**: 2,000+ financial institutions, $4T+ in digital assets transferred
- **Use Case**: Multi-party computation (MPC) wallet solution
- **Technology**: AWS Nitro Enclaves
- **Application**: Secure transaction signing for digital assets
- **Source**: AWS Nitro Enclaves customer testimonials
- **Quote**: Pavel Berengoltz, Chief Technology Officer and Co-Founder
  - "By leveraging Nitro Enclaves, we've enhanced our multi-party computation (MPC) wallet solution, allowing for secure transaction signing with Nitro System based isolation and reducing the risk involved in these critical operations."

### Identity & Access Management

#### Okta
- **Profile**: Leading Identity as a Service (IDaaS) company, 19,000+ customers
- **Use Case**: Privileged Access Management (PAM)
- **Technology**: AWS Nitro Enclaves
- **Application**: Credential vaulting, infrastructure credential management
- **Source**: AWS Nitro Enclaves customer testimonials
- **Quote**: Smitha Prasad, Director of Engineering
  - Uses Nitro Enclaves for cryptographically attested environment for credential management
  - Defense-in-depth architecture for protecting customer access

#### 1Password
- **Profile**: 100,000+ business customers
- **Use Case**: Password management with end-to-end encryption
- **Technology**: AWS Nitro Enclaves
- **Application**: Extending encryption model into cloud processing
- **Source**: AWS Nitro Enclaves customer testimonials
- **Quote**: Jacob DePriest, CISO and CIO
  - "With AWS Nitro Enclaves, we extend that end-to-end encryption model into the cloud, securely processing sensitive data in isolated, attested environments. These capabilities aren't just security features, they're trust enablers, allowing us to build enterprise-grade functionality while cryptographically proving that no one can access customer data during processing."

#### Dashlane
- **Profile**: Password manager with 20,000+ business customers
- **Use Case**: Encryption key isolation
- **Technology**: AWS Nitro Enclaves
- **Application**: Key management for password vaults
- **Source**: AWS Nitro Enclaves customer testimonials
- **Quote**: Frederic Rivain, Chief Technology Officer
  - "Using AWS Nitro Enclaves, our customers are able to cut their integration setup time in half, while ensuring the highest level of security. AWS Nitro Enclaves offer an innovative way to fully isolate the encryption keys."

### Blockchain & Cryptocurrency

#### Crypto.com
- **Profile**: 80+ million users globally
- **Use Case**: Validator infrastructure for Crypto.org Chain
- **Technology**: AWS Nitro Enclaves and AWS KMS
- **Application**: Signing of consensus protocol messages
- **Source**: AWS Nitro Enclaves customer testimonials
- **Quote**: Tomas Tauber, Chain Lead
  - "AWS Nitro Enclaves and AWS KMS make it easy for Crypto.com and our external partners to scale, deploy and manage these signing processes. AWS Nitro Enclaves provide cost-effective hardening and isolation for secure key management."

#### ACINQ
- **Profile**: Lightning Network developer and operator (Bitcoin Layer 2)
- **Use Case**: Payment node operation
- **Technology**: AWS Nitro Enclaves
- **Application**: Private key protection for Bitcoin payment channels
- **Source**: AWS Nitro Enclaves customer testimonials
- **Quote**: Fabrice Drouin, Co-Founder and CTO
  - "By running our payment nodes inside AWS Nitro Enclaves, we were able to achieve the high level of protection we need for the private keys that control our funds with nearly no code modifications."

#### Brave Browser
- **Profile**: Privacy-focused web browser
- **Use Case**: Cryptocurrency payments processing
- **Technology**: AWS Nitro Enclaves
- **Application**: Brave Rewards settlement workflow
- **Source**: AWS Nitro Enclaves customer testimonials
- **Quote**: Harold Spencer Jr., Staff Platform Engineer
  - "AWS Nitro Enclaves allow us to build guarantees into our platform that are simply not possible with traditional cloud compute. With externally reproducible builds and the attestation feature, we are able to extend these guarantees to every layer of our service."

### Data Security & Privacy

#### Evervault
- **Profile**: Encryption infrastructure platform
- **Use Case**: Core encryption engine
- **Technology**: AWS Nitro Enclaves
- **Application**: Evervault Encryption Engine (E3) - all cryptographic operations
- **Source**: AWS Nitro Enclaves customer testimonials
- **Quote**: Shane Curran, Founder & CEO
  - "E3 is built on AWS Nitro Enclaves which provides an isolated, hardened, and highly constrained compute environment for processing sensitive data. At no additional cost, Nitro Enclaves enable us to provide a highly secure, cost effective, and scalable service to our customers; a service that is capable of handling thousands of cryptographic operations per second."

#### Cape Privacy
- **Profile**: AI data security and privacy
- **Use Case**: Confidential Large Language Model inference
- **Technology**: AWS Nitro Enclaves
- **Application**: Private LLM queries with sensitive knowledge bases
- **Source**: AWS Nitro Enclaves customer testimonials
- **Quote**: Ché Wijesinghe, CEO
  - "Customers using Cape models on Amazon EC2 can be confident in Cape Privacy's approach to protect their sensitive data because they use AWS Nitro Enclaves on top of the AWS Nitro System with various privacy-preserving data processing techniques to ensure that nobody can ever see your data."

#### Footprint
- **Profile**: Data vaulting for financial and personal data
- **Use Case**: Core vaulting infrastructure
- **Technology**: AWS Nitro Enclaves
- **Application**: Storing, encrypting, and processing sensitive data
- **Source**: AWS Nitro Enclaves customer testimonials
- **Quote**: Alex Grinman, Co-founder & CTO
  - "We've architected and built Footprint's core vaulting infrastructure on top of AWS Nitro Enclaves because of the world-class security it provides: the ability to run cryptographically signed and attested code in a CPU, memory, and network isolated environment."

### Enterprise Security Solutions

#### Anjuna Security
- **Profile**: Confidential computing platform provider
- **Use Case**: Enterprise confidential computing runtime
- **Technology**: AWS Nitro Enclaves
- **Application**: Lift-and-shift for confidential applications
- **Source**: AWS Nitro Enclaves customer testimonials
- **Quote**: Ayal Yogev, CEO and Co-founder
  - "Now our customers can set up and manage isolated compute environments in EC2 to process and harden cloud workloads in minutes without recoding or refactoring applications."
  - Serves financial services, fintech, crypto, government, healthcare, and SaaS providers

#### Fortanix
- **Profile**: Confidential computing pioneer
- **Use Case**: Confidential Computing Manager
- **Technology**: AWS Nitro Enclaves (multi-cloud support)
- **Application**: Multi-party data collaboration, federated ML, confidential search
- **Source**: AWS Nitro Enclaves customer testimonials
- **Quote**: Anand Kashyap, CEO
  - "Fortanix helps customers across a variety of industries including healthcare, fintech, financial services, and manufacturing to accelerate their AWS migrations with enhanced security and protected data across its entire data life cycle."

## Additional Validated Use Cases

### M10 Networks
- **Use Case**: Central bank digital currencies (CBDC) and tokenized regulated liabilities
- **Technology**: AWS Nitro Enclaves on M6i instances
- **Application**: Signature verification and cryptographic re-signing of transaction batches

### Itaú Digital Assets
- **Use Case**: Blockchain solutions using confidential computing
- **Application**: Manipulation of cryptographic keys for crypto custody
- **Result**: Reduced attack surface while adding protection layer

## Technical Standards Organizations

### Confidential Computing Consortium Members
**Founding and Premier Members** (as documented on confidentialcomputing.io):
- Microsoft
- Google
- Intel
- AMD
- ARM
- Meta (Facebook)
- IBM
- Red Hat
- NVIDIA
- Alibaba
- Ant Group
- Baidu
- ByteDance
- Huawei
- Tencent

**Mission**: "Securing data in use and accelerating the adoption of confidential computing through open collaboration."

### Open Source Projects
- **AMDESE GitHub**: https://github.com/AMDESE/AMDSEV - Linux open source code for AMD SEV
- **Confidential Containers**: https://github.com/confidential-containers - CoCo Project for containerized confidential computing

## Academic & Industry Research

### Linux Foundation Research Team
- **Leadership**: Hilary Carter (SVP, Research), Frank Nagle (Advising Chief Economist, Harvard Business School)
- **Focus**: Empirical insights into open source trends and confidential computing adoption
- **Methodology**: Cross-sectional research across industry verticals and geographic regions

### Key Research Publications
1. "The Case for Confidential Computing" - Linux Foundation (2023)
   - Business value quantification
   - Industry adoption patterns
   - Use case taxonomy

## Regulatory & Compliance Context

### Referenced Regulations
- **GDPR** (General Data Protection Regulation): EU data privacy law
- **HIPAA** (Health Insurance Portability and Accountability Act): US healthcare data protection
- **PCI-DSS** (Payment Card Industry Data Security Standard): Credit card data protection
- **SOC2** (Service Organization Control 2): Trust services criteria for security, availability, processing integrity
- **CCPA** (California Consumer Privacy Act): California privacy law

### Compliance Benefits of Confidential Computing
As documented in Azure and AWS materials:
- Cryptographically provable data protection
- Hardware-based access controls
- Auditability through attestation logs
- Defense against insider threats
- Memory encryption during processing

## Performance & Cost Data

### Performance Overhead
- **Source**: AMD Memory Encryption White Paper (October 2021)
- **Typical overhead**: 3-5% for encryption operations
- **Note**: Varies by workload; CPU-bound tasks see minimal impact

### Cost Structure
- **Source**: AWS Nitro Enclaves documentation
- **Pricing**: No additional charges beyond standard EC2 instance costs
- **Similar**: Azure and GCP follow similar no-additional-charge models for confidential computing features

## Market Analysis

### Adoption Trends
**Source**: Linux Foundation Research, Azure documentation, AWS case studies

**Industries Leading Adoption**:
1. Financial Services & Banking
2. Healthcare & Pharmaceuticals
3. Government & Defense
4. Blockchain & Cryptocurrency
5. Identity & Access Management
6. SaaS & Cloud Service Providers

**Growth Drivers**:
- Regulatory compliance requirements (GDPR, HIPAA, etc.)
- AI/ML adoption with sensitive data
- Zero-trust architecture adoption
- Supply chain security concerns
- Multi-party computation needs

## Related Enclava Documentation

For implementation-specific details, see:
- [How Confidential Computing Works](/confidential-computing/how-it-works) - Technical deep dive
- [Privatemode.ai Overview](/confidential-computing/privatemode/overview) - Confidential LLM service
- [NVIDIA Enclaves Overview](/confidential-computing/nvidia-enclaves/overview) - GPU-accelerated confidential computing
- [Enclava Platform Architecture](/enclava-platform/architecture) - Platform implementation details

---

## Document Methodology

This business value guide was compiled from:
1. **Official vendor documentation** (AMD, AWS, Microsoft, NVIDIA)
2. **Customer testimonials** published on vendor websites
3. **Industry standards** from Confidential Computing Consortium
4. **Academic research** from Linux Foundation Research
5. **Public specifications** and white papers

All case studies are based on publicly available information and direct quotes from company officials as published on official websites (primarily AWS Nitro Enclaves customer testimonials page, accessed January 2026).

**Last Updated**: January 30, 2026  
**Compiled by**: Enclava Documentation Team  
**Review Status**: Ready for Aljaz review
