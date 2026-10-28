const { createClient } = require('../config/supabase');
const { sendEmergencyOtpEmail } = require("../utils/email");
const crypto = require("node:crypto")
const AuthSecurityTracker = require("../models/authSecurityTracker");
const { supabaseAdmin } = require("../config/admin");


const CODE_RE = /^\d{6}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;



const fail = (res, status, message) => res.status(status).json({ success: false, message });


function parseInput(body) {
    if (!body || typeof body !== "object") return null;

    const { code, factorId } = body;
    if (typeof code !== "string") return null;

    const cleanCode = code.replace(/[\s-]/g, "");
    if (!CODE_RE.test(cleanCode)) return null;

    if (factorId === undefined || factorId === null || factorId === "") {
        return { code: cleanCode, factorId: null };
    }
    if (typeof factorId !== "string" || !UUID_RE.test(factorId.trim())) return null;

    return { code: cleanCode, factorId: factorId.trim() };
}

function pickFactor(factors, requestedId) {
    const totp = (factors?.all ?? []).filter((f) => f.factor_type === "totp");

    if (requestedId) return totp.find((f) => f.id === requestedId) ?? null;

    const verified = totp.find((f) => f.status === "verified");
    if (verified) return verified;

    return (
        totp
            .filter((f) => f.status === "unverified")
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0] ?? null
    );
}

// controller for mfa enrollment
const mfaEnrollment = async (req, res) => {
    try {
        const supabase = createClient(req, res);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Not Authenticated!!!"
            });
        }

        // 1. List all existing factors for the user
        const { data: factors, error: listError } = await supabase.auth.mfa.listFactors();

        if (!listError && factors?.all) {
            for (const f of factors.all) {
                // Safe check: Only target unverified totp factors to prevent AAL2 restriction errors
                if (f.factor_type === 'totp' && f.status === 'unverified' && f.id) {
                    const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId: f.id });
                    if (unenrollError) {
                        console.warn(`Skipped or failed to unenroll factor ${f.id}:`, unenrollError.message);
                    }
                }
            }
        }

        const uniqueFriendlyName = `Greenbeli admin - ${Date.now()}`;

        const { data, error } = await supabase.auth.mfa.enroll({
            factorType: 'totp',
            issuer: 'Greenbeli',
            friendlyName: uniqueFriendlyName
        });

        if (error) {
            console.error("Supabase enrollment error:", error);
            return res.status(400).json({
                success: false,
                message: error.message || "Could not start enrollment"
            });
        }

        return res.status(200).json({
            ok: true,
            factorId: data.id,
            qrCode: data.totp.qr_code,
            secret: data.totp.secret
        });

    } catch (error) {
        console.error("MFA enrollment exception:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const mfaVerify = async (req, res) => {
    res.set("Cache-Control", "no-store");

    try {
        const input = parseInput(req.body);
        if (!input) {
            return fail(res, 400, "Enter the 6-digit code from your authenticator app.");
        }

        const supabase = createClient(req, res);

        const { data, error: userError } = await supabase.auth.getUser();
        const user = data?.user;
        if (userError || !user) {
            return fail(res, 401, "Not authenticated");
        }

        const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
        if (factorsError) {
            console.error("mfaVerify: listFactors failed:", factorsError.message);
            return fail(res, 502, "Could not reach the verification service. Please try again.");
        }

        let tracker = await AuthSecurityTracker.findOne({ identifier: user.email.toLowerCase() });

        if (tracker?.isMfaLocked) {
            return res.status(423).json(
                {
                    success: false,
                    message: 'MFA is frozen due to 5 failed attempts. Please use your email OTP to reset your authenticator app.',
                    locked: true,
                    redirectTo: '/mfa/reset',
                }
            );
        }
        const factor = pickFactor(factors, input.factorId);
        if (!factor) {
            return fail(res, 400, "No MFA factor found");
        }

        const { error } = await supabase.auth.mfa.challengeAndVerify({
            factorId: factor.id,
            code: input.code,
        });

        if (error) {
            // Never log the code or the session; the message alone is enough to debug
            console.error("mfaVerify: verification failed:", error.status, error.message);

            if (!tracker) {
                tracker = new AuthSecurityTracker({ identifier: user.email.toLowerCase() });
            }
            tracker.mfaFailures = (tracker.mfaFailures || 0) + 1;
            tracker.lastFailedAt = new Date();
            if (tracker.mfaFailures >= 5) {
                tracker.isMfaLocked = true;
                // Generate emergency 6-digit OTP using cryptographically secure CSPRNG (10 min TTL)
                const otpCode = crypto.randomInt(100000, 1000000).toString();
                // Encrypted via SHA-256 hash in DB (never plaintext)
                tracker.mfaResetOtp = crypto.createHash('sha256').update(otpCode).digest('hex');
                tracker.mfaResetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
                await tracker.save();

                console.warn(`[SECURITY ALERT] 5 failed MFA attempts for ${user.email}. MFA frozen.`);

                return res.status(423).json(
                    {
                        success: false,
                        message: 'MFA frozen due to 5 failed attempts. An emergency reset OTP has been generated.',
                        locked: true,
                        redirectTo: '/mfa/reset',
                    },
                );
            }

            await tracker.save();
            return fail(res, 400, "Incorrect authenticator code. Please try again.");
        }

        if (tracker && (tracker.mfaFailures > 0 || tracker.isMfaLocked)) {
            tracker.mfaFailures = 0;
            tracker.isMfaLocked = false;
            tracker.mfaResetOtp = null;
            tracker.mfaResetOtpExpires = null;
            await tracker.save();
        }
        return res.status(200).json({ success: true, message: "MFA verified" });
    } catch (err) {
        console.error("mfaVerify: unexpected error:", err?.message);
        return fail(res, 500, "Something went wrong. Please try again.");
    }
}

const mfaResetRequest = async (req, res) => {
    try {
        const supabase = createClient(req, res);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated.'
            });
        }

        // Lock endpoint: Only users with an active verified factor can request a reset OTP
        const { data: factors } = await supabase.auth.mfa.listFactors();
        const hasVerifiedFactor = factors?.all?.some((f) => f.status === 'verified');
        if (!hasVerifiedFactor) {
            return res.status(400).json({
                success: false,
                message: "No active MFA factor found to reset."
            })
        }

        let tracker = await AuthSecurityTracker.findOne({ identifier: user.email.toLowerCase() });
        if (!tracker) {
            tracker = new AuthSecurityTracker({ identifier: user.email.toLowerCase() });
        }

        // Cryptographically secure CSPRNG 6-digit OTP (unpredictable)
        const otpCode = crypto.randomInt(100000, 1000000).toString();
        // One-way cryptographic SHA-256 hash stored in DB (never plaintext)
        tracker.mfaResetOtp = crypto.createHash('sha256').update(otpCode).digest('hex');
        tracker.mfaResetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await tracker.save();

        console.warn(`[SECURITY ALERT] MFA Reset OTP generated for ${user.email}: ${otpCode}`);

        // Dispatch via Resend to user's registered admin email
        const emailRes = await sendEmergencyOtpEmail({
            toEmail: user.email,
            otp: otpCode,
        });

        if (!emailRes.success) {
            console.error('Failed to send MFA OTP email:', emailRes.error);
            return res.status(500).json({
                error: 'Could not send verification email. Please check server logs or contact support.',
            });
        }

        return res.status(200).json({
            success: true,
            message: `A 6-digit verification code has been dispatched to ${user.email}. Please check your inbox.`,
        });
    }
    catch (error) {
        console.error("mfaResetRequest: unexpected error:", error?.message);
        return fail(res, 500, "Something went wrong. Please try again.");
    }
}


const mfaResetVerify = async (req, res) => {
    try {
        const otp = req.body?.otp;
        if (typeof otp !== "string" || !/^\d{6}$/.test(otp)) {
            return res.status(400).json({
                success: false,
                message: 'Enter a valid 6-digit OTP.',
            });
        }

        const supabase = createClient(req, res);

        const { data, error: userError } = await supabase.auth.getUser();
        const user = data?.user;
        if (userError || !user?.email) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated.',
            });
        }

        // Lock endpoint: Only users with an active verified factor can reset.
        const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
        if (factorsError) {
            console.error("mfaResetVerify: listFactors failed:", factorsError.message);
            return fail(res, 502, "Could not reach the verification service. Please try again.");
        }

        const hasVerifiedFactor = factors?.all?.some((factor) => factor.status === 'verified');
        if (!hasVerifiedFactor) {
            return res.status(400).json({
                success: false,
                message: 'No active MFA factor to reset.',
            });
        }

        const tracker = await AuthSecurityTracker.findOne({ identifier: user.email.toLowerCase() });

        if (!tracker || !tracker.mfaResetOtp || !tracker.mfaResetOtpExpires) {
            return res.status(400).json({
                success: false,
                message: 'No active MFA reset request found.',
            });
        }

        if (new Date() > tracker.mfaResetOtpExpires) {
            return res.status(400).json({
                success: false,
                message: 'Reset OTP has expired. Please request a new code.',
            });
        }

        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
        if (otpHash !== tracker.mfaResetOtp) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect OTP code.',
            });
        }

        // Delete existing TOTP factors via Supabase Admin SDK.
        const { data: adminFactors, error: adminFactorsError } =
            await supabaseAdmin.auth.admin.mfa.listFactors({ userId: user.id });
        if (adminFactorsError) throw adminFactorsError;

        for (const f of adminFactors?.factors || []) {
            const { error: deleteError } = await supabaseAdmin.auth.admin.mfa.deleteFactor({
                userId: user.id,
                id: f.id,
            });
            if (deleteError) throw deleteError;
        }

        // Reset tracker lockout flags.
        tracker.mfaFailures = 0;
        tracker.isMfaLocked = false;
        tracker.mfaResetOtp = null;
        tracker.mfaResetOtpExpires = null;
        await tracker.save();

        // Refresh the session after factor removal so the user can enroll again.
        try {
            await supabase.auth.refreshSession();
        } catch {
            // Factor removal succeeded; enrollment can proceed with the current session.
        }

        return res.status(200).json({
            success: true,
            message: 'Authenticator has been removed. Redirecting to setup a fresh QR code...',
            redirectTo: '/mfa-enrollment',
        });
    } catch (err) {
        console.error("mfaResetVerify: unexpected error:", err?.message || err);
        return fail(res, 500, "Could not reset the authenticator. Please try again.");
    }
}

module.exports = { mfaEnrollment, mfaVerify, mfaResetRequest, mfaResetVerify };