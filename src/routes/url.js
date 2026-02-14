const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const Audit = require('../models/Audit');
const { generateShortCode } = require('../services/shortener');
const { apiKeyAuth } = require('../middleware/auth');

// Apply auth to these routes
router.use(apiKeyAuth);

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
            expiryDays: days,
            isExpired: false
        });

        // Audit
        await Audit.create({
            eventType: 'CREATED',
            urlAccessed: shortCode,
            details: `Created by user. LongURL: ${longUrl}`
        });

        const domain = process.env.DOMAIN || `http://localhost:${process.env.PORT}`;
        const fullShortUrl = `${domain}/s/${shortCode}`;

        res.json({ shortUrl: fullShortUrl });

    } catch (error) {
        console.error('[ERROR] Shorten URL failed:', error);
        console.log('[DEBUG] Error details:', JSON.stringify(error, null, 2)); // Detailed JSON log
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// Delete a short URL
router.delete('/urls/:shortUrl', async (req, res) => {
    try {
        const { shortUrl } = req.params;
        const urlEntry = await Url.findByPk(shortUrl);

        if (!urlEntry) {
            return res.status(404).json({ error: 'URL not found' });
        }

        await urlEntry.destroy();

        // Audit the deletion
        await Audit.create({
            eventType: 'DELETED',
            urlAccessed: shortUrl,
            details: `Deleted by user. LongURL was: ${urlEntry.longURL}`
        });

        res.json({ success: true });

    } catch (error) {
        console.error('[ERROR] Delete URL failed:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

module.exports = router;
