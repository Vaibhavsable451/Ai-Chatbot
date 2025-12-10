// API Configuration
// This file manages the backend API URL

// INSTRUCTIONS:
// 1. First deploy your backend to Vercel
// 2. Copy your Vercel API URL (e.g., https://your-project.vercel.app)
// 3. Replace 'YOUR_VERCEL_URL_HERE' below with your actual Vercel URL
// 4. Commit and push changes
// 5. Deploy frontend to Netlify

// For local development (uncomment this line when testing locally)
// const API_BASE_URL = 'http://localhost:3000';

// For production (update this with your Vercel URL)
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ?
    'http://localhost:3000' :
    'https://aichatbot-vaibhavs-projects-4e49c010.vercel.app';

// API Endpoints
const API_ENDPOINTS = {
    SEND_OTP: `${API_BASE_URL}/api/send-otp`,
    CHAT: `${API_BASE_URL}/api/chat`
};

// Make available globally
window.API_CONFIG = {
    BASE_URL: API_BASE_URL,
    ENDPOINTS: API_ENDPOINTS
};