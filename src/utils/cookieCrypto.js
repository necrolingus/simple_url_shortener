/**
 * Cookie value encryption/decryption using AES-256-GCM.
 * Ensures the API key is never stored in plaintext inside the browser cookie.
 */

const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';

/**
 * Derives a 32-byte AES key from the COOKIE_SECRET env variable.
 */
function getKey() {
    const secret = process.env.COOKIE_SECRET;
    if (!secret) throw new Error('COOKIE_SECRET is not set in environment variables.');
    // SHA-256 gives us exactly 32 bytes needed for AES-256
    return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Encrypts a plaintext string.
 * Returns a hex-encoded string: "<iv>:<authTag>:<ciphertext>"
 */
function encryptCookieValue(plaintext) {
    const key = getKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    const encrypted = Buffer.concat([
        cipher.update(plaintext, 'utf8'),
        cipher.final()
    ]);
    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Decrypts a value produced by encryptCookieValue.
 * Returns the original plaintext, or null if decryption fails (tampered/invalid cookie).
 */
function decryptCookieValue(ciphertext) {
    try {
        const key = getKey();
        const parts = ciphertext.split(':');
        if (parts.length !== 3) return null;

        const [ivHex, authTagHex, encryptedHex] = parts;
        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const encrypted = Buffer.from(encryptedHex, 'hex');

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([
            decipher.update(encrypted),
            decipher.final()
        ]);

        return decrypted.toString('utf8');
    } catch {
        // Covers tampered data, wrong key, invalid format, etc.
        return null;
    }
}

module.exports = { encryptCookieValue, decryptCookieValue };
