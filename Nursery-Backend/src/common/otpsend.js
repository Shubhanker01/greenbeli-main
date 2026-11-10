const { transporter, fromEmail, isEmailConfigured } = require('../config/transporter');

// Common function to send emails
const sendEmail = async (to, subject, text, html = null) => {
    try {
        if (!isEmailConfigured) {
            throw new Error("Brevo SMTP is not configured");
        }

        // ✅ ensure valid recipients
        if (!to || (Array.isArray(to) && to.length === 0)) {
            throw new Error("No recipients provided");
        }

        const mailOptions = {
            from: fromEmail,
            to: Array.isArray(to) ? to.join(',') : to, // ✅ fix here
            subject,
            text,
            html: html || text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return info;

    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// Example usage
module.exports = sendEmail;
