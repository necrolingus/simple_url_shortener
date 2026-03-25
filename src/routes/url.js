const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const Audit = require('../models/Audit');
const { generateShortCode } = require('../services/shortener');
const { requireAuth } = require('../middleware/auth');

// Apply auth to these routes
router.use(requireAuth);

router.post('/shorten', async (req, res) => {
    try {
        const { longUrl, customShortUrl, expiryDays } = req.body;

        if (!longUrl) {
            return res.status(400).json({ error: 'Long URL is required' });
        }

        let shortCode = customShortUrl;

        // Validate custom short URL if provided
        if (shortCode) {
            if (!/^[a-zA-Z0-9]+$/.test(shortCode)) {
                return res.status(400).json({ error: 'Custom alias must contain only letters and numbers.' });
            }

            const existing = await Url.findByPk(shortCode);
            if (existing) {
                return res.status(400).json({ error: 'Custom short URL already exists' });
            }
        } else {
            // Generate one
            shortCode = await generateShortCode();
        }

        const days = expiryDays ? parseInt(expiryDays) : 30;

        const newUrl = await Url.create({
            shortURL: shortCode,
            longURL: longUrl,
            userId: req.user.id,
            expiryDays: days,
            isExpired: false
        });

        // Audit
        await Audit.create({
            eventType: 'CREATED',
            urlAccessed: shortCode,
            details: `Created by user ${req.user.id}. LongURL: ${longUrl}`
        });

        const domain = `${req.protocol}://${req.get('host')}`;
        const fullShortUrl = `${domain}/s/${shortCode}`;

        res.json({ shortUrl: fullShortUrl });

    } catch (error) {
        console.error('[ERROR] Shorten URL failed:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// Delete a short URL - only if owned by the current user
router.delete('/urls/:shortUrl', async (req, res) => {
    try {
        const { shortUrl } = req.params;
        const urlEntry = await Url.findByPk(shortUrl);

        if (!urlEntry) {
            return res.status(404).json({ error: 'URL not found' });
        }

        // Ensure the URL belongs to this user
        if (urlEntry.userId !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden: You do not own this URL' });
        }

        await urlEntry.destroy();

        // Audit the deletion
        await Audit.create({
            eventType: 'DELETED',
            urlAccessed: shortUrl,
            details: `Deleted by user ${req.user.id}. LongURL was: ${urlEntry.longURL}`
        });

        res.json({ success: true });

    } catch (error) {
        console.error('[ERROR] Delete URL failed:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

module.exports = router;
