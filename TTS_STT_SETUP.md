# 🎤 Text-to-Speech & Speech-to-Text Setup Guide

## ✅ Status: Ready to Deploy

Your TTS (Text-to-Speech) and STT (Speech-to-Text) features are now properly configured!

---

## 🔑 API Keys Added

The following API keys have been added to your local `backend/.env`:

```bash
GROQ_API_KEY=your_groq_api_key_here
SARVAM_API_KEY=your_sarvam_api_key_here
```

---

## 🚀 Update Render Environment Variables

You need to add these to your Render backend:

### **1. Go to Render Dashboard**
https://dashboard.render.com

### **2. Click on your ClearPulse backend service**

### **3. Go to "Environment" tab**

### **4. Add these two new variables:**

| Key | Value |
|-----|-------|
| `GROQ_API_KEY` | *(your Groq API key)* |
| `SARVAM_API_KEY` | *(your Sarvam API key)* |

### **5. Click "Save Changes"**

Render will automatically redeploy (takes 1-2 minutes).

---

## 🎯 How It Works

### **Speech-to-Text (STT)**
- **Service:** Sarvam AI Saaras v3
- **Endpoint:** `POST /api/triage/stt`
- **Supported Languages:** 11 Indian languages (Hindi, Tamil, Telugu, Bengali, Kannada, Malayalam, Marathi, Gujarati, Punjabi, Odia, English)
- **How to use:** Hold the 🎤 microphone button in the triage chat to record your voice

### **Text-to-Speech (TTS)**
- **Service:** Sarvam AI Bulbul v3
- **Endpoint:** `POST /api/triage/tts`
- **Supported Languages:** Same 11 Indian languages
- **How to use:** Click the 🔊 speaker button to enable voice output. AI responses will be spoken automatically.

---

## 🌐 Supported Languages

| Code | Language | Flag |
|------|----------|------|
| `en-IN` | English | 🇮🇳 |
| `hi-IN` | Hindi | 🇮🇳 |
| `ta-IN` | Tamil | 🇮🇳 |
| `te-IN` | Telugu | 🇮🇳 |
| `bn-IN` | Bengali | 🇮🇳 |
| `kn-IN` | Kannada | 🇮🇳 |
| `ml-IN` | Malayalam | 🇮🇳 |
| `mr-IN` | Marathi | 🇮🇳 |
| `gu-IN` | Gujarati | 🇮🇳 |
| `pa-IN` | Punjabi | 🇮🇳 |
| `or-IN` | Odia | 🇮🇳 |

---

## 🧪 Testing Locally

### **1. Start Backend**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### **2. Start Frontend**
```bash
cd frontend
npm run dev
```

### **3. Test TTS/STT**
1. Go to http://localhost:3000
2. Click "Patient" → Go to "Triage" tab
3. **Test STT:** Hold the 🎤 button and speak
4. **Test TTS:** Click the 🔊 button to enable voice output

---

## 🔧 Features

### **Frontend (TriagePanel.tsx)**
- ✅ Language selector (11 languages)
- ✅ Voice recording with visual feedback
- ✅ Auto-transcription of voice input
- ✅ TTS toggle button
- ✅ Auto-play AI responses
- ✅ Stop audio playback
- ✅ Graceful fallback if Sarvam not configured

### **Backend (routes/triage.py)**
- ✅ `/api/triage/stt` - Speech-to-Text endpoint
- ✅ `/api/triage/tts` - Text-to-Speech endpoint
- ✅ `/api/triage/languages` - List supported languages
- ✅ Sarvam AI integration (services/sarvam.py)
- ✅ Groq AI fallback for chat (when Gemini fails)

---

## 🐛 Troubleshooting

### **Issue: "Microphone access denied"**
**Fix:** Allow microphone permissions in your browser settings

### **Issue: "Voice features not showing"**
**Fix:** Make sure `SARVAM_API_KEY` is set in Render environment variables

### **Issue: "TTS not playing"**
**Fix:** 
1. Click the 🔊 button to enable TTS
2. Check browser console for errors
3. Verify Sarvam API key is correct

### **Issue: "STT not transcribing"**
**Fix:**
1. Check microphone permissions
2. Verify you're holding the button while speaking
3. Check Render logs for API errors

---

## 📊 API Endpoints

### **1. Speech-to-Text**
```bash
POST /api/triage/stt
Content-Type: multipart/form-data

Form Data:
- audio: <audio file> (webm format)
- language_code: "hi-IN" (or any supported language)

Response:
{
  "transcript": "मुझे सिरदर्द है",
  "language_code": "hi-IN"
}
```

### **2. Text-to-Speech**
```bash
POST /api/triage/tts
Content-Type: application/json

Body:
{
  "text": "Hello, how can I help you?",
  "language_code": "en-IN"
}

Response: audio/wav file (binary)
```

### **3. Supported Languages**
```bash
GET /api/triage/languages

Response:
{
  "languages": [
    {"code": "en-IN", "name": "English"},
    {"code": "hi-IN", "name": "Hindi"},
    ...
  ],
  "sarvam_configured": true
}
```

---

## ✅ Checklist

- [x] GROQ_API_KEY added to local .env
- [x] SARVAM_API_KEY added to local .env
- [ ] **TODO:** Add GROQ_API_KEY to Render
- [ ] **TODO:** Add SARVAM_API_KEY to Render
- [ ] **TODO:** Test voice features after Render redeploy

---

## 🎉 Next Steps

1. **Add the API keys to Render** (see instructions above)
2. **Wait for Render to redeploy** (1-2 minutes)
3. **Test the voice features** on your live site: https://clear-pulse.vercel.app
4. **Try different languages** using the language selector

---

**Your TTS/STT features are ready to go!** 🚀

Just add the API keys to Render and you're done!
