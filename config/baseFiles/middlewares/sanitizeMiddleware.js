const sanitizeInput = require('../utils/sanitaze');

const sanitizeMiddleware = (req, res, next) => {
  res.removeHeader('X-Powered-By');
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }
  next();
};

module.exports = sanitizeMiddleware;
