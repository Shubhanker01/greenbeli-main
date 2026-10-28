const { mfaEnrollment, mfaVerify, mfaResetRequest, mfaResetVerify } = require('../controllers/mfaController');

const express = require('express');
const router = express.Router();

router.route('/enroll').post(mfaEnrollment);
router.route('/verify').post(mfaVerify);
router.route('/reset').post(mfaResetRequest);
router.route('/reset-verify').post(mfaResetVerify);

module.exports = router;