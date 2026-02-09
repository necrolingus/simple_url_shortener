const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login', {
        layout: 'main',
        githubRepo: process.env.GITHUB_REPO || 'https://github.com/necrolingus/simple_url_shortener'
    });
});

router.post('/login', (req, res) => {
    const { apiKey } = req.body;

    if (apiKey === process.env.API_KEY) {

        // Set cookie
        res.cookie('api_key', apiKey, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day
        // Return success for AJAX
        res.json({ success: true, redirect: '/' });
    } else {
        res.status(401).json({ error: 'Invalid API Key' });
    }
});

module.exports = router;
