
const express = require('express');
const dotenv = require('dotenv');
const sanitizeMiddleware = require('./middlewares/sanitizeMiddleware');
const securityMiddlewares = require('./middlewares/securityMiddleware');

dotenv.config();
const port = process.env.PORT || 10000;

const app = express();
app.use(securityMiddlewares);
app.use(sanitizeMiddleware);

app.get('/', (req, res) => {
    res.send('We are ready to go!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    
    if (req.xhr || req.headers.accept.includes('json')) {
      res.status(500).json({ error: 'Something went wrong!' });
    } else {
      res.status(500).send('Something went wrong!');
    }
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.info("Server running on port: " + port);
    });
}

module.exports = app;
