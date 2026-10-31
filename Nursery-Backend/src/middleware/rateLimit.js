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

const standardLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 30,
    message: {
        success: false,
        message: "Too many attempts please try again later"
    },
    standardHeaders: true, // Return rate limit info in the headers
    legacyHeaders: false,
});

const publicSubmitLimit = rateLimit({
    windowMs: 60 * 60 * 1000,   // 1 hour
    limit: 5,                   // 5 submissions per hour per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many submissions. Please try again later." },
});

// A short burst guard on top, so a script can't spend all 5 in a second
const burstLimit = rateLimit({
    windowMs: 60 * 1000,
    limit: 2,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Please wait a moment before submitting again." },
});


module.exports = { loginLimiter, standardLimit, publicSubmitLimit, burstLimit };