const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Audit = sequelize.define('Audit', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    eventType: {
        type: DataTypes.STRING(50), // e.g., 'CREATED', 'ACCESSED', 'EXPIRED_TASK', 'EXPIRED_ACCESS'
        allowNull: false
    },
    urlAccessed: {
        type: DataTypes.STRING, // Store the short URL or the path accessed
        allowNull: true
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'tbl_sus_audits',
    timestamps: true,
    updatedAt: false
});

module.exports = Audit;
