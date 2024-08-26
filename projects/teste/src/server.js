const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

// Apply security middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(xssClean());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests, please try again later.'
}));
app.use(mongoSanitize());
app.use(hpp());

// Parses JSON with a size limit to prevent DoS attacks
app.use(express.json({ limit: '10kb' }));

// Basic route
app.get('/', (req, res) => {
    res.send('We are ready to go!');
});

// Centralized error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.info("Server running on port: " + port);
    });
}