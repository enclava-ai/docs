---
sidebar_position: 4
---

# Deployment Guide

Complete deployment guide for the Enclava platform, covering development setup, production deployment, configuration management, and operational best practices.

## Quick Start

### Prerequisites

- **Docker & Docker Compose**: Latest versions recommended
- **Git**: For cloning the repository
- **Minimum System Requirements**: 4GB RAM, 2 CPU cores, 10GB storage

### Development Deployment

Get Enclava running locally in under 5 minutes:

```bash
# Clone the repository
git clone <your-enclava-repo>
cd enclava

# Start the platform
docker compose up --build

# Access the application
open http://localhost:80
```

**Default Access:**
- **Main Application**: http://localhost:80 (Nginx proxy)
- **Frontend Direct**: http://localhost:3002 (Development)
- **API Documentation**: http://localhost:80/api/v1/docs
- **Qdrant Dashboard**: http://localhost:56333/dashboard

## Docker Architecture

### Service Overview

```yaml
services:
  enclava-nginx:       # Reverse proxy and load balancer
  enclava-migrate:     # Database migration runner
  enclava-backend:     # FastAPI application server
  enclava-frontend:    # Next.js web interface
  enclava-postgres:    # Primary database
  enclava-redis:       # Cache and session store
  enclava-qdrant:      # Vector database for RAG
  privatemode-proxy:   # Confidential computing proxy
```

### Port Configuration

| Service | Internal Port | External Port | Purpose |
|---------|---------------|---------------|---------|
| Nginx | 80 | 80 | Main application access |
| Frontend | 3000 | 3002 | Direct frontend development |
| Backend | 8000 | - | Internal API (via Nginx) |
| PostgreSQL | 5432 | - | Database access |
| Redis | 6379 | - | Cache and sessions |
| Qdrant | 6333 | 56333 | Vector database UI |
| Privatemode | 8080 | 58080 | TEE proxy service |

### Network Architecture

```
Internet → Nginx (80) → {
  /api/* → Backend (8000)
  /* → Frontend (3000)
}

Backend ↔ PostgreSQL (5432)
Backend ↔ Redis (6379) 
Backend ↔ Qdrant (6333)
Backend ↔ Privatemode (8080)
```

## Configuration Management

### Environment Variables

Create a `.env` file in the project root:

```bash
# Core Platform Configuration
JWT_SECRET=your-super-secret-jwt-key-here
DATABASE_URL=postgresql://enclava_user:enclava_pass@enclava-postgres:5432/enclava_db
REDIS_URL=redis://enclava-redis:6379

# Application Settings
BASE_URL=http://localhost:80
ADMIN_USER=admin
ADMIN_PASSWORD=secure_admin_password

# LLM Service Configuration
PRIVATEMODE_API_KEY=your-privatemode-api-key
LLM_ENCRYPTION_KEY=your-llm-encryption-key

# Development & Debugging
LOG_LLM_PROMPTS=false
APP_DEBUG=false
APP_LOG_LEVEL=INFO

# Port Configuration (Internal)
BACKEND_INTERNAL_PORT=8000
FRONTEND_INTERNAL_PORT=3000
```

### Security Configuration

**JWT Secret Generation:**
```bash
# Generate secure JWT secret
openssl rand -hex 32
```

**API Key Encryption:**
```bash
# Generate LLM encryption key
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

### Database Configuration

**PostgreSQL Settings:**
```yaml
# docker-compose.yml
enclava-postgres:
  image: postgres:16
  environment:
    POSTGRES_DB: enclava_db
    POSTGRES_USER: enclava_user
    POSTGRES_PASSWORD: enclava_pass
  volumes:
    - enclava-postgres-data:/var/lib/postgresql/data
```

**Automated Migrations:**
```yaml
enclava-migrate:
  build: 
    context: ./backend
    dockerfile: Dockerfile.migrate
  depends_on:
    - enclava-postgres
  command: ["/usr/local/bin/migrate.sh"]
  restart: "no"  # Run once and exit
```

## Production Deployment

### Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
name: enclava-production

services:
  enclava-nginx:
    image: nginx:alpine
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx/nginx.prod.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - enclava-backend
      - enclava-frontend
    restart: unless-stopped
    
  enclava-backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
      - PRIVATEMODE_API_KEY=${PRIVATEMODE_API_KEY}
      - APP_DEBUG=false
      - APP_LOG_LEVEL=WARNING
    volumes:
      - ./logs:/app/logs
      - ./storage:/app/storage
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      
  enclava-frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    environment:
      - NODE_ENV=production
      - BASE_URL=${BASE_URL}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### SSL/TLS Configuration

**Nginx SSL Configuration:**
```nginx
# nginx.prod.conf
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # API routing
    location /api/ {
        proxy_pass http://enclava-backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Frontend routing
    location / {
        proxy_pass http://enclava-frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### Database Production Setup

**External PostgreSQL:**
```bash
# Environment variables for external database
DATABASE_URL=postgresql://enclava_user:secure_password@postgres.example.com:5432/enclava_production
```

**Database Security:**
- Enable SSL connections
- Use strong passwords
- Configure firewall rules
- Regular backups with encryption
- Connection pooling limits

**Backup Strategy:**
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL | gzip > "enclava_backup_${DATE}.sql.gz"
aws s3 cp "enclava_backup_${DATE}.sql.gz" s3://your-backup-bucket/
```

## Security Hardening

### Production Security Checklist

**Application Security**
- [ ] Strong JWT secret (32+ characters)
- [ ] Encrypted API keys in database
- [ ] HTTPS-only configuration
- [ ] Secure session cookies
- [ ] Rate limiting enabled
- [ ] Threat detection active

**Infrastructure Security**
- [ ] Firewall configured (allow only 80, 443)
- [ ] SSH key-based authentication
- [ ] Regular security updates
- [ ] Log monitoring configured
- [ ] Backup encryption enabled
- [ ] Network segmentation

**Data Protection**
- [ ] Database encryption at rest
- [ ] Redis password authentication
- [ ] File storage encryption
- [ ] Audit logging enabled
- [ ] GDPR compliance measures

### Firewall Configuration

**Ubuntu/Debian (UFW):**
```bash
# Basic firewall setup
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

**Docker Network Security:**
```yaml
# Isolated network
networks:
  enclava-net:
    driver: bridge
    internal: false
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

## Monitoring & Observability

### Health Checks

**Application Health:**
```bash
# Backend health
curl -f http://localhost:80/health

# Database connectivity
curl -f http://localhost:80/api/v1/health/db

# LLM providers
curl -f http://localhost:80/api/v1/llm/providers/status
```

**Service Health Monitoring:**
```yaml
# docker-compose monitoring
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Logging Configuration

**Centralized Logging:**
```yaml
# Add to all services
logging:
  driver: "json-file"
  options:
    max-size: "200m"
    max-file: "10"
```

**Log Aggregation:**
```bash
# View all service logs
docker compose logs -f

# Specific service logs
docker compose logs -f enclava-backend
docker compose logs -f enclava-frontend

# Follow new logs only
docker compose logs -f --tail=100
```

### Metrics & Analytics

**Built-in Analytics:**
- Request tracking and response times
- API usage by key and model
- Error rates and status codes
- Cost tracking and budget monitoring

**External Monitoring:**
```yaml
# Add Prometheus metrics
enclava-prometheus:
  image: prom/prometheus
  ports:
    - "9090:9090"
  volumes:
    - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    
enclava-grafana:
  image: grafana/grafana
  ports:
    - "3001:3000"
  volumes:
    - grafana-data:/var/lib/grafana
```

## Operational Procedures

### Backup Procedures

**Database Backup:**
```bash
#!/bin/bash
# daily-backup.sh
docker compose exec -T enclava-postgres pg_dump -U enclava_user enclava_db | \
  gzip > "backup/enclava_$(date +%Y%m%d).sql.gz"

# Cleanup old backups (keep 30 days)
find backup/ -name "enclava_*.sql.gz" -mtime +30 -delete
```

**Configuration Backup:**
```bash
# Backup configuration files
tar -czf "config_backup_$(date +%Y%m%d).tar.gz" \
  .env \
  docker-compose.yml \
  nginx/ \
  ssl/
```

### Update Procedures

**Application Updates:**
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart services
docker compose down
docker compose up --build -d

# Check health
docker compose ps
curl -f http://localhost:80/health
```

**Database Migrations:**
```bash
# Run migrations manually if needed
docker compose exec enclava-backend alembic upgrade head

# Check migration status
docker compose exec enclava-backend alembic current
```

### Scaling Considerations

**Horizontal Scaling:**
```yaml
# Scale backend instances
enclava-backend:
  scale: 3
  
# Load balancer configuration
enclava-nginx:
  volumes:
    - ./nginx/nginx.scaled.conf:/etc/nginx/nginx.conf:ro
```

**Resource Limits:**
```yaml
enclava-backend:
  deploy:
    resources:
      limits:
        cpus: '2.0'
        memory: 4G
      reservations:
        cpus: '0.5'
        memory: 1G
```

## Troubleshooting

### Common Issues

**Service Won't Start:**
```bash
# Check service status
docker compose ps

# View service logs
docker compose logs enclava-backend

# Check resource usage
docker stats
```

**Database Connection Issues:**
```bash
# Test database connection
docker compose exec enclava-postgres pg_isready

# Check connection from backend
docker compose exec enclava-backend python -c "
from app.db.database import engine
print(engine.url)
"
```

**Migration Failures:**
```bash
# Check migration status
docker compose exec enclava-backend alembic current

# View migration history
docker compose exec enclava-backend alembic history

# Run specific migration
docker compose exec enclava-backend alembic upgrade head
```

### Performance Issues

**High Memory Usage:**
```bash
# Monitor container resources
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Check Redis memory usage
docker compose exec enclava-redis redis-cli info memory
```

**Slow API Responses:**
```bash
# Check LLM provider status
curl http://localhost:80/api/v1/llm/providers/status

# Monitor database performance
docker compose exec enclava-postgres pg_stat_activity
```

### Recovery Procedures

**Database Recovery:**
```bash
# Stop services
docker compose stop enclava-backend

# Restore from backup
gunzip < backup/enclava_20240115.sql.gz | \
  docker compose exec -T enclava-postgres psql -U enclava_user -d enclava_db

# Restart services
docker compose start enclava-backend
```

**Complete System Recovery:**
```bash
# Stop all services
docker compose down

# Restore volumes
docker volume rm enclava_enclava-postgres-data
docker volume create enclava_enclava-postgres-data

# Restore from backup and restart
docker compose up -d
```

---

*For additional deployment support and advanced configurations, please refer to the platform's operational runbooks and monitoring guides.*