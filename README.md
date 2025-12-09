# AI Chatbot

An AI-powered chatbot application with support for text, images, and PDF files.

## Features

- 💬 Text-based chat with AI
- 🖼️ Image upload and analysis
- 📄 PDF file processing
- 🎤 Voice input support
- 🔊 Text-to-speech responses
- 🎨 Multiple theme options
- 📱 Responsive design

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Vaibhavsable451/Ai-Chatbot.git
cd Ai-Chatbot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the `.env.example` file to `.env`:

```bash
copy .env.example .env
```

Then edit the `.env` file and add your actual API keys:

```
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
PORT=3000
GROQ_API_KEY=your_groq_api_key_here
```

**Important:** Never commit your `.env` file to Git! It's already included in `.gitignore`.

### 4. Get Your Groq API Key

1. Visit [Groq Console](https://console.groq.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and paste it in your `.env` file

### 5. Update Script.js (Optional)

If you want to use the API key directly in `Script.js` for local development:

1. Open `Script.js`
2. Replace `YOUR_GROQ_API_KEY_HERE` with your actual API key
3. **Remember:** Do NOT commit this change to Git!

### 6. Run the Application

For local development:

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Security Notes

⚠️ **IMPORTANT:** Never commit API keys or sensitive credentials to Git!

- The `.env` file is gitignored to prevent accidental commits
- Always use placeholder values in example files
- If you accidentally commit a secret, you must:
  1. Revoke the exposed API key immediately
  2. Generate a new API key
  3. Clean the Git history to remove the secret
  4. Force push the cleaned history

## Deployment

This project is configured for Netlify deployment. See `netlify.toml` for configuration.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **AI API:** Groq (Llama models)
- **PDF Processing:** PDF.js
- **Markdown Rendering:** Marked.js
- **Syntax Highlighting:** Highlight.js

## License

MIT License
