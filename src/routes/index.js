const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const Audit = require('../models/Audit');
const apiKeyAuth = require('../middleware/auth');

// Public route: Redirect
router.get('/s/:shortUrl', async (req, res) => {
    try {
        const { shortUrl } = req.params;
        const urlEntry = await Url.findByPk(shortUrl);

        if (urlEntry && !urlEntry.isExpired) {
            // Audit valid access
            // We don't await this to keep redirect fast, but catch errors
            Audit.create({
                eventType: 'ACCESSED',
                urlAccessed: shortUrl,
                details: 'Redirected to ' + urlEntry.longURL
            }).catch(err => console.error('Audit error', err));

            return res.redirect(urlEntry.longURL);
        }

        // Check if it WAS valid but expired
        if (urlEntry && urlEntry.isExpired) {
            Audit.create({
                eventType: 'EXPIRED_ACCESS',
                urlAccessed: shortUrl,
                details: 'Attempted access to expired URL'
            }).catch(err => console.error('Audit error', err));
        }

        // If not found or expired, show 404
        // The 404 page should be "good looking"
        res.render('404', { layout: 'main' });

    } catch (error) {
        console.error(error);
        res.render('404', { layout: 'main' });
    }
});

// Protected route: Home page
// We don't force auth on ALL of index, only the root?
// "Post Login Main Page" -> /
router.get('/', apiKeyAuth, (req, res) => {
    res.render('home', { layout: 'main' });
});

module.exports = router;
