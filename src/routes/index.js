/**
 * Index routes - Home page and short URL redirects.
 * GET / renders the home page with a list of all URLs.
 * GET /s/:shortUrl redirects to the original URL.
 */

const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const Url = require('../models/Url');
const Audit = require('../models/Audit');
const { apiKeyAuth } = require('../middleware/auth');

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
        res.render('404', { layout: 'main' });

    } catch (error) {
        console.error(error);
        res.render('404', { layout: 'main' });
    }
});

// Protected route: Home page with URL list
router.get('/', apiKeyAuth, async (req, res) => {
    try {
        // Fetch all URLs ordered by creation date descending
        const urls = await Url.findAll({
            order: [['createdDate', 'DESC']]
        });

        // For each URL, get click count from audit table
        const urlList = await Promise.all(urls.map(async (url) => {
            const clickCount = await Audit.count({
                where: {
                    eventType: 'ACCESSED',
                    urlAccessed: url.shortURL
                }
            });

            // Compute expiry date
            const createdDate = new Date(url.createdDate);
            const expiryDate = new Date(createdDate.getTime() + (url.expiryDays * 24 * 60 * 60 * 1000));

            const domain = process.env.DOMAIN || `http://localhost:${process.env.PORT}`;

            return {
                shortURL: url.shortURL,
                fullShortURL: `${domain}/s/${url.shortURL}`,
                longURL: url.longURL,
                createdDate: createdDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                expiryDate: expiryDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                isExpired: url.isExpired,
                clickCount: clickCount
            };
        }));

        res.render('home', { layout: 'main', urls: urlList });

    } catch (error) {
        console.error('[ERROR] Failed to load home page:', error);
        res.render('home', { layout: 'main', urls: [] });
    }
});

module.exports = router;
