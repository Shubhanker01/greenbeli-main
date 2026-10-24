const path = require("path");
const express = require("express");
const cors = require("cors");
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
const app = express();
const port = process.env.PORT || 5007;

const envOrigins = process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',').map(s => s.trim()) : [];

const allowedOrigins = Array.from(new Set([
  'https://greenbeli.in',
  'https://www.greenbeli.in',
  'https://admin.greenbeli.in',
  'https://api.greenbeli.in',
  'http://greenbeli.in',
  'http://www.greenbeli.in',
  'http://admin.greenbeli.in',
  'http://api.greenbeli.in',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  ...envOrigins
]));

const corsMiddleware = cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.greenbeli.in') || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy check failed'), false);
  },
  credentials: true
});

app.use(corsMiddleware);
app.options("*", corsMiddleware);
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
app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use(errorHandler);

// async function start() {
//   await connectDb();


// start().catch((err) => {
//   console.error("Fatal startup error:", err?.message || err);
//   process.exit(1);
// });

app.use((req, res) => {
  console.log("Route hit:", req.originalUrl);
  res.status(404).json({ message: "Not found" });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
