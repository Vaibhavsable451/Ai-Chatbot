require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({
    limit: '50mb'
})); // Increased limit for images

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log("Email server connection error:", error);
    } else {
        console.log("Email server is ready to take our messages");
    }
});

// Endpoint to send OTP
app.post('/send-otp', async (req, res) => {
    const {
        email
    } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required'
        });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const mailOptions = {
        from: `"Kairo AI" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Kairo AI Verification Code',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
                <div style="background-color: #1e293b; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="color: #fff; margin: 0;">Kairo AI</h1>
                </div>
                <div style="background-color: #fff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <h2 style="color: #333; margin-top: 0;">Verification Code</h2>
                    <p style="color: #666;">Please use the following code to complete your signup:</p>
                    <div style="background-color: #f0fdf4; border: 1px dashed #16a34a; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; color: #16a34a; letter-spacing: 5px; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px; text-align: center;">If you didn't request this code, please ignore this email.</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
        res.json({
            success: true,
            otp: otp
        });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to send email'
        });
    }
});

// Chat Endpoint (Proxy to Groq)
app.post('/chat', async (req, res) => {
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Groq API Error: ${response.status} - ${errorText}`);
        }

        // Pipe the stream directly to the client
        // Note: fetch in Node 18+ returns a web stream, but Express expects a node stream.
        // For simplicity with text/event-stream, we can just iterate and write.

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const {
                done,
                value
            } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, {
                stream: true
            });
            res.write(chunk);
        }
        res.end();

    } catch (error) {
        console.error("Chat API Error:", error);
        res.status(500).json({
            error: "Failed to fetch response from AI"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});