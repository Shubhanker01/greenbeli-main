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

module.exports = {loginLimiter};