# Deploying AI Chatbot to Vercel

This guide will help you deploy your AI Chatbot project to Vercel.

## Prerequisites

Before deploying, make sure you have:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to GitHub at `https://github.com/Vaibhavsable451/Ai-Chatbot.git`
3. **Environment Variables Ready**:
   - `GROQ_API_KEY` - Your Groq API key
   - `EMAIL_USER` - Your Gmail address
   - `EMAIL_PASS` - Your Gmail App Password (see below)

## Getting Gmail App Password

> [!IMPORTANT]
> You need a Gmail **App Password**, not your regular password.

1. Go to your [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Scroll down to **App passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-character password (this is your `EMAIL_PASS`)

## Deployment Methods

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**

   - Visit [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"

2. **Import from GitHub**

   - Select "Import Git Repository"
   - Paste your repository URL: `https://github.com/Vaibhavsable451/Ai-Chatbot.git`
   - Click "Import"

3. **Configure Project**

   - **Project Name**: Choose a name (e.g., `kairo-ai-chatbot`)
   - **Framework Preset**: Select "Other"
   - **Root Directory**: Leave as `./`
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty

4. **Add Environment Variables**

   - Click "Environment Variables"
   - Add these three variables:
     ```
     GROQ_API_KEY = your_groq_api_key_here
     EMAIL_USER = your_gmail@gmail.com
     EMAIL_PASS = your_16_char_app_password
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (usually 1-2 minutes)
   - You'll get a URL like `https://your-project.vercel.app`

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy from Project Directory**

   ```bash
   cd d:\Aichatbot
   vercel
   ```

4. **Follow the prompts**:

   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? Press Enter (or choose a name)
   - In which directory is your code? **.**
   - Want to override settings? **N**

5. **Add Environment Variables**

   ```bash
   vercel env add GROQ_API_KEY
   vercel env add EMAIL_USER
   vercel env add EMAIL_PASS
   ```

   For each command, select "Production" and paste the value.

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## After Deployment

### Testing Your Deployment

1. **Visit Your Site**

   - Open the Vercel URL (e.g., `https://your-project.vercel.app`)
   - You should see the Kairo Chatbot landing page

2. **Test Signup Flow**

   - Click "Sign Up"
   - Enter an email address
   - Check if OTP email is received
   - Complete signup process

3. **Test Chat Functionality**
   - Login to the chat
   - Send a message
   - Verify AI responds correctly

### Troubleshooting

#### OTP Email Not Sending

- Verify `EMAIL_USER` and `EMAIL_PASS` are correct in Vercel dashboard
- Make sure you're using Gmail App Password, not regular password
- Check Vercel function logs for errors

#### Chat Not Working

- Verify `GROQ_API_KEY` is set correctly
- Check browser console for errors
- Review Vercel function logs

#### Static Files Not Loading

- Clear browser cache
- Check that CSS/JS files are in the root directory
- Verify `vercel.json` routes are correct

### Viewing Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click on "Functions" tab
4. Click on any function to see logs

## Updating Your Deployment

### Auto-Deploy (GitHub Integration)

If you deployed via Vercel Dashboard with GitHub:

- Every push to your `main` branch will auto-deploy
- Pull requests create preview deployments

### Manual Deploy (CLI)

```bash
cd d:\Aichatbot
vercel --prod
```

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Project Structure

```
d:\Aichatbot\
├── api/                    # Serverless functions
│   ├── chat.js            # Chat API endpoint
│   └── send-otp.js        # OTP email endpoint
├── assets/                # Images and assets
├── index.html             # Landing page
├── login.html             # Login page
├── signup.html            # Signup page
├── chat.html              # Chat interface
├── auth.css               # Authentication styles
├── auth.js                # Authentication logic
├── Style.css              # Main styles
├── Script.js              # Main JavaScript
├── server.js              # Local development server
├── vercel.json            # Vercel configuration
├── package.json           # Dependencies
└── .env                   # Local environment variables (not deployed)
```

## Important Notes

> [!WARNING]
>
> - Never commit `.env` file to GitHub (it's in `.gitignore`)
> - Always use environment variables in Vercel dashboard for secrets
> - Gmail App Passwords are 16 characters without spaces

> [!TIP]
>
> - Use Vercel's preview deployments to test changes before production
> - Monitor function logs to debug issues
> - Set up custom domain for professional appearance

## Support

If you encounter issues:

1. Check Vercel function logs
2. Review browser console errors
3. Verify all environment variables are set
4. Test API endpoints individually

---

**Deployment Status**: ✅ Ready to Deploy

Your project is now configured for Vercel deployment. Follow the steps above to deploy!
