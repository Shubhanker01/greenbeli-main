const nodemailer = require("nodemailer");
// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_NAME,
        pass: process.env.SMTP_PASSWORD,
    },
});

module.exports = {
    transporter
}