/**
 * Authentication middleware for API key validation.
 * Checks header first, then cookie for the API key.
 */

const apiKeyAuth = (req, res, next) => {
    // Check header first, then cookie
    const apiKey = req.headers['api-key'] || (req.cookies ? req.cookies['api_key'] : null);

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
