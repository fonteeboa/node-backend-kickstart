const sanitizeInput = require('../utils/sanitaze');

const sanitizeMiddleware = (req, res, next) => {
  res.removeHeader('X-Powered-By');
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }
  if (req.query) {
    req.query = sanitizeInput(req.query);
  }
  if (req.params) {
    req.params = sanitizeInput(req.params);
  }
  next();
};

module.exports = sanitizeMiddleware;
