/* ==========================================================================
   QVIT OS — Node.js / Express Web Server
   ========================================================================== */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

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
