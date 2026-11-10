require("dotenv").config();

const nodemailer = require("nodemailer");

const host = process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com";
const port = Number(process.env.BREVO_SMTP_PORT || 587);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("BREVO_SMTP_PORT must be a valid TCP port");
}
const smtpUser = process.env.BREVO_SMTP_USER;
const smtpKey = process.env.BREVO_SMTP_KEY;
const senderEmail = process.env.BREVO_FROM_EMAIL;
const senderName = process.env.BREVO_FROM_NAME || "GreenBeli";

const isEmailConfigured = Boolean(
  smtpUser && smtpKey && senderEmail
);
const fromEmail = senderEmail
  ? `"${senderName.replace(/"/g, "")}" <${senderEmail}>`
  : undefined;

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: {
    user: smtpUser,
    pass: smtpKey,
  },
});

module.exports = {
  transporter,
  fromEmail,
  isEmailConfigured,
};
