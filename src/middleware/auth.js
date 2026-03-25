const Session = require('../models/Session');
const User = require('../models/User');
const { Op } = require('sequelize');

const COOKIE_NAME = 'sus_session';

const requireAuth = async (req, res, next) => {
    const token = req.cookies[COOKIE_NAME];

    if (!token) {
        if (req.accepts('html')) {
            return res.redirect('/login');
        }
        return res.status(401).json({ error: 'Unauthorized: No session' });
    }

    try {
        const session = await Session.findOne({
            where: {
                sessionToken: token,
                expiresAt: { [Op.gt]: new Date() }
            },
            include: [{ model: User }]
        });

        if (!session) {
            res.clearCookie(COOKIE_NAME);
            if (req.accepts('html')) {
                return res.redirect('/login');
            }
            return res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
        }

        req.user = session.User;
        req.sessionData = session;
        next();
    } catch (error) {
        console.error('[ERROR] Auth middleware:', error);
        res.clearCookie(COOKIE_NAME);
        if (req.accepts('html')) {
            return res.redirect('/login');
        }
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { requireAuth, COOKIE_NAME };
