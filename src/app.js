const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { engine } = require('express-handlebars');
const winston = require('winston');

// Load environment variables
// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Database
const sequelize = require('./config/database');
const cleanupTask = require('./services/cleanup');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console()
    ]
});



const { rateLimiter } = require('./middleware/auth');

// Global Rate Limiting
app.use(rateLimiter);

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
