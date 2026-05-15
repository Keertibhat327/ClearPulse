# 🚀 ClearPulse - Render + Vercel Deployment Guide

**Platform:** Render (Backend) + Vercel (Frontend)  
**Time:** 20 minutes  
**Cost:** Free tier available  
**Difficulty:** Easy

---

## 📋 Prerequisites

- GitHub account with ClearPulse repository
- [Render account](https://render.com) (free)
- [Vercel account](https://vercel.com) (free)
- API keys ready (see below)

---

## 🔑 Required API Keys

Get these before starting:

| Service | Get From | Free Tier |
|---------|----------|-----------|
| **Google Gemini** | [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey) | ✅ Yes |
| **Groq** | [console.groq.com/keys](https://console.groq.com/keys) | ✅ Yes |
| **InsForge** | [insforge.app](https://insforge.app) | ✅ Yes |
| **Tavus** | [tavus.io](https://tavus.io) | ⚠️ Trial |
| **Sarvam** | [sarvam.ai](https://sarvam.ai) | ⚠️ Trial |
| **Pinata** | [pinata.cloud](https://pinata.cloud) | ✅ Yes |

---

## 🎯 Deployment Steps

### Step 1: Deploy Backend to Render (10 minutes)

#### 1.1 Create Web Service

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account (if not already)
4. Select your **ClearPulse** repository
5. Click **"Connect"**

#### 1.2 Configure Service

Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `clearpulse-backend` (or your choice) |
| **Region** | Choose closest to your users |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | `Free` (or `Starter` for better performance) |

#### 1.3 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables one by one:

```bash
# AI Services
GOOGLE_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here

# Database & Storage
INSFORGE_BASE_URL=https://your-instance.insforge.app
INSFORGE_SERVICE_KEY=your_insforge_service_key_here

# Video AI
TAVUS_API_KEY=your_tavus_api_key_here
TAVUS_REPLICA_ID=your_replica_id_here

# Voice AI
SARVAM_API_KEY=your_sarvam_api_key_here

# IPFS Storage
PINATA_API_KEY=your_pinata_api_key_here
PINATA_SECRET_KEY=your_pinata_secret_key_here
PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs

# Security (generate random strings)
VAULT_MASTER_KEY=generate_random_32_character_string
SECRET_KEY=generate_random_secret_string

# CORS - We'll update this after deploying frontend
ALLOWED_ORIGINS=https://clear-pulse-ki1d.vercel.app

# Environment
ENVIRONMENT=production
DEBUG=false
```

**To generate random keys:**
```bash
# On Mac/Linux
openssl rand -base64 32

# Or use Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

#### 1.4 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (3-5 minutes)
3. Once deployed, you'll see: **"Your service is live 🎉"**
4. **Copy your backend URL** (e.g., `https://clearpulse-backend.onrender.com`)

#### 1.5 Verify Backend

Test your backend:
```bash
# Replace with your actual URL
curl https://clearpulse-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-15T...",
  "version": "1.0.0"
}
```

---

### Step 2: Deploy Frontend to Vercel (5 minutes)

#### 2.1 Import Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your **ClearPulse** repository
4. Click **"Import"**

#### 2.2 Configure Project

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Next.js` (auto-detected) |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | `.next` (default) |
| **Install Command** | `npm install` (default) |

#### 2.3 Add Environment Variables

Click **"Environment Variables"** and add:

```bash
# Backend API URL (use your Render URL from Step 1)
NEXT_PUBLIC_API_URL=https://clearpulse-backend.onrender.com

# Blockchain (optional - if using smart contracts)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_RESEARCH_TOKEN_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
NEXT_PUBLIC_STUDY_REGISTRY_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

#### 2.4 Deploy

1. Click **"Deploy"**
2. Wait for build (2-3 minutes)
3. Once deployed, you'll see: **"Congratulations! 🎉"**
4. **Copy your frontend URL** (e.g., `https://clear-pulse-ki1d.vercel.app`)

---

### Step 3: Update CORS Settings (2 minutes)

Now that you have your frontend URL, update the backend CORS:

#### 3.1 Update Render Environment Variables

1. Go back to [Render Dashboard](https://dashboard.render.com)
2. Click on your **clearpulse-backend** service
3. Go to **"Environment"** tab
4. Find **ALLOWED_ORIGINS** variable
5. Update it with your Vercel URL:

```bash
ALLOWED_ORIGINS=https://clear-pulse-ki1d.vercel.app,https://clearpulse-git-main.vercel.app
```

**Note:** Include both the production URL and the git branch URL for preview deployments.

6. Click **"Save Changes"**
7. Render will automatically redeploy (1-2 minutes)

---

### Step 4: Test Your Deployment (3 minutes)

#### 4.1 Test Frontend

1. Open your Vercel URL: `https://clear-pulse-ki1d.vercel.app`
2. You should see the landing page
3. Click **"Patient"** button
4. Should load the patient dashboard ✅

#### 4.2 Test Backend Connection

1. In the patient dashboard, try uploading a test PDF
2. Should analyze successfully ✅
3. Try the chatbot - should respond ✅
4. Try triage chat - should work ✅

#### 4.3 Check Browser Console

1. Press `F12` (or `Cmd+Option+I` on Mac)
2. Go to **Console** tab
3. Should see no CORS errors ✅
4. Should see no connection errors ✅

---

## ✅ Deployment Complete!

Your app is now live at:
- **Frontend:** `https://clear-pulse-ki1d.vercel.app`
- **Backend:** `https://clearpulse-backend.onrender.com`

---

## 🎨 Add Custom Domain (Optional)

### For Vercel (Frontend)

1. Go to your project in Vercel
2. Click **"Settings"** → **"Domains"**
3. Click **"Add"**
4. Enter your domain (e.g., `clearpulse.com`)
5. Follow DNS configuration instructions
6. Wait for SSL certificate (automatic, ~5 minutes)

### For Render (Backend)

1. Go to your service in Render
2. Click **"Settings"** → **"Custom Domain"**
3. Enter your subdomain (e.g., `api.clearpulse.com`)
4. Add CNAME record to your DNS:
   ```
   CNAME api.clearpulse.com → clearpulse-backend.onrender.com
   ```
5. Wait for SSL certificate (automatic)

### Update CORS After Custom Domain

Update `ALLOWED_ORIGINS` in Render:
```bash
ALLOWED_ORIGINS=https://clearpulse.com,https://www.clearpulse.com
```

Update `NEXT_PUBLIC_API_URL` in Vercel:
```bash
NEXT_PUBLIC_API_URL=https://api.clearpulse.com
```

Then redeploy frontend in Vercel.

---

## 🔄 How to Update Your App

### Update Code

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main
```

**Both Render and Vercel will auto-deploy!** ✨

### Update Environment Variables

**Render:**
1. Dashboard → Your Service → Environment
2. Edit variable → Save Changes
3. Auto-redeploys

**Vercel:**
1. Dashboard → Your Project → Settings → Environment Variables
2. Edit variable → Save
3. Go to Deployments → Latest → Redeploy

---

## 💰 Pricing

### Free Tier (Perfect for MVP)

**Render Free:**
- ✅ 750 hours/month (enough for 1 service)
- ✅ Automatic HTTPS
- ✅ Auto-deploy from Git
- ⚠️ Spins down after 15 min inactivity (cold starts)
- ⚠️ 512 MB RAM

**Vercel Free:**
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Preview deployments

**Total Cost:** **$0/month** 🎉

### Paid Plans (For Production)

**Render Starter:**
- 💰 **$7/month**
- ✅ No cold starts (always on)
- ✅ 512 MB RAM
- ✅ Better performance

**Render Standard:**
- 💰 **$25/month**
- ✅ 2 GB RAM
- ✅ Auto-scaling
- ✅ Priority support

**Vercel Pro:**
- 💰 **$20/month**
- ✅ 1TB bandwidth
- ✅ Advanced analytics
- ✅ Team collaboration

**Recommended for Production:** Render Starter ($7) + Vercel Free = **$7/month**

---

## 🐛 Troubleshooting

### Issue 1: "Connection failed: Could not reach backend"

**Cause:** Frontend can't reach backend

**Fix:**
1. Check `NEXT_PUBLIC_API_URL` in Vercel environment variables
2. Should be: `https://clearpulse-backend.onrender.com`
3. Redeploy frontend after changing

**Test:**
```bash
curl https://clearpulse-backend.onrender.com/health
```

---

### Issue 2: "CORS policy error"

**Cause:** Backend CORS not configured for frontend URL

**Fix:**
1. Go to Render → Environment
2. Update `ALLOWED_ORIGINS`:
   ```bash
   ALLOWED_ORIGINS=https://clear-pulse-ki1d.vercel.app,https://clearpulse-git-main.vercel.app
   ```
3. Save (auto-redeploys)

---

### Issue 3: "502 Bad Gateway" on Render

**Cause:** Backend crashed or not responding

**Fix:**
1. Check Render logs: Dashboard → Your Service → Logs
2. Look for errors (missing env vars, import errors)
3. Common issues:
   - Missing environment variable
   - Wrong Python version
   - Dependency installation failed

**View logs:**
```bash
# In Render dashboard, click "Logs" tab
# Look for error messages
```

---

### Issue 4: Backend is slow (cold starts)

**Cause:** Render free tier spins down after 15 min inactivity

**Solutions:**

**Option A: Upgrade to Render Starter ($7/month)**
- No cold starts
- Always on

**Option B: Keep-alive ping (Free)**

Add this to your frontend:
```typescript
// frontend/src/app/layout.tsx
useEffect(() => {
  // Ping backend every 10 minutes to keep it warm
  const interval = setInterval(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
      .catch(() => {});
  }, 10 * 60 * 1000); // 10 minutes

  return () => clearInterval(interval);
}, []);
```

**Option C: External ping service**
- Use [UptimeRobot](https://uptimerobot.com) (free)
- Ping your backend every 5 minutes

---

### Issue 5: "Build failed" on Render

**Cause:** Dependencies not installing

**Fix:**
1. Check `requirements.txt` is in `backend/` folder
2. Verify Python version compatibility
3. Check Render logs for specific error

**Common fixes:**
```bash
# If using newer Python features, specify version
# In Render dashboard, add environment variable:
PYTHON_VERSION=3.11
```

---

### Issue 6: Environment variables not working

**Cause:** Variables not saved or typo

**Fix:**
1. Double-check variable names (case-sensitive)
2. No quotes needed in Render/Vercel UI
3. Redeploy after adding variables

**Verify in logs:**
```python
# Add to backend/main.py temporarily
import os
print("GOOGLE_API_KEY:", os.getenv("GOOGLE_API_KEY")[:10] + "...")
```

---

## 📊 Monitoring Your App

### Render Monitoring

**View Logs:**
1. Dashboard → Your Service → Logs
2. Real-time log streaming
3. Filter by severity

**View Metrics:**
1. Dashboard → Your Service → Metrics
2. CPU usage
3. Memory usage
4. Response times

**Set up Alerts:**
1. Dashboard → Your Service → Settings → Notifications
2. Add email for deployment failures

### Vercel Monitoring

**View Logs:**
1. Dashboard → Your Project → Deployments
2. Click deployment → View Function Logs

**Analytics:**
1. Dashboard → Your Project → Analytics
2. Page views
3. Performance metrics
4. Web Vitals

**Real User Monitoring:**
- Upgrade to Vercel Pro for advanced analytics

---

## 🔒 Security Checklist

- [x] All secrets in environment variables
- [x] HTTPS enabled (automatic)
- [x] CORS configured
- [ ] Add rate limiting (see below)
- [ ] Enable Sentry error tracking
- [ ] Set up uptime monitoring
- [ ] Regular dependency updates

### Add Rate Limiting (Recommended)

Update `backend/requirements.txt`:
```txt
slowapi==0.1.9
```

Update `backend/main.py`:
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/api/analyze")
@limiter.limit("10/minute")
async def analyze_report(request: Request, ...):
    ...
```

Redeploy to Render.

---

## 🚀 Performance Optimization

### Backend (Render)

1. **Upgrade to Starter plan** ($7/month)
   - Eliminates cold starts
   - Better performance

2. **Enable caching**
   ```python
   from functools import lru_cache
   
   @lru_cache(maxsize=100)
   def expensive_operation(param):
       ...
   ```

3. **Use async operations**
   - Already implemented ✅

### Frontend (Vercel)

1. **Enable Image Optimization**
   - Already enabled with Next.js ✅

2. **Add caching headers**
   ```typescript
   // next.config.ts
   async headers() {
     return [
       {
         source: '/api/:path*',
         headers: [
           { key: 'Cache-Control', value: 'public, max-age=60' }
         ]
       }
     ]
   }
   ```

3. **Use Vercel Analytics**
   - Upgrade to Pro for detailed insights

---

## 📈 Scaling Strategy

### Current Setup (Free Tier)
- **Users:** 0-100
- **Requests:** <1,000/day
- **Cost:** $0/month

### Growth Phase
- **Users:** 100-1,000
- **Requests:** 1,000-10,000/day
- **Action:** Upgrade Render to Starter ($7/month)
- **Cost:** $7/month

### Scale Phase
- **Users:** 1,000-10,000
- **Requests:** 10,000-100,000/day
- **Actions:**
  - Render Standard ($25/month)
  - Vercel Pro ($20/month)
  - Add Redis caching
  - Database read replicas
- **Cost:** $45-75/month

---

## 🎯 Quick Reference

### Important URLs

**Render:**
- Dashboard: https://dashboard.render.com
- Docs: https://render.com/docs
- Status: https://status.render.com

**Vercel:**
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs
- Status: https://vercel-status.com

### Useful Commands

```bash
# Test backend health
curl https://your-backend.onrender.com/health

# Test backend API
curl -X POST https://your-backend.onrender.com/api/triage/chat \
  -H "Content-Type: application/json" \
  -d '{"patient_id":"test","message":"Hello","history":[]}'

# View Vercel logs
vercel logs

# Redeploy Vercel
vercel --prod
```

---

## ✅ Final Checklist

Before going live:

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] All environment variables set
- [ ] CORS configured correctly
- [ ] Backend health check passes
- [ ] Frontend loads successfully
- [ ] File upload works
- [ ] AI analysis works
- [ ] Chatbot responds
- [ ] Triage chat works
- [ ] No console errors
- [ ] Mobile responsive tested

---

## 🎉 You're Live!

**Your app is now deployed and accessible worldwide!**

- **Frontend:** https://clear-pulse-ki1d.vercel.app
- **Backend:** https://clearpulse-backend.onrender.com

**Next Steps:**
1. Test all features thoroughly
2. Add custom domain (optional)
3. Set up monitoring
4. Share with users! 🚀

---

**Deployment Time:** ~20 minutes  
**Cost:** Free tier available  
**Maintenance:** Auto-updates enabled

**Questions?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for more details.

**Happy deploying!** 🎊
