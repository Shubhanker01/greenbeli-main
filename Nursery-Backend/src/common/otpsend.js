const { brevo, sender, isEmailConfigured } = require('../config/transporter');

// Common function to send emails
const sendEmail = async (to, subject, text, html = null) => {
    try {
        if (!isEmailConfigured) {
            throw new Error("Brevo API is not configured");
        }

        // ✅ ensure valid recipients
        if (!to || (Array.isArray(to) && to.length === 0)) {
            throw new Error("No recipients provided");
        }

        const recipients = (Array.isArray(to) ? to : [to]).map((email) => ({ email }));

        const response = await brevo.transactionalEmails.sendTransacEmail({
            sender,
            to: recipients,
            subject,
            textContent: text,
            htmlContent: html || text,
        });

        console.log('Email sent successfully:', response.messageId || (response.messageIds && response.messageIds[0]));
        return response;

    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// Example usage
module.exports = sendEmail;
