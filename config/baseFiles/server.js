const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 10000;

// Security middleware
app.use(helmet());
// Cross-Origin Resource Sharing
app.use(cors());
// HTTP request logger
app.use(morgan('combined'));

app.use(express.json());

// Placeholder route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.info("Server running on port: " + port);
});
