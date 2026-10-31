const mongoose = require("mongoose");
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
const isPhone = (value) => /^[+]\d{10,15}$/.test(value);

const DEFAULTS = {
    storeName: "Greenbeli",
    supportPhone: "+919950711475",
    supportEmail: "support@greenbeli.in",
    address: "GreenBeli Gardeniya,Khasra No. 74, Rewari Highway Road, near Gyansagar School, Kotkasim, Alampur, Rajasthan 301702"
}
const settingSchema = new mongoose.Schema(
    {
        key: { type: String, default: "store", unique: true },

        storeName: {
            type: String,
            required: [true, "Store name is required"],
            trim: true,
            maxlength: [80, "Store name must be 80 characters or fewer"],
            default: DEFAULTS.storeName,
        },
        supportPhone: {
            type: String,
            required: [true, "Helpline phone is required"],
            trim: true,
            validate: { validator: isPhone, message: "Enter a valid phone number (10-15 digits)" },
            default: DEFAULTS.supportPhone,
        },
        supportEmail: {
            type: String,
            required: [true, "Support email is required"],
            trim: true,
            lowercase: true,
            match: [EMAIL_RE, "Enter a valid email address"],
            default: DEFAULTS.supportEmail,
        },
        address: {
            type: String,
            required: [true, "address is required"],
            default: DEFAULTS.address
        },

        updatedBy: { type: String, default: null }, // id of the admin who last saved
    },
    { timestamps: true }
);

/** Returns the settings document, creating it with the defaults the first time. */
settingSchema.statics.getStore = function () {
    return this.findOneAndUpdate(
        { key: "store" },
        { $setOnInsert: { key: "store" } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );
};

/** Saves the given fields (creating the document if needed) and returns the updated document. */
settingSchema.statics.updateStore = async function (values, updatedBy = null) {
    const run = () =>
        this.findOneAndUpdate(
            { key: "store" },
            { $set: { ...values, updatedBy } },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );

    try {
        return await run();
    } catch (err) {
        // Two first-ever saves at the same moment can both try to create the document: retry once
        if (err && err.code === 11000) return run();
        throw err;
    }
};

module.exports = mongoose.model("Setting", settingSchema);