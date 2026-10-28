// Accepts "9876543210", "+91 98765 43210", "098765-43210"; stores as +919876543210
function normalizePhone(value) {
    if (typeof value !== "string") return null;
    let digits = value.replace(/[\s()-]/g, "");
    if (/^(0|91)?[6-9]\d{9}$/.test(digits)) digits = "+91" + digits.slice(-10); // Indian mobile
    else if (!/^\+[1-9]\d{9,14}$/.test(digits)) return null;                      // other countries: E.164
    return digits;
}

module.exports = {
    normalizePhone
}