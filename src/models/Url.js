const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Url = sequelize.define('Url', {
    shortURL: {
        type: DataTypes.STRING(10), // Adjustable length via logic, but DB col needs max
        primaryKey: true,
        allowNull: false
    },
    longURL: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    expiryDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30
    },
    isExpired: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'tbl_sus_urls',
    timestamps: true,
    createdAt: 'createdDate',
    updatedAt: false // We only care about creation date
});

User.hasMany(Url, { foreignKey: 'userId' });
Url.belongsTo(User, { foreignKey: 'userId' });

module.exports = Url;
