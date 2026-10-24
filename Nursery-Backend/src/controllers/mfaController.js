const { createClient } = require('../config/supabase');
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

            if (error.status === 429 || error.code === "over_request_rate_limit") {
                return fail(res, 429, "Too many attempts. Please wait a moment and try again.");
            }
            if (error.status >= 500) {
                return fail(res, 502, "Verification service unavailable. Please try again.");
            }
            // Wrong code, expired challenge, etc.: one generic answer for all of them
            return fail(res, 401, "Invalid code");
        }

        // The upgraded session is stored in the cookies by your Supabase server client.
        // Don't send the tokens back in the JSON body.
        return res.status(200).json({ success: true, message: "MFA verified" });
    } catch (err) {
        console.error("mfaVerify: unexpected error:", err?.message);
        return fail(res, 500, "Something went wrong. Please try again.");
    }
}

module.exports = { mfaEnrollment, mfaVerify };