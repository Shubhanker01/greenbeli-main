const Setting = require("../src/models/setting");
const mongoose = require("mongoose");
require('dotenv').config();
async function run() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("MONGO_URI missing in .env");
        process.exit(1);
    }
    await mongoose.connect(uri, { dbName: process.env.MONGO_DB_NAME || undefined });
    try {
        const newSettings = await Setting.create({
            key: "store",
            value: {
                storeName: "Greenbeli",
                supportPhone: "+919950711475",
                supportEmail: "support@greenbeli.in",
                address: "GreenBeli Gardeniya,Khasra No. 74, Rewari Highway Road, near Gyansagar School, Kotkasim, Alampur, Rajasthan 301702"
            }
        })
        if (newSettings) {
            console.log("Settings seeded successfully");
        }
    }
    finally {
        mongoose.connection.close();
    }
}

run();