const User = require("../models/User");
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
    const supabaseUser = data?.user;
    if (error || !supabaseUser) return res.status(401).json({ success: false, code: "UNAUTHENTICATED" });

    let user = await User.findOne({ supabaseId: supabaseUser.id });
    if (!user && supabaseUser.email) {
      user = await User.findOne({ email: supabaseUser.email.toLowerCase() });
      if (user) {
        user.supabaseId = supabaseUser.id;
        await user.save();
      }
    }
    if (!user) {
      return res.status(404).json({ success: false, code: "USER_NOT_FOUND" });
    }

    req.user = { ...supabaseUser, id: user._id };
    next();
  }
  catch (err) {
    console.error("requireUser:", err?.message);
    res.status(500).json({ success: false, code: "SERVER_ERROR" });
  }
}

module.exports = { requireAuth, requireUser };
