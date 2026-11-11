const express = require("express");
const router = express.Router();

const { requireUser } = require("../middleware/authMiddleware");
const {
  register,
  login,
  forgotPassword,
  validatePasswordResetToken,
  changePassword,
  me,
  logout,
  updateProfile,
  confirmEmail,
  userSession,
} = require("../controllers/authController");
const { loginLimiter } = require("../middleware/rateLimit");

router.post("/register", loginLimiter, register);
router.post("/confirm", loginLimiter, confirmEmail);
router.post("/login", loginLimiter, login);
router.post("/forgot-password", loginLimiter, forgotPassword);
router.get("/reset-password/validate", loginLimiter, validatePasswordResetToken);
router.post("/reset-password", loginLimiter, changePassword);
router.get("/me", requireUser, me);
router.put("/update-profile", requireUser, updateProfile);
router.post("/logout", logout);
router.get("/session", userSession);

module.exports = router;
