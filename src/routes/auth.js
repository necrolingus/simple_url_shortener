const express = require('express');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const User = require('../models/User');
const Session = require('../models/Session');
const { requireAuth, COOKIE_NAME } = require('../middleware/auth');

// Strict rate limiter for recovery attempts (brute-force protection)
const recoveryWindowSeconds = process.env.RECOVERY_RATE_LIMIT_WINDOW ? parseInt(process.env.RECOVERY_RATE_LIMIT_WINDOW) : 900;
const recoveryMaxRequests = process.env.RECOVERY_RATE_LIMIT ? parseInt(process.env.RECOVERY_RATE_LIMIT) : 5;

const recoveryLimiter = rateLimit({
    windowMs: recoveryWindowSeconds * 1000,
    max: recoveryMaxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    handler: (req, res) => {
        return res.status(429).json({ error: 'Too many recovery attempts. Please try again later.' });
    }
});

const COOKIE_DAYS = parseInt(process.env.COOKIE_VALID_DAYS, 10) || 30;

function setSessionCookie(res, token) {
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: COOKIE_DAYS * 24 * 60 * 60 * 1000
    });
}

async function createSessionForUser(userId) {
    const sessionToken = crypto.randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + COOKIE_DAYS * 24 * 60 * 60 * 1000);
    await Session.create({ userId, sessionToken, expiresAt });
    return sessionToken;
}

router.get('/login', (req, res) => {
    res.render('login', {
        layout: 'main',
        error: null,
        recoveryToken: null
    });
});

router.post('/login', async (req, res) => {
    try {
        const { action, recovery_token } = req.body;

        if (action === 'create') {
            const recoveryToken = crypto.randomBytes(6).toString('hex');
            const user = await User.create({ recoveryToken });
            const sessionToken = await createSessionForUser(user.id);
            setSessionCookie(res, sessionToken);
            return res.json({ success: true, recoveryToken });
        }

        if (action === 'recover') {
            return recoveryLimiter(req, res, async () => {
                if (!recovery_token || !recovery_token.trim()) {
                    return res.status(400).json({ error: 'Recovery token is required' });
                }

                const user = await User.findOne({
                    where: { recoveryToken: recovery_token.trim() }
                });

                if (!user) {
                    return res.status(401).json({ error: 'Invalid recovery token' });
                }

                const sessionToken = await createSessionForUser(user.id);
                setSessionCookie(res, sessionToken);
                return res.json({ success: true, redirect: '/' });
            });
        }

        return res.status(400).json({ error: 'Invalid action' });
    } catch (error) {
        console.error('[ERROR] Login failed:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.post('/logout', requireAuth, async (req, res) => {
    try {
        await Session.destroy({ where: { sessionToken: req.sessionData.sessionToken } });
    } catch (error) {
        console.error('[ERROR] Logout session delete failed:', error);
    }
    res.clearCookie(COOKIE_NAME);
    res.redirect('/login');
});

module.exports = router;
