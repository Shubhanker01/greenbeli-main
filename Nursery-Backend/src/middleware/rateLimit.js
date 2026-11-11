const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 5, // Limit each IP / user to 5 failed attempts per window
    message: {
        success: false,
        message: "Too many login attempts. Please try again after 15 minutes."
    },
    standardHeaders: true, // Return rate limit info in the headers
    legacyHeaders: false,
});

const verifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 7,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skipSuccessfulRequests: true, // only failed attempts count
    message: { message: 'Too many attempts. Please try again later.' },
});

// Reset request: stops email/SMS spam and enumeration
const resetRequestLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 3,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many reset requests. Please try again later.' },
});

// Enrollment: more lenient
const enrollLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});




module.exports = { loginLimiter, enrollLimiter, verifyLimiter, resetRequestLimiter };