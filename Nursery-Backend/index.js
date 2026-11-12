const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const { connectDb } = require("./src/config/db");
const userRoutes = require("./src/routes/authRoutes");
const adminRoutes = require("./src/routes/admin");
const productRoutes = require("./src/routes/productRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const proposalsRoutes = require("./src/routes/proposals");
const leadsRoutes = require("./src/routes/leadsRoutes");

const salesRoutes = require("./src/routes/salesRoutes");
const testimonialRoutes = require("./src/routes/testimonialRoutes");
const errorHandler = require("./src/middleware/errorMiddleware");
const mfaRoutes = require("./src/routes/mfaRoutes");
const customerRoutes = require("./src/routes/customers");
const settingRoutes = require("./src/routes/settingRoutes");
const contentRoutes = require("./src/routes/contentRoutes");
const plantCareRoutes = require("./src/routes/plantCareRoutes");

const app = express();
const port = process.env.PORT || 5007;
const isProd = process.env.NODE_ENV === "production";

// Render sits behind a proxy; needed so Express sees HTTPS and allows `secure` cookies.
app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

const envOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",")
      .map((s) => s.trim().replace(/\/+$/, "")) // strip trailing slashes
      .filter(Boolean)
  : [];

const exactOrigins = new Set([
  "https://greenbeli.in",
  "https://www.greenbeli.in",
  "https://admin.greenbeli.in",
  "https://api.greenbeli.in",
  "https://greenbeli.vercel.app",
  ...envOrigins,
]);

const greenbeliRegex = /^https:\/\/([a-z0-9-]+\.)?greenbeli\.in$/;

// Optional: Vercel preview deployments. Disabled unless VERCEL_TEAM_SLUG is set,
// because a loose pattern lets anyone deploy a matching *.vercel.app site.
// Preview URLs look like: greenbeli-git-<branch>-<team>.vercel.app
const teamSlug = (process.env.VERCEL_TEAM_SLUG || "").replace(/[^a-z0-9-]/gi, "");
const vercelPreviewRegex = teamSlug
  ? new RegExp(`^https://greenbeli-[a-z0-9-]+-${teamSlug}\\.vercel\\.app$`)
  : null;

// Local development only.
const localDevRegex = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (exactOrigins.has(origin)) return true;
  if (greenbeliRegex.test(origin)) return true;
  if (vercelPreviewRegex && vercelPreviewRegex.test(origin)) return true;
  if (!isProd && localDevRegex.test(origin)) return true;
  return false;
}

const corsMiddleware = cors({
  origin(origin, callback) {
    // No Origin header: curl, health checks, server-to-server, mobile apps.
    if (!origin) return callback(null, true);
    // Disallowed origins simply get no CORS headers (browser blocks them).
    return callback(null, isAllowedOrigin(origin));
  },
  credentials: true,
});

// cors() also answers OPTIONS preflights, so a separate app.options("*") is not needed
// (and "*" breaks on Express 5).
app.use(corsMiddleware);


function csrfOriginCheck(req, res, next) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();

  let origin = req.headers.origin;
  if (!origin && req.headers.referer) {
    try {
      origin = new URL(req.headers.referer).origin;
    } catch (_) {
      return res.status(403).json({ message: "Invalid origin" });
    }
  }

  // Neither header present: not a browser cross-site request.
  if (!origin) return next();

  if (!isAllowedOrigin(origin)) {
    return res.status(403).json({ message: "Invalid origin" });
  }
  next();
}

app.use(csrfOriginCheck);

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "public/Uploads")));
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "nursery-backend" });
});

// // Debug: log admin login hits to confirm origin + path.
// app.use("/api/admin/login", (req, _res, next) => {
//   console.log("[admin/login]", req.method, "origin=", req.headers.origin, "ua=", req.headers["user-agent"]);
//   next();
// });
connectDb().catch((err) => {
  console.error("Fatal startup error:", err?.message || err);
  process.exit(1);
});
app.use("/api", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/proposals", proposalsRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/mfa", mfaRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/plant-care-guides", plantCareRoutes);
app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});