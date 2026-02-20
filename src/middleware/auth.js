/**
 * Authentication middleware for API key validation.
 * Checks header first, then cookie for the API key.
 * Cookie values are AES-256-GCM encrypted and must be decrypted before comparison.
 */

const { decryptCookieValue } = require('../utils/cookieCrypto');

const apiKeyAuth = (req, res, next) => {
    // Header API key is used as-is (plaintext); cookie value must be decrypted
    const headerKey = req.headers['api-key'] || null;

    let cookieKey = null;
    const rawCookieVal = req.signedCookies ? req.signedCookies['api_key'] : null;
    if (rawCookieVal) {
        cookieKey = decryptCookieValue(rawCookieVal);
    }

    const apiKey = headerKey || cookieKey;

    // Check if API key exists and matches
    if (!apiKey || apiKey !== process.env.API_KEY) {
        // If it's a browser request (accepts html), redirect to login
        if (req.accepts('html')) {
            // Avoid redirect loop if already on login
            if (req.path === '/login') return next();
            return res.redirect('/login');
        }
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
    }

    next();
};

module.exports = { apiKeyAuth };

