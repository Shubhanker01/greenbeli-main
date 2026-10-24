const { mfaEnrollment, mfaVerify } = require('../controllers/mfaController');

const express = require('express');
const router = express.Router();

router.route('/enroll').post(mfaEnrollment);
router.route('/verify').post(mfaVerify);

module.exports = router;