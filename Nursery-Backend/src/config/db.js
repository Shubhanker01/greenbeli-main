const mongoose = require("mongoose");

// const connectDb = async () => {
//   try {
//     const uri = process.env.MONGO_URI;

//     if (!uri) {
//       throw new Error("MONGO_URI is not defined in environment variables");
//     }

//     // Mongoose will buffer commands until connected; we prefer to connect at startup.
//     await mongoose.connect(uri, {
//       dbName: process.env.MONGO_DB_NAME || undefined,
//       serverSelectionTimeoutMS: 15000,
//     });

//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.error("MongoDB connection error:", error?.message || error);
//     process.exit(1);
//   }
// };



const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");

const seedInitialAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const defaultEmail = "admin@greenbeli.in";
      const defaultPass = "Admin@1612";
      const hash = await bcrypt.hash(defaultPass, 10);
      await Admin.create({
        name: "Super Admin",
        email: defaultEmail,
        password: hash,
        role: "superadmin"
      });
      console.log(`[Database Seed] Default Admin created successfully! (Email: ${defaultEmail})`);
    }
  } catch (err) {
    console.error("[Database Seed Error]", err.message);
  }
};

const connectDb = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://mongo:27017/nursery";
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');
        await seedInitialAdmin();
    } catch (error) {
        console.log("MongoDB connection failed:", error?.message || error);
    }
}

module.exports = { connectDb };

