import { useState } from 'react';
import api from "../lib/axios";
import { useNavigate } from "react-router-dom"
import { useAdminAuth } from "../context/AdminAuthContext";

export default function MfaVerifyPage() {
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { refresh } = useAdminAuth();
    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/mfa/verify', { code });
            const data = response.data;

            if (!data.success) {
                throw new Error(data.message || 'Invalid verification code');
            }

            // Ask the server who we are NOW (the session was just upgraded to MFA level)
            const session = await refresh();

            if (session?.status !== 'ok') {
                throw new Error('Verified, but your session could not be confirmed. Please log in again.');
            }

            setSuccess(true);
            setTimeout(() => navigate('/dashboard', { replace: true }), 800);

        } catch (err) {
            if (err.response?.data?.redirectTo === '/mfa/reset') {
                navigate('/reset-mfa', { replace: true });
                return;
            }
            setCode('');
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                'Unable to verify the code. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-md text-center">
                <h2 className="text-2xl font-bold text-green-600 mb-2">Verification Successful!</h2>
                <p className="text-gray-600">Redirecting to your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Two-Factor Authentication</h2>
            <p className="text-sm text-gray-600 mb-6">
                Enter the 6-digit code from your authenticator app to complete your login.
            </p>

            {error && <div role="alert" className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

            <form onSubmit={handleVerify} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Authenticator Code</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="123456"
                        required
                        autoFocus
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-center tracking-widest text-2xl font-mono"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || code.length !== 6}
                    className="w-full py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Verifying...' : 'Verify Code'}
                </button>
            </form>
        </div>
    );
}