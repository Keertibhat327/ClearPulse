# 🚀 ClearPulse - Quick Start Guide

Get your app deployed in **15 minutes** or less!

---

## 📋 Prerequisites

- GitHub account
- [Vercel account](https://vercel.com) (free)
- [Railway account](https://railway.app) (free $5 credit)
- API keys ready (see below)

---

## 🔑 Get Your API Keys

Before deploying, sign up and get these API keys:

| Service | Purpose | Get Key From | Free Tier |
|---------|---------|--------------|-----------|
| **Google Gemini** | AI Analysis | [makersuite.google.com](https://makersuite.google.com/app/apikey) | ✅ Yes |
| **Groq** | AI Fallback | [console.groq.com](https://console.groq.com/keys) | ✅ Yes |
| **InsForge** | Database | [insforge.app](https://insforge.app) | ✅ Yes |
| **Tavus** | Video AI | [tavus.io](https://tavus.io) | ⚠️ Trial |
| **Sarvam** | Voice AI | [sarvam.ai](https://sarvam.ai) | ⚠️ Trial |
| **Pinata** | IPFS Storage | [pinata.cloud](https://pinata.cloud) | ✅ Yes |

---

## 🚀 Deploy in 3 Steps

### Step 1: Deploy Backend (5 minutes)

1. **Go to [Railway.app](https://railway.app)**
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `ClearPulse` repository
4. Click **"Add variables"** and paste these:

```bash
GOOGLE_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
INSFORGE_BASE_URL=your_insforge_url
INSFORGE_SERVICE_KEY=your_insforge_key
TAVUS_API_KEY=your_tavus_key
TAVUS_REPLICA_ID=your_replica_id
SARVAM_API_KEY=your_sarvam_key
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_KEY=your_pinata_secret
PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs
VAULT_MASTER_KEY=generate_random_32_chars
SECRET_KEY=generate_random_secret
ALLOWED_ORIGINS=https://your-app.vercel.app
ENVIRONMENT=production
DEBUG=false
```

5. Set **Root Directory** to `backend`
6. Click **"Deploy"**
7. **Copy your backend URL** (e.g., `https://clearpulse-backend.railway.app`)

---

### Step 2: Deploy Frontend (5 minutes)

1. **Go to [Vercel.com](https://vercel.com)**
2. Click **"Add New"** → **"Project"**
3. Import your `ClearPulse` repository
4. Set **Root Directory** to `frontend`
5. Add **Environment Variables**:

```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

6. Click **"Deploy"**
7. Wait for deployment to complete
8. **Copy your frontend URL** (e.g., `https://clear-pulse-ki1d.vercel.app`)

---

### Step 3: Update CORS (2 minutes)

1. Go back to **Railway**
2. Open your backend project
3. Go to **Variables**
4. Update `ALLOWED_ORIGINS`:

```bash
ALLOWED_ORIGINS=https://clear-pulse-ki1d.vercel.app,https://www.clear-pulse-ki1d.vercel.app
```

5. Save (Railway will auto-redeploy)

---

## ✅ Test Your Deployment

1. **Visit your frontend URL**: `https://clear-pulse-ki1d.vercel.app`
2. **Click "Patient"** → Should load patient dashboard
3. **Upload a test PDF** → Should analyze successfully
4. **Try the chatbot** → Should respond
5. **Check triage** → Should work

---

## 🎯 Custom Domain (Optional)

### Add Domain to Vercel

1. Go to your project in Vercel
2. Click **"Settings"** → **"Domains"**
3. Add your domain (e.g., `clearpulse.com`)
4. Update DNS records as shown
5. Wait for SSL certificate (automatic)

### Update Backend CORS

```bash
ALLOWED_ORIGINS=https://clearpulse.com,https://www.clearpulse.com
```

---

## 🔧 Troubleshooting

### Issue: "Connection failed: Could not reach backend"

**Fix:** Check `NEXT_PUBLIC_API_URL` in Vercel environment variables

```bash
# Should be your Railway backend URL
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

### Issue: "CORS error"

**Fix:** Update `ALLOWED_ORIGINS` in Railway to include your Vercel URL

```bash
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Issue: "500 Internal Server Error"

**Fix:** Check Railway logs for missing environment variables

1. Go to Railway project
2. Click **"Deployments"** → **"View Logs"**
3. Look for errors about missing keys

### Issue: "AI analysis not working"

**Fix:** Verify API keys are correct

1. Test Gemini key: [makersuite.google.com](https://makersuite.google.com/app/apikey)
2. Check Railway logs for API errors

---

## 📊 Monitor Your App

### Railway (Backend)

- **Logs**: Railway Dashboard → Deployments → View Logs
- **Metrics**: Railway Dashboard → Metrics
- **Restart**: Railway Dashboard → Deployments → Restart

### Vercel (Frontend)

- **Logs**: Vercel Dashboard → Deployments → Function Logs
- **Analytics**: Vercel Dashboard → Analytics
- **Redeploy**: Vercel Dashboard → Deployments → Redeploy

---

## 🔄 Update Your App

### Update Code

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main
```

**Both Railway and Vercel will auto-deploy!** ✨

### Update Environment Variables

**Railway:**
1. Dashboard → Variables → Edit → Save

**Vercel:**
1. Dashboard → Settings → Environment Variables → Edit → Save
2. Redeploy for changes to take effect

---

## 💰 Cost Estimate

| Service | Free Tier | Paid Plan |
|---------|-----------|-----------|
| **Vercel** | 100GB bandwidth/month | $20/month |
| **Railway** | $5 credit/month | $5-20/month |
| **InsForge** | 500MB storage | $25/month |
| **Gemini** | 60 requests/min | Pay-as-you-go |
| **Groq** | 30 requests/min | Free (beta) |
| **Pinata** | 1GB storage | $20/month |

**Total for MVP:** ~$0-10/month (using free tiers)

---

## 🎉 You're Live!

Your app is now deployed and accessible worldwide!

**Next Steps:**
- [ ] Add custom domain
- [ ] Set up monitoring (Sentry)
- [ ] Configure analytics
- [ ] Add more features
- [ ] Scale as needed

---

## 📞 Need Help?

- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide
- Review Railway/Vercel logs
- Check service status pages
- Open GitHub issue

---

**Deployment Time:** ~15 minutes  
**Difficulty:** Easy  
**Cost:** Free tier available

🚀 **Happy Deploying!**
