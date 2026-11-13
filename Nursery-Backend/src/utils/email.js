require('dotenv').config();
const { brevo, sender, isEmailConfigured } = require("../config/transporter");

const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

async function sendPasswordResetEmail({ toEmail, resetUrl }) {
    if (!isEmailConfigured) throw new Error("Brevo API is not configured");

    try {
        const response = await brevo.transactionalEmails.sendTransacEmail({
            sender,
            to: [{ email: toEmail }],
            subject: "Reset Password",
            textContent: "reset password",
            htmlContent: `
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
                 </div>             `,
        });

        console.log("Message sent: %s", response.messageId || (response.messageIds && response.messageIds[0]));
        return response;
    } catch (err) {
        console.error("Error while sending mail:", err);
        throw err;
    }
}

async function sendCustomerPasswordResetEmail({ toEmail, resetUrl }) {
    if (!isEmailConfigured) return { success: false, error: "Brevo API is not configured" };

    try {
        await brevo.transactionalEmails.sendTransacEmail({
            sender,
            to: [{ email: toEmail }],
            subject: "Reset your GreenBeli password",
            textContent: `We received a request to reset your GreenBeli password. Open this link within 15 minutes to choose a new password:\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
            htmlContent: `
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:540px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:30px;">
              <h2 style="color:#0f172a;margin-top:0;">Reset your password</h2>
              <p style="color:#475569;font-size:14px;line-height:1.5;">We received a request to reset your GreenBeli password. Use the button below within <strong>15 minutes</strong> to choose a new password.</p>
              <div style="text-align:center;margin:28px 0;">
                <a href="${esc(resetUrl)}" style="background:#166534;color:#ffffff;font-weight:700;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;">Reset Password</a>
              </div>
              <p style="color:#94a3b8;font-size:12px;line-height:1.5;">If you did not request a password reset, you can safely ignore this email.</p>
            </div>`,
        });
        return { success: true };
    } catch (err) {
        console.error("Error sending customer password reset email:", err.message);
        return { success: false, error: err.message };
    }
}

async function sendEmergencyOtpEmail({ toEmail, otp }) {
    if (!isEmailConfigured) return { success: false, error: "Brevo API is not configured" };

    try {
        await brevo.transactionalEmails.sendTransacEmail({
            sender,
            to: [{ email: toEmail }],
            subject: 'Your Emergency MFA Reset Verification Code',
            htmlContent: `
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
    if (!isEmailConfigured) return { success: false, error: "Brevo API is not configured" };

    const safeUrl = esc(confirmationUrl);
    try {
        await brevo.transactionalEmails.sendTransacEmail({
            sender,
            to: [{ email: toEmail, name: name !== "there" ? name : undefined }],
            subject: "Confirm your email: GreenBeli Gardeniya",
            textContent: `Hi ${name},\n\nConfirm your email by opening this link (valid for ${minutes} minutes):\n${confirmationUrl}\n\nIf you didn't sign up, ignore this email.`,
            htmlContent: `
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

async function sendOrderConfirmationEmail({ toEmail, customerName = "there", order }) {
    if (!isEmailConfigured) return { success: false, error: "Brevo API is not configured" };

    const displayName = customerName || "there";
    const safeName = esc(displayName);
    const safeOrderId = esc(order._id);
    const formatPrice = (price) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(price || 0));
    const itemRows = order.orderItems.map((item) => `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;">${esc(item.name)}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:center;">${esc(item.quantity)}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right;">${formatPrice(item.price * item.quantity)}</td>
        </tr>
    `).join("");
    const textItems = order.orderItems
        .map((item) => `${item.name} x ${item.quantity}: ${formatPrice(item.price * item.quantity)}`)
        .join("\n");

    try {
        await brevo.transactionalEmails.sendTransacEmail({
            sender,
            to: [{ email: toEmail, name: displayName !== "there" ? displayName : undefined }],
            subject: `Order confirmation: ${order._id}`,
            textContent: `Hi ${displayName},\n\nThank you for your order!\nOrder ID: ${order._id}\n\n${textItems}\n\nItems: ${formatPrice(order.itemPrice)}\nTax: ${formatPrice(order.taxPrice)}\nShipping: ${formatPrice(order.shippingPrice)}\nTotal: ${formatPrice(order.totalPrice)}\n\nYour order is ${order.orderStatus}.`,
            htmlContent: `
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
              <div style="background:#1f4a34;padding:20px;text-align:center;border-bottom:4px solid #facc15;">
                <h2 style="color:#ffffff;margin:0;">GreenBeli Order Confirmation</h2>
              </div>
              <div style="padding:24px;color:#334155;">
                <h3 style="color:#0f172a;margin-top:0;">Thank you for your order, ${safeName}!</h3>
                <p style="font-size:14px;line-height:1.5;">Order <strong>#${safeOrderId}</strong> is ${esc(order.orderStatus)}.</p>
                <table style="width:100%;border-collapse:collapse;font-size:14px;">
                  <thead>
                    <tr>
                      <th style="padding:10px;text-align:left;border-bottom:2px solid #cbd5e1;">Item</th>
                      <th style="padding:10px;text-align:center;border-bottom:2px solid #cbd5e1;">Qty</th>
                      <th style="padding:10px;text-align:right;border-bottom:2px solid #cbd5e1;">Price</th>
                    </tr>
                  </thead>
                  <tbody>${itemRows}</tbody>
                </table>
                <div style="margin-top:20px;font-size:14px;line-height:1.8;text-align:right;">
                  <div>Items: ${formatPrice(order.itemPrice)}</div>
                  <div>Tax: ${formatPrice(order.taxPrice)}</div>
                  <div>Shipping: ${formatPrice(order.shippingPrice)}</div>
                  <strong style="font-size:16px;">Total: ${formatPrice(order.totalPrice)}</strong>
                </div>
              </div>
            </div>`,
        });
        return { success: true };
    } catch (err) {
        console.error("Error sending order confirmation email:", err.message);
        return { success: false, error: err.message };
    }
}

module.exports = {
    sendPasswordResetEmail,
    sendCustomerPasswordResetEmail,
    sendEmergencyOtpEmail,
    sendEmailConfirmation,
    sendOrderConfirmationEmail
};
