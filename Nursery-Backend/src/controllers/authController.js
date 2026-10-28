const { crypto } = require("node:crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { createClient } = require("../config/supabase.js");
const { normalizePhone } = require("../utils/normalizePhone.js");
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
const CONFIRM_TYPES = new Set(["email", "recovery", "magiclink", "email_change"]);

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email });


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
    const phone = normalizePhone(req.body?.phone);
    const supabase = createClient(req, res);

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "Name, email password and phone are required" });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }
    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({ message: "Password must be 8-72 characters" });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, phone }, // stored in Supabase, copied to Mongo on first login
        emailRedirectTo: `${process.env.FRONTEND_URL}/login?confirmed=1`,
      },
    });

    if (error) {
      if (error.status === 429) {
        return res.status(429).json({ message: "Too many attempts. Please try again shortly." });
      }
      if (error.code === "weak_password") {
        return res.status(400).json({ message: "That password is too weak. Try a longer one." });
      }
      // Existing email: answer exactly like a success so nobody can probe which emails are registered
      if (error.code === "user_already_exists") {
        return res.status(201).json({ message: "Check your email to confirm your account." });
      }
      console.error("Register error:", error.status, error.message);
      return res.status(500).json({ message: "Could not create your account" });
    }

    // Email confirmation OFF: Supabase already logged the user in (cookies are set)
    if (data.session && data.user) {
      const user = await syncShopper(data.user);
      return res.status(201).json({
        user: { id: user._id, name: user.name, email: user.email },
      });
    }

    // Email confirmation ON (recommended): no session until they click the link
    return res.status(201).json({ message: "Check your email to confirm your account." });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


const confirmEmail = async (req, res) => {
  res.set("Cache-Control", "no-store");
  try {
    const { token_hash, type } = req.body ?? {};
    console.log(token_hash);
    if (typeof token_hash !== "string" || token_hash.length < 10 || token_hash.length > 256 || !CONFIRM_TYPES.has(type)) {
      return res.status(400).json({ code: "INVALID_TOKEN", message: "This confirmation link is invalid." });
    }

    const supabase = createClient(req, res);
    const { data, error } = await supabase.auth.verifyOtp({ token_hash, type }); // checks token + expiry, sets cookies
    console.log(data)
    if (error || !data?.user) {
      // Expired, already used, or wrong: Supabase doesn't distinguish them reliably, so one message for all
      return res.status(400).json({
        code: "TOKEN_EXPIRED_OR_INVALID",
        message: "This link is invalid or has expired. Please register again.",
      });
    }

    const user = await syncShopper(data.user); // email is verified now, so create the Mongo record
    return res.status(200).json({ success: true, user: publicUser(user) });
  } catch (err) {
    console.error("confirmEmail:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  res.set("Cache-Control", "no-store");
  try {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    if (!EMAIL_RE.test(email) || password.length > 72) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const supabase = createClient(req, res);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password }); // sets the session cookies
    console.log(data)
    if (error) {
      if (error.status === 429) {
        return res.status(429).json({ message: "Too many attempts. Please try again shortly." });
      }
      if (error.code === "email_not_confirmed") {
        return res.status(401).json({ code: "EMAIL_NOT_CONFIRMED", message: "Please confirm your email first." });
      }
      if (error.status >= 500) {
        return res.status(502).json({ message: "Login service unavailable. Please try again." });
      }
      return res.status(401).json({ message: "Invalid credentials" }); // wrong password or unknown email
    }

    const user = await syncShopper(data.user); // find, link or create the MongoDB user

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      // no token in the body: the session lives in the httpOnly cookies
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const me = async (req, res) => {
  try {
    const userId = req.user && req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Me error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
const getAllusers = async (req, res) => {
  try {
    const users = await User.find(); // 👈 await lagana zaruri hai
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const logout = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
    .json({ message: "Logged out successfully" });
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
      { new: true, runValidators: true }
    ).select("-password");

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
  me,
  getAllusers,
  logout,
  updateProfile,
  confirmEmail
};


