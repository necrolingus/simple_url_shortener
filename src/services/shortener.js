const Url = require('../models/Url');

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const generatePrefix = (length = 3) => {
    let prefix = '';
    for (let i = 0; i < length; i++) {
        prefix += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return prefix;
};

const generateShortCode = async (length = 6) => {
    let result = '';
    while (true) {
        result = '';
        for (let i = 0; i < length; i++) {
            result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
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
    generateShortCode,
    generatePrefix
};
