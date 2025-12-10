require('dotenv').config();
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    const {
        email
    } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required'
        });
    }

    // Email Transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

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
};