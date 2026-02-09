const { Sequelize } = require('sequelize');
require('dotenv').config();

let dbConfig = process.env.DB_CONFIG;
if (!dbConfig && process.env.DB_HOST) {
    const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
    dbConfig = `postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:5432/${DB_NAME}`;
}

const sequelize = new Sequelize(dbConfig, {
    dialect: 'postgres',
    logging: false, // Set to console.log to see SQL queries
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = sequelize;
