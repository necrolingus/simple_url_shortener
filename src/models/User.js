const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    recoveryToken: {
        type: DataTypes.STRING(24),
        allowNull: false,
        unique: true
    },
    displayName: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    tableName: 'tbl_sus_users',
    timestamps: true,
    updatedAt: false
});

module.exports = User;
