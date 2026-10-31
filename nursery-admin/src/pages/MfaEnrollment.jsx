import { useState, useEffect } from 'react';
import api from "../lib/axios";
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from "../context/AdminAuthContext";

export default function MfaEnrollmentPage() {
    const navigate = useNavigate();
    const { refresh } = useAdminAuth();
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
    const [secret, setSecret] = useState('');
    const [factorId, setFactorId] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    function toQrSrc(qr) {
        if (!qr) return '';

        // Supabase sends "data:image/svg+xml;utf-8,<svg ...>"; take the SVG part and re-encode it safely
        if (qr.startsWith('data:')) {
            const raw = qr.slice(qr.indexOf(',') + 1);
            let svg = raw;
            try { svg = decodeURIComponent(raw); } catch { /* already plain SVG */ }
            return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
        }

        // A bare <svg>...</svg> string
        if (qr.trim().startsWith('<svg')) {
            return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qr)}`;
        }

        return qr; // an http(s) URL or something else: use as is
    }

    useEffect(() => {
        async function startEnrollment() {
            try {
                const response = await api.post("/mfa/enroll");
                const data = response.data;
                if (!data.ok) {
                    throw new Error(data.message || 'Failed to start MFA enrollment');
                }

                setSecret(data.secret);
                setFactorId(data.factorId);
                setQrCodeDataUrl(toQrSrc(data.qrCode));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        startEnrollment();
    }, []);

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Updated to use your configured 'api' instance with cookies
            const response = await api.post('/mfa/verify', { factorId, code: verifyCode });
            const data = response.data;

            if (!data.success) {
                throw new Error(data.message || 'Invalid verification code');
            }
            const session = await refresh();

            if (session?.status !== 'ok') {
                throw new Error('Verified, but your session could not be confirmed. Please log in again.');
            }

            setSuccess(true);
            setTimeout(() => navigate('/dashboard', { replace: true }), 800);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    if (loading) {
        return <div className="p-6 text-center text-gray-600">Loading authenticator setup...</div>;
    }

    if (success) {
        return (
            <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-md text-center">
                <h2 className="text-2xl font-bold text-green-600 mb-2">MFA Enabled Successfully!</h2>
                <p className="text-gray-600">Your account is now secured with two-factor authentication.</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Set up Two-Factor Authentication</h2>
            <p className="text-sm text-gray-600 mb-6">
                Scan the QR code below using an authenticator app (like Google Authenticator, Authy, or 1Password).
            </p>

            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

            {/* Display QR Code safely using an standard img tag */}
            <div className="flex flex-col items-center justify-center mb-6 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                {qrCodeDataUrl ? (
                    <img
                        src={qrCodeDataUrl}
                        alt="MFA QR Code"
                        style={{ display: 'block', width: '219px', height: '219px' }}
                        className="object-contain"
                    />
                ) : (
                    <p className="text-gray-400">QR Code unavailable</p>
                )}

                <div className="mt-4 text-xs text-gray-500 text-center">
                    <span className="font-medium">Or enter setup key manually:</span>
                    <code className="block mt-1 p-1 bg-white border rounded text-gray-800 select-all">{secret}</code>
                </div>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleVerify} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter 6-digit Code</label>
                    <input
                        type="text"
                        maxLength="6"
                        value={verifyCode}
                        onChange={(e) => setVerifyCode(e.target.value)}
                        placeholder="123456"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-center tracking-widest text-lg font-mono"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
                >
                    Verify and Activate
                </button>
            </form>
        </div>
    );
}