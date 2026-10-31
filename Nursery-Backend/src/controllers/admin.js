require('dotenv').config();
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const { createClient } = require('../config/supabase');
const AuthSecurityTracker = require('../models/authSecurityTracker');
const { sendPasswordResetEmail } = require("../utils/email");
const { supabaseAdmin } = require("../config/admin");
const AUTH_COOKIE = /^(sb-[^.]+-auth-token)(?:\.(\d+))?$/; 
const SUPABASE_COOKIE = /^sb-.+-(auth-token(\.\d+)?|code-verifier)$/;
 
const safeDecode = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};
 
// Reads req.cookies (cookie-parser) or, without it, the raw Cookie header
function readCookies(req) {
  if (req.cookies && typeof req.cookies === "object") return req.cookies;
  const out = {};
  for (const part of String(req.headers?.cookie || "").split(";")) {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  }
  return out;
}
 

function getAccessToken(req) {
  const header = req.headers?.authorization || "";
  if (/^Bearer\s+\S+/i.test(header)) return header.replace(/^Bearer\s+/i, "").trim();
 
  const cookies = readCookies(req);
  const groups = {};
  for (const [name, value] of Object.entries(cookies)) {
    const m = AUTH_COOKIE.exec(name);
    if (m) (groups[m[1]] ||= []).push({ index: Number(m[2] ?? 0), value });
  }
 
  for (const parts of Object.values(groups)) {
    try {
      let raw = parts
        .sort((a, b) => a.index - b.index)
        .map((p) => safeDecode(p.value))
        .join("");
      if (raw.startsWith("base64-")) raw = Buffer.from(raw.slice(7), "base64url").toString("utf8");
      const session = JSON.parse(raw);
      const token = Array.isArray(session) ? session[0] : session?.access_token;
      if (typeof token === "string" && token) return token;
    } catch {
      /* unreadable cookie: try the next one */
    }
  }
  return null;
}
 
// Removes every Supabase auth cookie the browser sent
function clearAuthCookies(req, res) {
  const options = { path: "/" };
  if (process.env.COOKIE_DOMAIN) options.domain = process.env.COOKIE_DOMAIN; // must match how the cookies were set
  for (const name of Object.keys(readCookies(req))) {
    if (SUPABASE_COOKIE.test(name)) res.clearCookie(name, options);
  }
}
 
// POST /api/auth/logout
// Body (optional): { "everywhere": true } signs the user out of ALL their devices
exports.logout = async (req, res) => {
  res.set("Cache-Control", "no-store");
 
  try {
    const token = getAccessToken(req);
    if (token) {
      const scope = req.body?.everywhere === true ? "global" : "local";
      const { error } = await supabaseAdmin.auth.admin.signOut(token, scope); // ends the session on Supabase
      if (error) console.error("Logout: Supabase signOut failed:", error.status, error.message); // e.g. already expired
    }
  } catch (err) {
    console.error("Logout error:", err.message);
  }
 
  // Always clear the browser's cookies and answer OK: the user must end up logged out either way
  clearAuthCookies(req, res);
  res.json({ success: true, message: "Logged out successfully" });
};
 

// GET /api/admin/session  (NOT behind requireAdmin)
const adminSession = async (req, res) => {
  res.set("Cache-Control", "no-store");
  const supabase = createClient(req, res);
  const { data } = await supabase.auth.getUser();
  const user = data?.user;
  if (!user) return res.json({ status: "unauthenticated" });
  console.log(user.app_metadata.role)
  if (user.app_metadata?.role !== "admin") return res.json({ status: "forbidden" });

  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal?.currentLevel === "aal2") return res.json({ status: "ok", email: user.email });
  return res.json({ status: aal?.nextLevel === "aal2" ? "mfa_required" : "mfa_enroll" });
}


const generateToken = (id, role) => {
  return jwt.sign(
    { id: String(id), role, type: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};
// jjjjj
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};
    console.log(req.body);
    const emailNorm = email ? String(email).toLowerCase().trim() : "";

    if (!name || !emailNorm || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const exists = await Admin.findOne({ email: emailNorm });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    // Only superadmin (when using protected route) can set admin role.
    // Public /register bootstrap defaults to "admin" unless no admins exist in system.
    const totalAdmins = await Admin.countDocuments();
    const canSetRole = (req.admin && req.admin.role === "superadmin") || totalAdmins === 0;
    const normalizedRole = role ? String(role).trim().toLowerCase() : "admin";
    const roleToSet =
      canSetRole && ["admin", "superadmin"].includes(normalizedRole)
        ? normalizedRole
        : (totalAdmins === 0 ? "superadmin" : "admin");

    const admin = await Admin.create({
      name,
      email: emailNorm,
      password: hash,
      role: roleToSet,
    });

    res.status(201).json({
      success: true,
      message: "Admin Registered",
      token: generateToken(admin._id, admin.role),
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* LOGIN */
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const emailNorm = email ? String(email).toLowerCase().trim() : "";

    if (!emailNorm || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    let tracker = await AuthSecurityTracker.findOne({ identifier: emailNorm });

    if (tracker && tracker.isPasswordLocked) {
      return res.status(403).json({
        success: false,
        message: "Account locked due to multiple login failure attempts"
      })
    }
    const supabase = createClient(req, res);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailNorm,
      password: password
    })

    if (error) {
      tracker = await AuthSecurityTracker.findOneAndUpdate(
        { identifier: emailNorm },
        {
          $inc: { passwordFailures: 1 },
          $set: { lastFailedAt: new Date(), updatedAt: new Date() }
        }, {
        upsert: true,
        new: true
      }
      )
      if (tracker.passwordFailures >= 5) {
        tracker.isPasswordLocked = true
        const resetToken = crypto.randomBytes(32).toString('hex')
        tracker.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        tracker.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
        await tracker.save();
        const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
        const targetUser = usersData?.users?.find(u => u.email?.toLowerCase() === email);
        if (targetUser) {
          const randomizedPassword = crypto.randomBytes(24).toString('base64') + '!Z9';
          await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
            password: randomizedPassword,
          });
        }

        const siteUrl = process.env.SITE_URL;
        const resetUrl = `${siteUrl}/admin/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
        console.warn(`[SECURITY ALERT] 5 failed password attempts for ${email}. Account locked. Reset URL: ${resetUrl}`);

        // Dispatch emergency recovery link via Resend
        sendPasswordResetEmail({
          toEmail: email,
          resetUrl,
        }).catch((e) => console.error('Failed to send lockout reset email:', e));

        return res.status(423).json({
          success: false,
          message: "Account locked due to failed attempts. Emergency link has been generated!!!"
        })
      }
      return res.status(401).json({
        success: false,
        message: "Email or password is incorrect"
      })

    }

    if (tracker) {
      await AuthSecurityTracker.findOneAndUpdate({
        identifier: emailNorm
      }, {
        $set: {
          passwordFailures: 0,
          isPasswordLocked: false,
          updatedAt: new Date()
        }
      })
    }

    const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (aalError) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error Occured"
      })
    }
    let nextStep = "done";
    const nextLevel = aalData?.nextLevel;
    if (nextLevel === 'aal1') {
      nextStep = "mfa-setup"
    }
    if (nextLevel === 'aal2') {
      nextStep = "mfa"
    }
    return res.json({
      success: true,
      nextStep
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET ALL ADMINS */
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");

    res.json({
      success: true,
      count: admins.length,
      data: admins,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET SINGLE ADMIN */
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE */
exports.updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (
      String(req.admin._id) !== String(admin._id) &&
      req.admin.role !== "superadmin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    admin.name = req.body.name || admin.name;
    admin.email = req.body.email || admin.email;

    if (req.body.password) {
      admin.password = await bcrypt.hash(req.body.password, 10);
    }

    if (req.admin && req.admin.role === "superadmin" && req.body.role) {
      if (["admin", "superadmin"].includes(req.body.role)) {
        admin.role = req.body.role;
      }
    }

    await admin.save();

    res.json({
      success: true,
      message: "Updated successfully",
      data: admin,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE */
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // 🔥 Only superadmin can delete
    if (req.admin.role !== "superadmin") {
      return res.status(403).json({ message: "Only SuperAdmin can delete" });
    }

    await admin.deleteOne();

    res.json({
      success: true,
      message: "Deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // 🔥 Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 🔐 Hash token (DB me safe)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min

    await admin.save();

    // 🔗 Reset link
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    res.json({
      success: true,
      message: "Reset link generated",
      resetUrl,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { email, token, password } = req.body || {};
    const emailNorm = email ? String(email).toLowerCase().trim() : "";
    if (
      !emailNorm ||
      typeof token !== "string" ||
      !token ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        success: false,
        message: "Email, reset token and a password of at least 8 characters are required",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const tracker = await AuthSecurityTracker.findOne({
      identifier: emailNorm,
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!tracker) {
      return res.status(400).json({
        success: false,
        message: "This password reset link is invalid or has expired. Request a new link.",
      });
    }

    let user;
    for (let page = 1; !user; page += 1) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage: 100,
      });
      if (error) throw error;

      user = data.users.find((candidate) => candidate.email?.toLowerCase() === emailNorm);
      if (user || data.users.length < 100) break;
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This password reset link is invalid or has expired. Request a new link.",
      });
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password,
    });
    if (updateError) throw updateError;

    tracker.passwordFailures = 0;
    tracker.isPasswordLocked = false;
    tracker.passwordResetToken = null;
    tracker.passwordResetExpires = null;
    tracker.updatedAt = new Date();
    await tracker.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.adminSession = adminSession;