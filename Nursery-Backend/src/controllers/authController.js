const crypto = require("node:crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { createClient } = require("../config/supabase.js");
const { supabaseAdmin } = require("../config/admin.js");
const { normalizePhone } = require("../utils/normalizePhone.js");
const {
  sendEmailConfirmation,
  sendCustomerPasswordResetEmail,
} = require("../utils/email.js");
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
const EMAIL_CONFIRM_TTL_MS = 15 * 60 * 1000;
const PASSWORD_RESET_TTL_MS = 15 * 60 * 1000;

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email });

const hashConfirmToken = (rawToken) =>
  crypto.createHash("sha256").update(rawToken).digest("hex");

const createConfirmToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  return {
    rawToken,
    token_hash: hashConfirmToken(rawToken),
    ttl: new Date(Date.now() + EMAIL_CONFIRM_TTL_MS),
  };
};

const createPasswordResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  return {
    rawToken,
    passwordResetTokenHash: hashConfirmToken(rawToken),
    passwordResetExpiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
  };
};

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  return jwt.sign({ id: String(userId), type: "user" }, secret, { expiresIn });
};


async function syncShopper(supaUser) {
  const email = supaUser.email?.toLowerCase();
  const verified = !!supaUser.email_confirmed_at;   // true once the email link was clicked / Google email
  const meta = supaUser.user_metadata ?? {};         // name, phone, avatar saved at sign-up

  // 1) Returning user: Mongo record already linked to this Supabase id
  let user = await User.findOne({ supabaseId: supaUser.id });
  if (user) return user;

  // 2) Old customer with the same VERIFIED email: link the existing record
  if (email && verified) {
    user = await User.findOne({ email });
    if (user) {
      user.supabaseId = supaUser.id;
      if (!user.avatar && meta.avatar_url) user.avatar = meta.avatar_url;
      if (!user.phone && meta.phone) user.phone = meta.phone;
      await user.save();
      return user;
    }
  }

  // 3) Brand-new shopper: create the Mongo record
  return User.create({
    supabaseId: supaUser.id,
    email,
    name: meta.full_name || meta.name || email?.split("@")[0] || "Shopper",
    phone: meta.phone,
    avatar: meta.avatar_url,
  });
}
const register = async (req, res) => {
  try {
    const name = typeof req.body?.name === "string" ? req.body.name.trim().slice(0, 80) : "";
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    const phoneE164 = normalizePhone(req.body?.phone);
    // User model stores a 10-digit Indian mobile; normalizePhone returns E.164 (+91…)
    const phone = phoneE164 ? phoneE164.replace(/\D/g, "").slice(-10) : null;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "Name, email password and phone are required" });
    }
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }
    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({ message: "Password must be 8-72 characters" });
    }

    // Create unconfirmed user via admin API so Supabase does not send its own email
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: { full_name: name, phone: phoneE164 || phone },
    });

    if (error) {
      if (error.status === 429) {
        return res.status(429).json({ message: "Too many attempts. Please try again shortly." });
      }
      if (error.code === "weak_password") {
        return res.status(400).json({ message: "That password is too weak. Try a longer one." });
      }
      // Existing email: answer exactly like a success so nobody can probe which emails are registered
      if (
        error.code === "user_already_exists" ||
        error.code === "email_exists" ||
        /already (been )?registered|already exists/i.test(error.message || "")
      ) {
        return res.status(201).json({ message: "Check your email to confirm your account." });
      }
      console.error("Register error:", error.status, error.message);
      return res.status(500).json({ message: "Could not create your account" });
    }

    const supabaseUser = data?.user;
    if (!supabaseUser?.id) {
      return res.status(500).json({ message: "Could not create your account" });
    }

    const { rawToken, token_hash, ttl } = createConfirmToken();
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const confirmationUrl = `${frontendUrl}/confirm-email?token_hash=${encodeURIComponent(rawToken)}`;

    let user = await User.findOne({ email });
    if (user) {
      user.supabaseId = supabaseUser.id;
      user.name = name;
      user.phone = phone;
      user.token_hash = token_hash;
      user.ttl = ttl;
      await user.save();
    } else {
      user = await User.create({
        supabaseId: supabaseUser.id,
        email,
        name,
        phone,
        token_hash,
        ttl,
      });
    }

    const emailRes = await sendEmailConfirmation({
      toEmail: email,
      confirmationUrl,
      name,
      minutes: 15,
    });
    if (!emailRes.success) {
      console.error("Register confirmation email failed:", emailRes.error);
      // Account exists; user can request another link later. Still tell them to check email.
    }

    return res.status(201).json({ message: "Check your email to confirm your account." });
  } catch (error) {
    console.error("Register error:", error.message);
    if (error.name === "ValidationError") {
      const first = error.errors && Object.values(error.errors)[0];
      return res.status(400).json({
        message: first?.message || error.message || "Invalid registration details",
      });
    }
    if (error.code === 11000) {
      return res.status(201).json({ message: "Check your email to confirm your account." });
    }
    res.status(500).json({ message: "Server error" });
  }
};


const confirmEmail = async (req, res) => {
  res.set("Cache-Control", "no-store");
  try {
    const rawToken = typeof req.body?.token_hash === "string" ? req.body.token_hash.trim() : "";
    if (!rawToken || rawToken.length < 10 || rawToken.length > 256) {
      return res.status(400).json({ code: "INVALID_TOKEN", message: "This confirmation link is invalid." });
    }

    const token_hash = hashConfirmToken(rawToken);
    const user = await User.findOne({ token_hash });

    if (!user || !user.ttl || user.ttl.getTime() < Date.now()) {
      if (user) {
        user.token_hash = null;
        user.ttl = null;
        await user.save().catch(() => {});
      }
      return res.status(400).json({
        code: "TOKEN_EXPIRED_OR_INVALID",
        message: "This link is invalid or has expired. Please register again.",
      });
    }

    if (!user.supabaseId) {
      return res.status(400).json({
        code: "TOKEN_EXPIRED_OR_INVALID",
        message: "This link is invalid or has expired. Please register again.",
      });
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(user.supabaseId, {
      email_confirm: true,
    });
    if (error) {
      console.error("confirmEmail supabase:", error.message);
      return res.status(500).json({ message: "Could not confirm your email. Please try again." });
    }

    user.token_hash = null;
    user.ttl = null;
    await user.save();

    return res.status(200).json({ success: true, user: publicUser(user) });
  } catch (err) {
    console.error("confirmEmail:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  res.set("Cache-Control", "no-store");
  const startTime = Date.now();
  const MIN_RESPONSE_TIME_MS = 300;

  const ensureMinTiming = async () => {
    const elapsed = Date.now() - startTime;
    if (elapsed < MIN_RESPONSE_TIME_MS) {
      await new Promise((resolve) => setTimeout(resolve, MIN_RESPONSE_TIME_MS - elapsed));
    }
  };

  try {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";

    if (!email || !password) {
      await ensureMinTiming();
      return res.status(400).json({ message: "Email and password are required" });
    }
    if (!EMAIL_RE.test(email) || password.length > 72) {
      // Perform a dummy password hash to consume comparable CPU time as password verification
      // and prevent early-rejection timing discrepancies between format vs auth failures
      await bcrypt.hash(password || "dummy-timing-password", 10).catch(() => {});
      await ensureMinTiming();
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const supabase = createClient(req, res);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password }); // sets the session cookies
    if (error) {
      if (error.status === 429) {
        await ensureMinTiming();
        return res.status(429).json({ message: "Too many attempts. Please try again shortly." });
      }
      if (error.code === "email_not_confirmed") {
        await ensureMinTiming();
        return res.status(401).json({ code: "EMAIL_NOT_CONFIRMED", message: "Please confirm your email first." });
      }
      if (error.status >= 500) {
        await ensureMinTiming();
        return res.status(502).json({ message: "Login service unavailable. Please try again." });
      }
      await ensureMinTiming();
      return res.status(401).json({ message: "Invalid credentials" }); // wrong password or unknown email
    }

    await syncShopper(data.user);
    await ensureMinTiming();

    res.json({
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
      },
      // no token in the body: the session lives in the httpOnly cookies
    });
  } catch (error) {
    console.error("Login error:", error.message);
    await ensureMinTiming();
    res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  res.set("Cache-Control", "no-store");
  try {
    const email = typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }

    const user = await User.findOne({ email });
    if (user?.supabaseId) {
      const { rawToken, ...tokenData } = createPasswordResetToken();
      user.passwordResetTokenHash = tokenData.passwordResetTokenHash;
      user.passwordResetExpiresAt = tokenData.passwordResetExpiresAt;
      await user.save();

      const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "");
      const resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;
      const emailResult = await sendCustomerPasswordResetEmail({
        toEmail: user.email,
        resetUrl,
      });

      if (!emailResult.success) {
        user.passwordResetTokenHash = null;
        user.passwordResetExpiresAt = null;
        await user.save();
        console.error("Password reset email dispatch failed:", emailResult.error);
      }
    }

    return res.status(200).json({
      message: "If an account exists for that email, password reset instructions will be sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error.message);
    return res.status(500).json({ message: "Unable to process the password reset request." });
  }
};

const validatePasswordResetToken = async (req, res) => {
  res.set("Cache-Control", "no-store");
  const token = typeof req.query.token === "string" ? req.query.token : "";
  if (!token || token.length > 256) {
    return res.status(400).json({ valid: false, message: "This password reset link is invalid or expired." });
  }

  try {
    const passwordResetTokenHash = hashConfirmToken(token);
    const user = await User.findOne({
      passwordResetTokenHash,
      passwordResetExpiresAt: { $gt: new Date() },
    }).select("_id");

    if (!user) {
      return res.status(400).json({ valid: false, message: "This password reset link is invalid or expired." });
    }
    return res.status(200).json({ valid: true });
  } catch (error) {
    console.error("Password reset token validation error:", error.message);
    return res.status(500).json({ message: "Unable to validate this password reset link." });
  }
};

const changePassword = async (req, res) => {
  res.set("Cache-Control", "no-store");
  const token = typeof req.body?.token === "string" ? req.body.token : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (!token || token.length > 256) {
    return res.status(400).json({ message: "This password reset link is invalid or expired." });
  }
  if (password.length < 8 || password.length > 72) {
    return res.status(400).json({ message: "Password must be 8-72 characters." });
  }

  try {
    const passwordResetTokenHash = hashConfirmToken(token);
    const user = await User.findOneAndUpdate(
      {
        passwordResetTokenHash,
        passwordResetExpiresAt: { $gt: new Date() },
      },
      {
        $unset: {
          passwordResetTokenHash: "",
          passwordResetExpiresAt: "",
        },
      },
      { new: true }
    ).select("supabaseId");

    if (!user) {
      return res.status(400).json({ message: "This password reset link is invalid or expired." });
    }
    if (!user.supabaseId) {
      console.error(`Password reset user ${user._id} has no Supabase account link.`);
      return res.status(400).json({ message: "Unable to reset this account password. Please contact support." });
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(user.supabaseId, { password });
    if (error) {
      console.error("Supabase password update failed:", error.message);
      return res.status(502).json({ message: "Unable to update your password. Request a new reset link and try again." });
    }

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Change password error:", error.message);
    return res.status(500).json({ message: "Unable to update your password." });
  }
};

const userSession = async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");
    // Check Supabase session first
    const supabase = createClient(req, res);
    const { data } = await supabase.auth.getUser();
    const sbUser = data?.user;
    if (sbUser) {
      return res.status(200).json({
        user: {
          id: sbUser.id,
          name: sbUser.user_metadata?.name || sbUser.email?.split("@")[0] || "User",
          email: sbUser.email,
        }
      });
    }

    // Check Bearer JWT token or cookie
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : (req.cookies?.token || req.cookies?.nursery_user_token);

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_nursery_secret_key_2026");
        if (decoded?.id) {
          const dbUser = await User.findById(decoded.id).select("-password");
          if (dbUser) {
            return res.status(200).json({
              user: {
                id: dbUser._id,
                name: dbUser.name,
                email: dbUser.email,
              }
            });
          }
        }
      } catch (_) {
        // Expired or invalid token: fall through
      }
    }

    return res.status(200).json({ status: "unauthenticated", user: null });
  } catch (err) {
    return res.status(200).json({ status: "unauthenticated", user: null });
  }
};


const me = async (req, res) => {
  try {
    const userId = req.user && req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(userId).select("-password -token -token_hash -ttl -passwordResetTokenHash -passwordResetExpiresAt");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Me error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
const logout = async (req, res) => {
  res.set("Cache-Control", "no-store");
  try {
    const supabase = createClient(req, res);

    // "local" = log out this browser only. The default ("global") would also log the
    // user out of every other device and browser.
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) console.error("Logout:", error.status, error.message); // e.g. session already expired
  } catch (error) {
    console.error("Logout error:", error.message);
  }

  // Belt and braces: remove any leftover Supabase cookies, plus your old JWT cookie
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  };
  for (const name of Object.keys(req.cookies ?? {})) {
    if (name === "token" || (name.startsWith("sb-") && name.includes("auth-token"))) {
      res.clearCookie(name, cookieOptions);
    }
  }

  // Always succeed: if the session was already gone, the user is logged out either way
  res.json({ message: "Logged out successfully" });
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user && req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { name, phone, gender, dateOfBirth, address } = req.body;

    if (name !== undefined && (!name || name.trim() === "")) {
      return res.status(400).json({ message: "Name is required" });
    }

    const cleanPhone = phone && phone.trim() !== "" ? phone.trim() : null;
    const cleanGender = gender && gender.trim() !== "" ? gender.trim() : null;
    const cleanDob = dateOfBirth && dateOfBirth.trim() !== "" ? dateOfBirth.trim() : null;

    if (cleanPhone && !/^\d{10}$/.test(cleanPhone)) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
    }

    if (cleanGender && !['Male', 'Female', 'Other'].includes(cleanGender)) {
      return res.status(400).json({ message: "Gender must be Male, Female, or Other" });
    }

    const addressObj = address ? {
      street: typeof address.street === 'string' ? address.street.trim() : '',
      city: typeof address.city === 'string' ? address.city.trim() : '',
      state: typeof address.state === 'string' ? address.state.trim() : '',
      postalCode: typeof address.postalCode === 'string' ? address.postalCode.trim() : '',
      country: typeof address.country === 'string' ? address.country.trim() : '',
    } : undefined;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name.trim();
    updateFields.phone = cleanPhone;
    updateFields.gender = cleanGender;
    updateFields.dateOfBirth = cleanDob;
    if (addressObj) {
      updateFields.address = addressObj;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { returnDocument: 'after', runValidators: true }
    ).select("-password -token -token_hash -ttl -passwordResetTokenHash -passwordResetExpiresAt");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  validatePasswordResetToken,
  changePassword,
  me,
  logout,
  updateProfile,
  confirmEmail,
  userSession
};
