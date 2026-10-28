const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const { createClient } = require("../config/supabase");

const requireAuth = async (req, res, next) => {
  try {
    res.set("Cache-Control", "no-store");
    const supabase = createClient(req, res);

    // getUser() validates the token with Supabase. Don't trust getSession() on the server.
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;
    if (error || !user) return res.status(401).json({ success: false, code: "UNAUTHENTICATED" });

    // Admin role. Use app_metadata (only settable by service role),
    // NEVER user_metadata, which users can edit themselves.
    if (user.app_metadata?.role !== "admin") {
      return res.status(403).json({ success: false, code: "FORBIDDEN" });
    }

    // MFA: the session must have been upgraded by a verified TOTP code
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal?.currentLevel !== "aal2") {
      return res.status(403).json({
        success: false,
        code: aal?.nextLevel === "aal2" ? "MFA_REQUIRED" : "MFA_ENROLL_REQUIRED",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("requireAdmin:", err?.message);
    res.status(500).json({ success: false, code: "SERVER_ERROR" });
  }
};


const requireUser = async (req, res, next) => {
  try {
    res.set("Cache-Control", "no-store");
    const supabase = createClient(req, res);

    // getUser() validates the token with Supabase. Don't trust getSession() on the server.
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;
    if (error || !user) return res.status(401).json({ success: false, code: "UNAUTHENTICATED" });
    req.user = user;
    next();
  }
  catch (err) {
    res.status(500).json({ success: false, code: "SERVER_ERROR" })
  }
}

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    const tokenFromCookie = req.cookies && req.cookies.token;

    const token = tokenFromHeader || tokenFromCookie;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const decoded = jwt.verify(token, secret);

    req.user = {
      id: decoded.id,
      type: decoded.type || "user",
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = await Admin.findById(decoded.id).select("-password");

    if (!req.admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};

// 🔥 Role Middleware
const isSuperAdmin = (req, res, next) => {
  if (req.admin.role !== "superadmin") {
    return res.status(403).json({ message: "Super Admin only" });
  }
  next();
};


module.exports = { authMiddleware, protect, isSuperAdmin, requireAuth,requireUser };

