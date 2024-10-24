const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const express = require('express');

const securityMiddlewares = [
  helmet(),
  cors(),
  morgan('combined'),
  xssClean(),
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.',
  }),
  mongoSanitize(),
  hpp(),
  express.json({ limit: '10kb' })
];

module.exports = securityMiddlewares;
