/**
 * Simple URL Shortener - Main application entry point.
 * Sets up Express, Handlebars, middleware, rate limiting, and routes.
 */

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { engine } = require('express-handlebars');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Database
const sequelize = require('./config/database');
const cleanupTask = require('./services/cleanup');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;
app.set('trust proxy', parseInt(process.env.NUMBER_OF_PROXIES) || 1);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cookieSecret = process.env.COOKIE_SECRET;
if (!cookieSecret) {
    console.warn('WARNING: COOKIE_SECRET is not set. Signed cookies will not be secure.');
}
app.use(cookieParser(cookieSecret));
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Global Rate Limiting (express-rate-limit)
const windowSeconds = process.env.RATE_LIMIT_WINDOW ? parseInt(process.env.RATE_LIMIT_WINDOW) : 60;
const maxRequests = process.env.RATE_LIMIT ? parseInt(process.env.RATE_LIMIT) : 15;

const limiter = rateLimit({
    windowMs: windowSeconds * 1000,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    handler: (req, res) => {
        // For browser page loads, render the home page with an error message
        if (req.accepts('html')) {
            return res.status(429).render('home', {
                layout: 'main',
                urls: [],
                rateLimitError: 'Too many requests. Please wait and try again.'
            });
        }
        // For API/AJAX calls, return JSON
        return res.status(429).json({ error: 'Too Many Requests' });
    }
});

app.use(limiter);

// Routes
app.use('/', require('./routes/auth')); // Login
app.use('/', require('./routes/index')); // Home and Redirects
app.use('/api', require('./routes/url')); // API

// Start Server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Sync models
        await sequelize.sync();
        console.log('Models synced.');

        // Start cleanup task
        cleanupTask();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
