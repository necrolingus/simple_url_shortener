/**
 * One-time migration: adds userId column to tbl_sus_urls if missing.
 * Creates a "legacy" user and assigns all existing URLs to it.
 * Safe to run multiple times - skips if column already exists.
 */

const sequelize = require('../config/database');
const crypto = require('crypto');

async function migrateUrlsAddUserId() {
    const qi = sequelize.getQueryInterface();

    // Check if userId column already exists on tbl_sus_urls
    const columns = await qi.describeTable('tbl_sus_urls').catch(() => null);

    if (!columns) {
        // Table doesn't exist yet - Sequelize sync will create it fresh
        return;
    }

    if (columns.userId) {
        // Column already exists, nothing to do
        return;
    }

    console.log('[MIGRATE] Adding userId column to tbl_sus_urls...');

    // Ensure tbl_sus_users exists (sync just the User model first)
    const User = require('../models/User');
    await User.sync();

    // Create a legacy user to own the existing URLs
    const recoveryToken = crypto.randomBytes(6).toString('hex');
    const [legacyUser] = await sequelize.query(
        `INSERT INTO "tbl_sus_users" ("recoveryToken", "createdAt") VALUES (:token, NOW()) RETURNING id`,
        { replacements: { token: recoveryToken }, type: sequelize.QueryTypes.SELECT }
    );

    const legacyUserId = legacyUser.id;
    console.log(`[MIGRATE] Created legacy user (id=${legacyUserId}, recoveryToken=${recoveryToken}) for existing URLs.`);

    // Add the column as nullable first
    await sequelize.query(`ALTER TABLE "tbl_sus_urls" ADD COLUMN "userId" INTEGER`);

    // Assign all existing URLs to the legacy user
    await sequelize.query(`UPDATE "tbl_sus_urls" SET "userId" = :userId WHERE "userId" IS NULL`, {
        replacements: { userId: legacyUserId }
    });

    // Now set NOT NULL and add the foreign key
    await sequelize.query(`ALTER TABLE "tbl_sus_urls" ALTER COLUMN "userId" SET NOT NULL`);
    await sequelize.query(
        `ALTER TABLE "tbl_sus_urls" ADD CONSTRAINT "fk_urls_userId" FOREIGN KEY ("userId") REFERENCES "tbl_sus_users" ("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );

    console.log(`[MIGRATE] Migration complete. All existing URLs assigned to legacy user. Recovery token: ${recoveryToken}`);
}

module.exports = { migrateUrlsAddUserId };
