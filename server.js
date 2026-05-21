/* ==========================================================================
   QVIT OS — Node.js / Express Web Server
   ========================================================================== */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// ── Security & Caching Headers ───────────────────────────────────────────────
app.use((req, res, next) => {
    // Cache strategy: HTML never cached, images/media cached shorter during dev
    if (req.path === '/' || req.path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else if (req.path.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) {
        // Images: short cache (2 hours) or use query params for cache-busting
        res.setHeader('Cache-Control', 'public, max-age=7200');
    } else {
        // CSS, JS, fonts: cache for 1 day
        res.setHeader('Cache-Control', 'public, max-age=86400');
    }

    // Basic security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

// ── Serve Static Files from /public ─────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public'), {
    extensions: ['html'],
    index: 'index.html',
}));

// ── Request Logger ───────────────────────────────────────────────────────────
app.use((req, res, next) => {
    const now = new Date().toISOString();
    console.log(`[${now}]  ${req.method}  ${req.url}  →  ${res.statusCode}`);
    next();
});

// ── Contact Form Endpoint (Resend Integration) ──────────────────────────────
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate input
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required',
            });
        }

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email address',
            });
        }

        // Send email via Resend
        const response = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'kollurusaiabhiram2005@gmail.com',
            replyTo: email,
            subject: `New Contact Form Submission: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #00f0ff 0%, #a855f7 100%); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h2 style="color: white; margin: 0;">📨 New Contact Form Submission</h2>
                    </div>
                    <div style="background: #f8f8f8; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
                        <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                        <p style="margin: 8px 0;"><strong>Subject:</strong> ${subject}</p>
                    </div>
                    <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="margin-top: 0;">Message:</h3>
                        <p style="line-height: 1.6; color: #333;">${message.replace(/\n/g, '<br>')}</p>
                    </div>
                    <div style="color: #6b7280; font-size: 12px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 15px;">
                        <p>This message was sent from the <strong>QVIT OS</strong> website contact form.</p>
                    </div>
                </div>
            `,
        });

        console.log('✓ Email sent successfully | ID:', response.id, '| To:', 'kollurusaiabhiram2005@gmail.com');

        return res.status(200).json({
            success: true,
            message: 'Thank you! Your message has been sent successfully.',
            id: response.id,
        });
    } catch (error) {
        console.error('✗ Error sending email:');
        console.error('  Error Code:', error.code || 'UNKNOWN');
        console.error('  Error Message:', error.message);
        console.error('  Full Error:', JSON.stringify(error, null, 2));
        
        // Provide more specific error messages
        let errorMessage = 'Failed to send message. Please try again later.';
        if (error.message && error.message.includes('API key')) {
            errorMessage = 'Email service configuration error. Please contact support.';
        } else if (error.message && error.message.includes('rate')) {
            errorMessage = 'Too many requests. Please try again in a few minutes.';
        }
        
        return res.status(500).json({
            success: false,
            error: errorMessage,
        });
    }
});

// ── Catch-all: serve index.html for any unknown route (SPA behaviour) ───────
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log('\n');
    console.log('  ╔══════════════════════════════════════════════╗');
    console.log('  ║         QVIT OS — Web Server Running         ║');
    console.log('  ╠══════════════════════════════════════════════╣');
    console.log(`  ║  🌐  Local:   http://localhost:${PORT}           ║`);
    console.log(`  ║  📁  Serving: ./public                       ║`);
    console.log('  ║  ⌨️   Press Ctrl+C to stop                   ║');
    console.log('  ╚══════════════════════════════════════════════╝');
    console.log('\n');
});
