# ✅ Render + Vercel Deployment Checklist

Quick reference checklist for deploying ClearPulse to Render and Vercel.

---

## 📋 Pre-Deployment

### Get API Keys

- [ ] Google Gemini API key from [makersuite.google.com](https://makersuite.google.com/app/apikey)
- [ ] Groq API key from [console.groq.com](https://console.groq.com/keys)
- [ ] InsForge credentials from [insforge.app](https://insforge.app)
- [ ] Tavus API key from [tavus.io](https://tavus.io)
- [ ] Sarvam API key from [sarvam.ai](https://sarvam.ai)
- [ ] Pinata API keys from [pinata.cloud](https://pinata.cloud)

### Accounts Ready

- [ ] GitHub account with ClearPulse repo
- [ ] Render account created
- [ ] Vercel account created

---

## 🚀 Step 1: Deploy Backend to Render

### Create Service

- [ ] Go to [dashboard.render.com](https://dashboard.render.com)
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub and select ClearPulse repo
- [ ] Click "Connect"

### Configure Service

- [ ] Name: `clearpulse-backend`
- [ ] Region: Choose closest to users
- [ ] Branch: `main`
- [ ] Root Directory: `backend`
- [ ] Runtime: `Python 3`
- [ ] Build Command: `pip install -r requirements.txt`
- [ ] Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Instance Type: `Free` (or `Starter`)

### Add Environment Variables

- [ ] `GOOGLE_API_KEY` = your_gemini_key
- [ ] `GROQ_API_KEY` = your_groq_key
- [ ] `INSFORGE_BASE_URL` = your_insforge_url
- [ ] `INSFORGE_SERVICE_KEY` = your_insforge_key
- [ ] `TAVUS_API_KEY` = your_tavus_key
- [ ] `TAVUS_REPLICA_ID` = your_replica_id
- [ ] `SARVAM_API_KEY` = your_sarvam_key
- [ ] `PINATA_API_KEY` = your_pinata_key
- [ ] `PINATA_SECRET_KEY` = your_pinata_secret
- [ ] `PINATA_GATEWAY` = `https://gateway.pinata.cloud/ipfs`
- [ ] `VAULT_MASTER_KEY` = generate random 32 chars
- [ ] `SECRET_KEY` = generate random string
- [ ] `ALLOWED_ORIGINS` = `https://clear-pulse-ki1d.vercel.app`
- [ ] `ENVIRONMENT` = `production`
- [ ] `DEBUG` = `false`

### Deploy & Verify

- [ ] Click "Create Web Service"
- [ ] Wait for deployment (3-5 minutes)
- [ ] Copy backend URL (e.g., `https://clearpulse-backend.onrender.com`)
- [ ] Test health endpoint: `curl https://your-backend.onrender.com/health`
- [ ] Should return: `{"status":"healthy",...}`

---

## 🎨 Step 2: Deploy Frontend to Vercel

### Import Project

- [ ] Go to [vercel.com/new](https://vercel.com/new)
- [ ] Click "Import Git Repository"
- [ ] Select ClearPulse repository
- [ ] Click "Import"

### Configure Project

- [ ] Framework: `Next.js` (auto-detected)
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm run build` (default)
- [ ] Output Directory: `.next` (default)
- [ ] Install Command: `npm install` (default)

### Add Environment Variables

- [ ] `NEXT_PUBLIC_API_URL` = `https://clearpulse-backend.onrender.com` (your Render URL)
- [ ] `NEXT_PUBLIC_CONTRACT_ADDRESS` = `0x5FbDB2315678afecb367f032d93F642f64180aa3` (optional)
- [ ] `NEXT_PUBLIC_RESEARCH_TOKEN_ADDRESS` = `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` (optional)
- [ ] `NEXT_PUBLIC_STUDY_REGISTRY_ADDRESS` = `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` (optional)

### Deploy & Verify

- [ ] Click "Deploy"
- [ ] Wait for build (2-3 minutes)
- [ ] Copy frontend URL (e.g., `https://clear-pulse-ki1d.vercel.app`)
- [ ] Open URL in browser
- [ ] Landing page should load

---

## 🔄 Step 3: Update CORS

### Update Render

- [ ] Go to Render dashboard
- [ ] Click on `clearpulse-backend` service
- [ ] Go to "Environment" tab
- [ ] Find `ALLOWED_ORIGINS` variable
- [ ] Update to: `https://clear-pulse-ki1d.vercel.app,https://clearpulse-git-main.vercel.app`
- [ ] Click "Save Changes"
- [ ] Wait for auto-redeploy (1-2 minutes)

---

## ✅ Step 4: Test Everything

### Frontend Tests

- [ ] Landing page loads
- [ ] Click "Patient" button → Dashboard loads
- [ ] Click "Doctor" button → Dashboard loads
- [ ] No console errors (F12 → Console)

### Feature Tests

- [ ] Upload PDF → Analysis works
- [ ] Chatbot responds
- [ ] Triage chat works
- [ ] 3D anatomy loads
- [ ] Video consult works
- [ ] Appointments can be booked

### Backend Tests

- [ ] Health endpoint: `curl https://your-backend.onrender.com/health`
- [ ] No CORS errors in browser console
- [ ] API responses are fast (<2s)

---

## 🎯 Optional: Custom Domain

### Add to Vercel

- [ ] Vercel Dashboard → Settings → Domains
- [ ] Add domain (e.g., `clearpulse.com`)
- [ ] Update DNS records as shown
- [ ] Wait for SSL (automatic, ~5 min)

### Add to Render

- [ ] Render Dashboard → Settings → Custom Domain
- [ ] Add subdomain (e.g., `api.clearpulse.com`)
- [ ] Add CNAME: `api.clearpulse.com` → `clearpulse-backend.onrender.com`
- [ ] Wait for SSL (automatic)

### Update Environment Variables

- [ ] Render: Update `ALLOWED_ORIGINS` to `https://clearpulse.com,https://www.clearpulse.com`
- [ ] Vercel: Update `NEXT_PUBLIC_API_URL` to `https://api.clearpulse.com`
- [ ] Redeploy frontend

---

## 📊 Monitoring Setup

### Render

- [ ] Enable email notifications: Settings → Notifications
- [ ] Check logs regularly: Dashboard → Logs
- [ ] Monitor metrics: Dashboard → Metrics

### Vercel

- [ ] Check deployment logs: Deployments → View Logs
- [ ] Enable analytics (Pro plan)
- [ ] Set up error tracking

### External

- [ ] Set up UptimeRobot for backend monitoring
- [ ] Configure Sentry for error tracking (optional)
- [ ] Set up Google Analytics (optional)

---

## 🔒 Security Checklist

- [ ] All secrets in environment variables (not in code)
- [ ] HTTPS enabled (automatic)
- [ ] CORS configured correctly
- [ ] Rate limiting added (optional but recommended)
- [ ] Security headers configured
- [ ] No API keys in frontend code
- [ ] Environment variables don't have quotes

---

## 💰 Cost Tracking

### Current Plan

- [ ] Render: Free tier (or Starter $7/month)
- [ ] Vercel: Free tier (or Pro $20/month)
- [ ] Total: $0-27/month

### Usage Monitoring

- [ ] Check Render usage: Dashboard → Usage
- [ ] Check Vercel usage: Dashboard → Usage
- [ ] Set up billing alerts

---

## 🐛 Troubleshooting

### If backend doesn't work:

- [ ] Check Render logs for errors
- [ ] Verify all environment variables are set
- [ ] Test health endpoint
- [ ] Check Python version (should be 3.11)

### If frontend doesn't connect:

- [ ] Verify `NEXT_PUBLIC_API_URL` is correct
- [ ] Check CORS settings in Render
- [ ] Look for errors in browser console
- [ ] Test backend URL directly

### If cold starts are slow:

- [ ] Upgrade Render to Starter plan ($7/month)
- [ ] Or add keep-alive ping service

---

## 📝 Post-Deployment

### Documentation

- [ ] Update README with live URLs
- [ ] Document any custom configurations
- [ ] Note any issues encountered

### Team

- [ ] Share URLs with team
- [ ] Add team members to Render/Vercel
- [ ] Set up access controls

### Next Steps

- [ ] Monitor for 24 hours
- [ ] Gather user feedback
- [ ] Plan scaling strategy
- [ ] Schedule regular updates

---

## 🎉 Deployment Complete!

**Your app is live at:**
- Frontend: `https://clear-pulse-ki1d.vercel.app`
- Backend: `https://clearpulse-backend.onrender.com`

**Time taken:** ~20 minutes  
**Cost:** $0-7/month  
**Status:** Production ready ✅

---

## 📞 Support

**Issues?** Check [DEPLOY_RENDER_VERCEL.md](./DEPLOY_RENDER_VERCEL.md) for detailed troubleshooting.

**Questions?** Review [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive guide.

---

**Last Updated:** February 2026  
**Version:** 1.0.0
