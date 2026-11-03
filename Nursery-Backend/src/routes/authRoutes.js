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
const { standardLimit } = require("../middleware/rateLimit");

router.post("/register", standardLimit, register);
router.post("/confirm", standardLimit, confirmEmail);
router.post("/login", standardLimit, login);
router.post("/forgot-password", standardLimit, forgotPassword);
router.get("/reset-password/validate", standardLimit, validatePasswordResetToken);
router.post("/reset-password", standardLimit, changePassword);
router.get("/me", requireUser, me);
router.put("/update-profile", requireUser, updateProfile);
router.post("/logout", logout);
router.get("/session", userSession);

module.exports = router;
