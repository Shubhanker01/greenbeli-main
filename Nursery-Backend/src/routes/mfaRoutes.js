const { mfaEnrollment, mfaVerify, mfaResetRequest, mfaResetVerify } = require('../controllers/mfaController');
const { enrollLimiter, verifyLimiter, resetRequestLimiter } = require("../middleware/rateLimit");

const express = require('express');
const router = express.Router();

router.route('/enroll').post(enrollLimiter, mfaEnrollment);
router.route('/verify').post(verifyLimiter, mfaVerify);
router.route('/reset').post(resetRequestLimiter, mfaResetRequest);
router.route('/reset-verify').post(verifyLimiter, mfaResetVerify);

module.exports = router;