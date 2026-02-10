const rateLimit = new Map();
const RATE_LIMIT_WINDOW = process.env.RATE_LIMIT_WINDOW ? parseInt(process.env.RATE_LIMIT_WINDOW) : 60 * 1000; // 1 minute
const MAX_REQUESTS = process.env.RATE_LIMIT ? parseInt(process.env.RATE_LIMIT) : 5;

const rateLimiter = (req, res, next) => {
    // Ip detection
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();

    if (!rateLimit.has(ip)) {
        rateLimit.set(ip, []);
    }

    const timestamps = rateLimit.get(ip);
    const recentRequests = timestamps.filter(time => now - time < RATE_LIMIT_WINDOW);

    // Update with filtered list
    rateLimit.set(ip, recentRequests);

    if (recentRequests.length >= MAX_REQUESTS) {
        return res.status(429).json({ error: 'Too Many Requests' });
    }

    recentRequests.push(now);
    rateLimit.set(ip, recentRequests);
    next();
}

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

module.exports = { rateLimiter, apiKeyAuth };
