const Setting = require("../models/setting");
const asyncHandler = require("../utils/asyncHandler");

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

// Only these three fields can ever be changed through the API (anything else in the body is ignored)
const FIELDS = ["storeName", "supportPhone", "supportEmail", "address"];

const toResponse = (doc) => ({
    storeName: doc.storeName,
    supportPhone: doc.supportPhone,
    supportEmail: doc.supportEmail,
    address: doc.address,
    updatedAt: doc.updatedAt,
});

/** Checks the fields that were sent. Returns { values, errors }. */
function validate(body) {
    const values = {};
    const errors = {};
    const input = body && typeof body === "object" && !Array.isArray(body) ? body : {};

    for (const field of FIELDS) {
        if (input[field] === undefined) continue; // not sent: leave unchanged

        if (typeof input[field] !== "string") {
            errors[field] = "Must be text.";
            continue;
        }
        const value = input[field].trim();

        if (field === "storeName") {
            if (!value) errors[field] = "Store name is required.";
            else if (value.length > 80) errors[field] = "Store name must be 80 characters or fewer.";
            else values[field] = value;
        }

        if (field === "supportPhone") {
            const digits = value.replace(/\D/g, "");
            if (!value) errors[field] = "Helpline phone is required.";
            else if (!/^[+\d\s()-]+$/.test(value) || digits.length < 10 || digits.length > 15) {
                errors[field] = "Enter a valid phone number (10-15 digits).";
            } else values[field] = value;
        }

        if (field === "supportEmail") {
            if (!value) errors[field] = "Support email is required.";
            else if (!EMAIL_RE.test(value)) errors[field] = "Enter a valid email address.";
            else values[field] = value.toLowerCase();
        }

        if (field === 'address') {
            if (!value) errors[field] = "Address is required";
            else values[field] = value;
        }
    }

    return { values, errors };
}

// GET /api/settings
const getSettings = asyncHandler(async (_req, res) => {
    const settings = await Setting.getStore();
    res.set("Cache-Control", "no-store");
    res.json({ success: true, data: toResponse(settings) });
});

// PUT /api/admin/settings   (admin only)
const updateSettings = asyncHandler(async (req, res) => {
    const { values, errors } = validate(req.body);

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, message: "Please fix the highlighted fields.", errors });
    }
    if (Object.keys(values).length === 0) {
        return res.status(400).json({ success: false, message: "Nothing to update." });
    }

    const settings = await Setting.updateStore(values, req.user?.id ?? null);
    res.set("Cache-Control", "no-store");
    res.json({ success: true, message: "Settings updated successfully.", data: toResponse(settings) });
});

module.exports = { getSettings, updateSettings };