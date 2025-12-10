# 🚀 SPLIT DEPLOYMENT - STEP BY STEP GUIDE

## ✅ What We've Done

Your project is now configured for split deployment:

- ✅ Backend API functions ready for Vercel
- ✅ Frontend configured with centralized API management
- ✅ CORS headers configured
- ✅ All files updated

---

## 📋 DEPLOYMENT STEPS

### PART 1: Deploy Backend to Vercel (Do This FIRST!)

1. **Go to Vercel**: https://vercel.com/new

2. **Import Repository**:

   - Click "Import Project"
   - Paste: `https://github.com/Vaibhavsable451/Ai-Chatbot.git`
   - Click "Import"

3. **Configure Project**:

   - **Project Name**: `aichatbot_api` (or any valid name with underscores/letters)
   - **Framework Preset**: Other
   - **Root Directory**: `.` (leave as is)
   - **Build Command**: leave empty
   - **Output Directory**: leave empty

4. **Add Environment Variables** (CRITICAL!):
   Click "Environment Variables" and add these 3:

   ```
   Name: GROQ_API_KEY
   Value: [paste from your .env file]

   Name: EMAIL_USER
   Value: [paste from your .env file]

   Name: EMAIL_PASS
   Value: [paste from your .env file]
   ```

5. **Deploy!**
   - Click "Deploy"
   - Wait 1-2 minutes
   - **COPY YOUR VERCEL URL** (e.g., `https://aichatbot-api.vercel.app`)

---

### PART 2: Update Frontend Configuration

6. **Open `config.js`** in your editor

7. **Replace `YOUR_VERCEL_URL_HERE`** with your actual Vercel URL:

   ```javascript
   // Change this line:
   const API_BASE_URL = "YOUR_VERCEL_URL_HERE";

   // To this (use YOUR actual URL):
   const API_BASE_URL = "https://aichatbot-api.vercel.app";
   ```

8. **Save the file**

9. **Commit and Push**:
   ```bash
   git add config.js
   git commit -m "Update API URL for production"
   git push origin main
   ```

---

### PART 3: Deploy Frontend to Netlify

10. **Go to Netlify**: https://app.netlify.com/start

11. **Connect to GitHub**:

    - Click "Import from Git"
    - Select "GitHub"
    - Authorize Netlify
    - Select repository: `Ai-Chatbot`

12. **Configure Build Settings**:

    - **Build command**: leave empty
    - **Publish directory**: `.` (or leave empty)
    - Click "Deploy site"

13. **Wait for Deployment** (1-2 minutes)

14. **Get Your URL**: Copy your Netlify URL (e.g., `https://your-site.netlify.app`)

---

## 🧪 TESTING YOUR DEPLOYMENT

### Test Backend (Vercel):

Visit: `https://your-vercel-url.vercel.app/api/send-otp`

- Should see: "Cannot GET /api/send-otp" (this is normal - it only accepts POST)

### Test Frontend (Netlify):

1. Visit your Netlify URL
2. Click "Sign Up"
3. Enter email
4. Check if OTP email arrives
5. Complete signup
6. Test chat functionality

---

## 📝 QUICK REFERENCE

### Your URLs:

- **Backend API (Vercel)**: `https://your-vercel-url.vercel.app`
- **Frontend (Netlify)**: `https://your-site.netlify.app`

### API Endpoints:

- **Send OTP**: `https://your-vercel-url.vercel.app/api/send-otp`
- **Chat**: `https://your-vercel-url.vercel.app/api/chat`

---

## 🆘 TROUBLESHOOTING

### OTP Email Not Sending:

1. Check Vercel environment variables are set correctly
2. Verify you're using Gmail App Password (not regular password)
3. Check Vercel function logs

### Chat Not Working:

1. Verify GROQ_API_KEY is set in Vercel
2. Check browser console for errors
3. Verify config.js has correct Vercel URL

### CSS Not Loading on Netlify:

1. Clear browser cache
2. Check Netlify deploy logs
3. Verify all files are in repository

---

## ✨ BENEFITS OF THIS SETUP

✅ **Netlify** handles static files perfectly (HTML/CSS/JS)
✅ **Vercel** handles serverless functions perfectly (APIs)
✅ **No 404 errors** - each platform does what it's best at
✅ **Fast performance** - CDN for frontend, serverless for backend
✅ **Easy updates** - Push to GitHub, auto-deploy on both platforms

---

## 🎯 SUMMARY

1. Deploy backend to Vercel → Get URL
2. Update `config.js` with Vercel URL
3. Push changes to GitHub
4. Deploy frontend to Netlify
5. Test everything!

**You're all set! 🎉**
