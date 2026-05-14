# 🚀 ClearPulse - Production Deployment Plan

> **Status:** Production-Ready with Flexibility for Future Changes  
> **Last Updated:** February 2026

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Environment Setup](#environment-setup)
4. [Deployment Options](#deployment-options)
5. [Database & Storage](#database--storage)
6. [Security Hardening](#security-hardening)
7. [Monitoring & Logging](#monitoring--logging)
8. [CI/CD Pipeline](#cicd-pipeline)
9. [Rollback Strategy](#rollback-strategy)
10. [Post-Deployment](#post-deployment)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│  Next.js 15 (Vercel / Netlify / AWS Amplify)               │
│  - Static pages cached at edge                              │
│  - API calls to backend                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│  FastAPI (Railway / Render / AWS ECS / DigitalOcean)       │
│  - REST API endpoints                                       │
│  - AI processing (Gemini, Groq)                            │
│  - File handling                                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
│  - InsForge (Database + Storage)                            │
│  - Gemini AI / Groq AI                                      │
│  - Tavus (Video AI)                                         │
│  - Sarvam (Voice AI)                                        │
│  - Pinata (IPFS)                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Pre-Deployment Checklist

### 1. Code Preparation
- [ ] All secrets removed from code
- [ ] `.env` files in `.gitignore`
- [ ] Error handling implemented
- [ ] API rate limiting configured
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using parameterized queries)

### 2. Dependencies
- [ ] `requirements.txt` up to date (backend)
- [ ] `package.json` locked (frontend)
- [ ] No vulnerable dependencies (`npm audit`, `pip check`)

### 3. Testing
- [ ] All API endpoints tested
- [ ] Frontend pages load correctly
- [ ] File upload/download works
- [ ] AI features functional
- [ ] Mobile responsive

### 4. Documentation
- [ ] API documentation ready
- [ ] Environment variables documented
- [ ] Deployment steps documented

---

## 🔐 Environment Setup

### Backend Environment Variables

Create a `.env` file for production (never commit this):

```bash
# ─────────────────────────────────────────────────────────────
# PRODUCTION ENVIRONMENT VARIABLES - BACKEND
# ─────────────────────────────────────────────────────────────

# AI Services
GOOGLE_API_KEY=your_production_gemini_key
GROQ_API_KEY=your_groq_api_key

# Database & Storage (InsForge)
INSFORGE_BASE_URL=https://your-insforge-instance.insforge.app
INSFORGE_SERVICE_KEY=your_production_service_key

# Video AI
TAVUS_API_KEY=your_tavus_production_key
TAVUS_REPLICA_ID=your_replica_id

# Voice AI
SARVAM_API_KEY=your_sarvam_production_key

# IPFS Storage
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_KEY=your_pinata_secret
PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs

# Security
VAULT_MASTER_KEY=generate_strong_32_char_key_here
SECRET_KEY=generate_strong_secret_for_jwt_here

# CORS - Update with your production frontend URL
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Environment
ENVIRONMENT=production
DEBUG=false
```

### Frontend Environment Variables

Create `.env.production` for frontend:

```bash
# ─────────────────────────────────────────────────────────────
# PRODUCTION ENVIRONMENT VARIABLES - FRONTEND
# ─────────────────────────────────────────────────────────────

# Backend API URL (your deployed backend)
NEXT_PUBLIC_API_URL=https://api.your-domain.com

# Blockchain (if using)
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
NEXT_PUBLIC_RESEARCH_TOKEN_ADDRESS=0xYourTokenAddress
NEXT_PUBLIC_STUDY_REGISTRY_ADDRESS=0xYourRegistryAddress

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 🚀 Deployment Options

### **Option 1: Recommended for MVP (Fastest)**

#### Frontend: **Vercel** (Free tier available)
- ✅ Zero-config Next.js deployment
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Preview deployments for PRs

**Deploy Steps:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

Or connect GitHub repo to Vercel dashboard for auto-deployments.

#### Backend: **Railway** (Free $5 credit/month)
- ✅ Easy Python deployment
- ✅ Automatic HTTPS
- ✅ Environment variables UI
- ✅ Logs & monitoring

**Deploy Steps:**
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repo
3. Select `backend` folder as root
4. Add environment variables
5. Deploy

**Alternative Backend Options:**
- **Render** (Free tier, sleeps after inactivity)
- **Fly.io** (Free tier, better for global deployment)
- **DigitalOcean App Platform** ($5/month)

---

### **Option 2: AWS (Scalable, Production-Grade)**

#### Frontend: **AWS Amplify**
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

#### Backend: **AWS ECS (Fargate) or Lambda**

**Using Docker + ECS:**
```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Deploy via AWS Console or CLI.

---

### **Option 3: Self-Hosted (Full Control)**

#### Using Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.your-domain.com
    restart: unless-stopped
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
```

**Deploy:**
```bash
docker-compose up -d
```

---

## 🗄️ Database & Storage

### InsForge (Current Setup)
- ✅ Already configured
- ✅ PostgreSQL + Storage + AI
- ✅ No additional setup needed

**Production Checklist:**
- [ ] Upgrade to paid plan for production limits
- [ ] Enable automatic backups
- [ ] Set up read replicas (if needed)
- [ ] Configure connection pooling

### Alternative: Supabase
If you want to migrate from InsForge:
- PostgreSQL database
- File storage
- Real-time subscriptions
- Built-in auth

---

## 🔒 Security Hardening

### 1. API Security

**Add rate limiting** to `backend/main.py`:

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/api/analyze")
@limiter.limit("10/minute")  # 10 requests per minute
async def analyze_report(request: Request, ...):
    ...
```

**Install:**
```bash
pip install slowapi
```

### 2. HTTPS Only

**Force HTTPS in production:**

```python
# backend/main.py
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

if os.getenv("ENVIRONMENT") == "production":
    app.add_middleware(HTTPSRedirectMiddleware)
```

### 3. Security Headers

```python
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["your-domain.com", "*.your-domain.com"]
)
```

### 4. Input Validation

Already using Pydantic models ✅

### 5. Secrets Management

**Use environment-specific secrets:**
- Development: `.env` file
- Production: Platform secrets (Vercel/Railway/AWS Secrets Manager)

**Never:**
- ❌ Commit `.env` files
- ❌ Hardcode API keys
- ❌ Log sensitive data

---

## 📊 Monitoring & Logging

### 1. Application Monitoring

**Add Sentry for error tracking:**

```bash
# Backend
pip install sentry-sdk[fastapi]
```

```python
# backend/main.py
import sentry_sdk

if os.getenv("ENVIRONMENT") == "production":
    sentry_sdk.init(
        dsn="your-sentry-dsn",
        traces_sample_rate=0.1,
        environment="production"
    )
```

**Frontend:**
```bash
npm install @sentry/nextjs
```

### 2. Logging

**Structured logging:**

```python
# backend/main.py
import logging
import json

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

@app.post("/api/analyze")
async def analyze_report(...):
    logger.info(f"Analysis request from user: {user_id}")
    # ... process
    logger.info(f"Analysis completed: {record_id}")
```

### 3. Health Checks

**Add health endpoint:**

```python
# backend/main.py
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }
```

### 4. Uptime Monitoring

Use free services:
- **UptimeRobot** (50 monitors free)
- **Better Uptime** (10 monitors free)
- **Pingdom** (1 monitor free)

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      
      - name: Run tests
        run: |
          cd backend
          pytest

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        run: |
          # Railway auto-deploys on push
          echo "Backend deployed via Railway"

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          cd frontend
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## ⏮️ Rollback Strategy

### Quick Rollback Options

#### Vercel (Frontend)
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

#### Railway (Backend)
- Use Railway dashboard
- Click "Rollback" on previous deployment

#### Docker
```bash
# Tag images with versions
docker tag backend:latest backend:v1.0.0

# Rollback
docker-compose down
docker-compose up -d backend:v1.0.0
```

### Database Rollback
- Keep database migrations versioned
- Test migrations on staging first
- Always have backup before migration

---

## 📝 Post-Deployment

### 1. Smoke Tests

**Test these endpoints:**
```bash
# Health check
curl https://api.your-domain.com/health

# Frontend
curl https://your-domain.com

# Upload test
curl -X POST https://api.your-domain.com/api/analyze \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test-report.pdf"
```

### 2. Performance Testing

Use **Lighthouse** for frontend:
```bash
npm install -g lighthouse
lighthouse https://your-domain.com --view
```

### 3. Load Testing

Use **k6** for backend:
```bash
# Install k6
brew install k6  # macOS

# Create test script
cat > load-test.js << 'EOF'
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 10,
  duration: '30s',
};

export default function() {
  let res = http.get('https://api.your-domain.com/health');
  check(res, { 'status is 200': (r) => r.status === 200 });
}
EOF

# Run test
k6 run load-test.js
```

### 4. Set Up Alerts

**Configure alerts for:**
- [ ] API response time > 2s
- [ ] Error rate > 1%
- [ ] CPU usage > 80%
- [ ] Memory usage > 80%
- [ ] Disk usage > 90%
- [ ] SSL certificate expiry < 30 days

---

## 🎯 Deployment Checklist

### Pre-Launch
- [ ] All environment variables set
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Error tracking (Sentry) configured
- [ ] Logging configured
- [ ] Health checks working
- [ ] Backups configured
- [ ] Domain DNS configured
- [ ] SSL certificate valid

### Launch Day
- [ ] Deploy backend first
- [ ] Verify backend health
- [ ] Deploy frontend
- [ ] Verify frontend loads
- [ ] Test critical user flows
- [ ] Monitor error rates
- [ ] Check performance metrics

### Post-Launch (Week 1)
- [ ] Monitor error logs daily
- [ ] Check performance metrics
- [ ] Review user feedback
- [ ] Optimize slow endpoints
- [ ] Scale if needed

---

## 🔧 Maintenance & Updates

### Regular Updates
- **Weekly:** Check logs and errors
- **Monthly:** Update dependencies
- **Quarterly:** Security audit

### Zero-Downtime Deployments

**Blue-Green Deployment:**
1. Deploy new version (green)
2. Test green environment
3. Switch traffic to green
4. Keep blue as backup

**Rolling Updates:**
- Deploy to 10% of servers
- Monitor for errors
- Gradually increase to 100%

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue: CORS errors**
```python
# Fix: Update ALLOWED_ORIGINS in backend/.env
ALLOWED_ORIGINS=https://your-domain.com
```

**Issue: 502 Bad Gateway**
- Check backend is running
- Check health endpoint
- Review backend logs

**Issue: Slow API responses**
- Enable caching
- Optimize database queries
- Add CDN for static assets

### Getting Help
- Check logs first
- Review error tracking (Sentry)
- Check service status pages
- Contact support for external services

---

## 🎉 Quick Start Commands

### Deploy Everything (Recommended)

```bash
# 1. Deploy Backend to Railway
# - Go to railway.app
# - Connect GitHub repo
# - Select backend folder
# - Add environment variables
# - Deploy

# 2. Deploy Frontend to Vercel
cd frontend
npm install -g vercel
vercel --prod

# 3. Update frontend with backend URL
# In Vercel dashboard, add environment variable:
# NEXT_PUBLIC_API_URL=https://your-backend.railway.app

# 4. Redeploy frontend
vercel --prod

# Done! 🚀
```

---

## 📚 Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Railway Docs](https://docs.railway.app/)
- [Vercel Docs](https://vercel.com/docs)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Last Updated:** February 2026  
**Version:** 1.0.0  
**Maintainer:** ClearPulse Team
