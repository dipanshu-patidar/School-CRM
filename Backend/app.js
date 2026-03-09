const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', authRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('RIDSS PROGRAM CRM API is running...');
});

// Error Handling Middleware (Basic)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Server Error'
    });
});

module.exports = app;
