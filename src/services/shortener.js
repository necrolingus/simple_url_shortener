const crypto = require('crypto');
const Url = require('../models/Url');

const generateShortCode = async (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    while (true) {
        result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // check uniqueness
        const existing = await Url.findByPk(result);
        if (!existing) {
            return result;
        }
        // loop again if exists
    }
};

module.exports = {
    generateShortCode
};
