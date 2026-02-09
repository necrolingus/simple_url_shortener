const { Op } = require('sequelize');
const Url = require('../models/Url');
const Audit = require('../models/Audit');
const logger = require('winston'); // Assuming we setup logger later or use console for now, but winston was installed

const cleanupTask = () => {
    // Run immediately on start
    runCleanup();

    // Schedule to run every hour
    setInterval(runCleanup, 60 * 60 * 1000);
};

const runCleanup = async () => {
    try {
        console.log('Running cleanup task...');
        const now = new Date();

        // Find URLs that are NOT expired but SHOULD be
        // We need to calculate expiry date based on createdDate + expiryDays
        // Since we can't easily do (createdDate + expiryDays) < now in standard SQL without dialect specific syntax easily in all ORMs,
        // we might handle this by fetching or using a raw query. 
        // However, Sequelize allows literal.

        // Simpler approach: Fetch all valid URLs and check in JS if dataset is small, 
        // OR better: use a raw query update.

        // Let's use a robust approach: Find all active URLs, check expiry.
        // For a "Simple" shortener, this is fine.

        const activeUrls = await Url.findAll({ where: { isExpired: false } });

        for (const url of activeUrls) {
            const created = new Date(url.createdDate);
            const expiryDate = new Date(created.getTime() + (url.expiryDays * 24 * 60 * 60 * 1000));

            if (now > expiryDate) {
                // Expire it
                url.isExpired = true;
                await url.save();

                // Audit
                await Audit.create({
                    eventType: 'EXPIRED_TASK',
                    urlAccessed: url.shortURL,
                    details: `URL expired by cleanup task. Created: ${created.toISOString()}, Expiry: ${expiryDate.toISOString()}`
                });

                console.log(`Expired URL: ${url.shortURL}`);
            }
        }
    } catch (error) {
        console.error('Error in cleanup task:', error);
    }
};

module.exports = cleanupTask;
