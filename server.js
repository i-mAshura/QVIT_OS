/* ==========================================================================
   QVIT OS — Node.js / Express Web Server
   ========================================================================== */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY || 're_99i2xLwW_GFgSTLMHodbgeA6JDA1HQcpL');

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
            from: 'QVIT OS <onboarding@resend.dev>',
            to: 'kollurusaiabhiram2005@gmail.com',
            replyTo: email,
            subject: `New Contact Form Submission: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>New Contact Form Submission</h2>
                    <hr style="border: none; border-top: 1px solid #e5e7eb;">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb;">
                    <h3>Message:</h3>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px;">
                        This message was sent from the QVIT OS website contact form.
                    </p>
                </div>
            `,
        });

        console.log('✓ Email sent successfully:', response.id);

        return res.status(200).json({
            success: true,
            message: 'Thank you! Your message has been sent successfully.',
            id: response.id,
        });
    } catch (error) {
        console.error('✗ Error sending email:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to send message. Please try again later.',
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
