require("dotenv").config();

const { BrevoClient } = require("@getbrevo/brevo");

const apiKey = process.env.BREVO_API_KEY;
const senderEmail = process.env.BREVO_FROM_EMAIL;
const senderName = process.env.BREVO_FROM_NAME || "GreenBeli";

const brevo = new BrevoClient({
  apiKey: apiKey,
});

const isEmailConfigured = Boolean(apiKey && senderEmail);

const sender = {
  name: senderName,
  email: senderEmail,
};

const fromEmail = senderEmail
  ? `"${senderName.replace(/"/g, "")}" <${senderEmail}>`
  : undefined;

module.exports = {
  brevo,
  sender,
  senderEmail,
  senderName,
  fromEmail,
  isEmailConfigured,
};
