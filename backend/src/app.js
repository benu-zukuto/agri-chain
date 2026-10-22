const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const routes = require('./routes');
const ApiError = require('./utils/apiError');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));

// Serve static files for QR codes
app.use('/qr', express.static(path.join(__dirname, '../qr')));

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Mount Routers
app.use('/api/v1', routes);

// 404 Route Not Found
app.use((req, res, next) => {
    next(new ApiError(404, `Route not found: ${req.originalUrl}`));
});

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        statusCode,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
});

module.exports = app;
