# 🚀 Quick Vercel Deployment Guide

## ⚡ Fast Track Deployment

### Step 1: Push to GitHub

```bash
cd d:\Aichatbot
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### Step 2: Deploy on Vercel

1. Go to **[vercel.com/new](https://vercel.com/new)**
2. Click **"Import Project"**
3. Paste: `https://github.com/Vaibhavsable451/Ai-Chatbot.git`
4. Click **"Import"**

### Step 3: Add Environment Variables

In Vercel dashboard, add these 3 variables:

```
GROQ_API_KEY = your_groq_api_key_here
EMAIL_USER = your_gmail@gmail.com
EMAIL_PASS = your_16_char_gmail_app_password
```

> **⚠️ Important**: `EMAIL_PASS` must be a Gmail App Password, not your regular password!
>
> Get it here: [Google Account → Security → App passwords](https://myaccount.google.com/apppasswords)

### Step 4: Deploy!

Click **"Deploy"** button and wait 1-2 minutes.

---

## 📋 What Changed?

✅ Created `api/chat.js` - Serverless chat endpoint  
✅ Created `api/send-otp.js` - Serverless OTP email endpoint  
✅ Updated `vercel.json` - Vercel configuration  
✅ Updated `auth.js` - Use `/api/send-otp`  
✅ Updated `Script.js` - Use `/api/chat`

---

## 🧪 Test After Deployment

1. Visit your Vercel URL
2. Click "Sign Up"
3. Enter email → Check for OTP
4. Login and test chat

---

## 🆘 Troubleshooting

**OTP not received?**

- Check you're using Gmail App Password (not regular password)
- Verify `EMAIL_USER` and `EMAIL_PASS` in Vercel dashboard

**Chat not working?**

- Verify `GROQ_API_KEY` is correct
- Check browser console for errors

**Need detailed help?**

- See [DEPLOYMENT.md](file:///d:/Aichatbot/DEPLOYMENT.md) for full guide

---

**Your project is ready to deploy! 🎉**
