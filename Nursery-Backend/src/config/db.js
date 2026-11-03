const mongoose = require("mongoose");
const dns = require("node:dns");

// Fix for Windows & ISP local DNS servers that fail/refuse MongoDB SRV queries (querySrv ECONNREFUSED)
try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (err) {
    console.warn("Could not set custom DNS servers:", err?.message || err);
}

const connectDb = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://mongo:27017/nursery";
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error("MongoDB connection failed:", error?.message || error);
        console.error("If this is querySrv ECONNREFUSED, check your network/DNS settings or ensure your IP is whitelisted in MongoDB Atlas (Network Access -> Add IP Address -> 0.0.0.0/0 for testing).");
    }
}

module.exports = { connectDb };

