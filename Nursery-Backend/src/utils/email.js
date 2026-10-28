const { Resend } = require("resend");
require('dotenv').config();

const fromEmail = process.env.RESEND_FROM_EMAIL;
const { transporter } = require("../config/transporter")
const resendApiKey = process.env.RESEND_API_KEY;

const resend = new Resend(resendApiKey);
const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// async function sendPasswordResetEmail({ toEmail, resetUrl }) {
//     if (!resend) return { success: false, error: 'Resend not configured' };

//     try {
//         const { data, error } = await resend.emails.send({
//             from: `Greenbeli Security <${fromEmail}>`,
//             to: [toEmail || ADMIN_EMAIL],
//             subject: '🔒 Emergency Admin Password Reset Request',
//             html: `
//                 <div style="font-family: sans-serif; max-width: 540px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px;">
//                     <h2 style="color: #0f172a; margin-top: 0;">Emergency Password Reset</h2>
//                     <p style="color: #475569; font-size: 14px; line-height: 1.5;">
//                         We received a request to reset the administrator password for <strong>${toEmail}</strong>.
//                     </p>
//                     <p style="color: #475569; font-size: 14px; line-height: 1.5;">
//                         Click the button below to set a new password. This link is cryptographically protected and will expire in <strong>15 minutes</strong>:
//                     </p>
//                     <div style="text-align: center; margin: 28px 0;">
//                         <a href="${resetUrl}" style="background: #facc15; color: #0f172a; font-weight: 700; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px;">
//                             Reset Password & Unlock Account
//                         </a>
//                     </div>
//                     <p style="color: #94a3b8; font-size: 12px; line-height: 1.4;">
//                         If you did not request this, please ignore this email. Your password will remain unchanged.
//                     </p>
//                 </div>
//             `,
//         });
//         return { success: !error, data, error };
//     } catch (err) {
//         return { success: false, error: err.message };
//     }
// }

async function sendPasswordResetEmail({ toEmail, resetUrl }) {
    try {
        const info = await transporter.sendMail({
            from: fromEmail, // sender address
            to: toEmail, // list of recipients
            subject: "Reset Password", // subject line
            text: "reset password", // plain text body
            html:
                `
                 <div style="font-family: sans-serif; max-width: 540px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px;">
                     <h2 style="color: #0f172a; margin-top: 0;">Emergency Password Reset</h2>
                    <p style="color: #475569; font-size: 14px; line-height: 1.5;">
                        We received a request to reset the administrator password for <strong>${toEmail}</strong>.
                  </p>
                    <p style="color: #475569; font-size: 14px; line-height: 1.5;">
                        Click the button below to set a new password. This link is cryptographically protected and will expire in <strong>15 minutes</strong>:
                  </p>
                   <div style="text-align: center; margin: 28px 0;">
                        <a href="${resetUrl}" style="background: #facc15; color: #0f172a; font-weight: 700; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px;">
                            Reset Password & Unlock Account
                         </a>
                     </div>
                   <p style="color: #94a3b8; font-size: 12px; line-height: 1.4;">
                        If you did not request this, please ignore this email. Your password will remain unchanged.
                     </p>
                 </div>             `, // HTML body
        });

        console.log("Message sent: %s", info.messageId);

    } catch (err) {
        console.error("Error while sending mail:", err);
    }
}

async function sendEmergencyOtpEmail({ toEmail, otp }) {
    if (!transporter) return { success: false, error: 'Transporter not configured' };

    try {
        const info = await transporter.sendMail({
            from: fromEmail,
            to: [toEmail || ADMIN_EMAIL],
            subject: 'Your Emergency MFA Reset Verification Code',
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                    <div style="background: #0f172a; padding: 20px; text-align: center; border-bottom: 4px solid #facc15;">
                        <h2 style="color: #ffffff; margin: 0; font-size: 18px;">
                            GreenBeli<span style="color: #facc15;">Security</span>Desk
                        </h2>
                    </div>
                    <div style="padding: 24px;">
                        <h3 style="color: #0f172a; margin-top: 0;">Emergency MFA Recovery Code</h3>
                        <p style="color: #475569; font-size: 14px; line-height: 1.5;">
                            An emergency request was submitted to reset the Two-Factor Authenticator (TOTP) for <strong>${toEmail}</strong>.
                        </p>
                        <p style="color: #475569; font-size: 14px;">
                            Please enter this 6-digit one-time verification code on the recovery screen:
                        </p>
                        <div style="text-align: center; margin: 24px 0;">
                            <span style="display: inline-block; background: #fefce8; border: 2px dashed #ca8a04; color: #854d0e; font-size: 32px; font-weight: 800; letter-spacing: 6px; padding: 12px 28px; border-radius: 8px; font-family: monospace;">
                                ${otp}
                            </span>
                        </div>
                        <p style="color: #64748b; font-size: 12px; text-align: center;">
                            ⏱️ This code is valid for <strong>10 minutes</strong>. Do NOT share this code with anyone.
                        </p>
                    </div>
                    <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 12px; text-align: center; font-size: 11px; color: #94a3b8;">
                        If you did not initiate this recovery request, please change your password immediately.
                    </div>
                </div>
            `,
        });
        return { success: true };
    } catch (err) {
        console.error('Error dispatching MFA OTP email:', err);
        return { success: false, error: err.message };
    }
}

async function sendEmailConfirmation({ toEmail, confirmationUrl, name = "there", minutes = 15 }) {
    if (!transporter) return { success: false, error: "Transporter not configured" };

    const safeUrl = esc(confirmationUrl);
    try {
        await transporter.sendMail({
            from: fromEmail,
            to: toEmail,
            subject: "Confirm your email: GreenBeli Gardeniya",
            text: `Hi ${name},\n\nConfirm your email by opening this link (valid for ${minutes} minutes):\n${confirmationUrl}\n\nIf you didn't sign up, ignore this email.`,
            html: `
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:540px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
              <div style="background:#1f4a34;padding:20px;text-align:center;border-bottom:4px solid #facc15;">
                <h2 style="color:#ffffff;margin:0;font-size:18px;">GreenBeli <span style="color:#facc15;">Gardeniya</span></h2>
              </div>
              <div style="padding:24px;">
                <h3 style="color:#0f172a;margin-top:0;">Confirm your email</h3>
                <p style="color:#475569;font-size:14px;line-height:1.5;">
                  Hi ${esc(name)}, thanks for signing up. Please confirm that <strong>${esc(toEmail)}</strong> is your email address.
                  This link is valid for <strong>${minutes} minutes</strong>.
                </p>
                <div style="text-align:center;margin:28px 0;">
                  <a href="${safeUrl}" style="background:#facc15;color:#0f172a;font-weight:700;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;display:inline-block;">Confirm Email</a>
                </div>
                <p style="color:#94a3b8;font-size:12px;line-height:1.5;">
                  If the button doesn't work, copy this link into your browser:<br>${safeUrl}<br><br>
                  If you didn't create an account, you can ignore this email.
                </p>
              </div>
            </div>`,
        });
        return { success: true };
    } catch (err) {
        console.error("Error sending email:", err.message);
        return { success: false, error: err.message };
    }
}

module.exports = {
    sendPasswordResetEmail,
    sendEmergencyOtpEmail,
    sendEmailConfirmation
}

