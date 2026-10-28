const express = require("express");
const router = express.Router();

const { authMiddleware, requireUser } = require("../middleware/authMiddleware");
const { register, login, me, getAllusers, logout, updateProfile, confirmEmail, userSession } = require("../controllers/authController");

router.post("/register", register);
router.post("/confirm", confirmEmail);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.put("/update-profile", authMiddleware, updateProfile);
router.get("/getAllusers", getAllusers);
router.post("/logout", logout);
router.get("/session", requireUser, userSession);

module.exports = router;

