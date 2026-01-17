import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';
import { resendVerificationEmail } from '../../services/authService';

export const VerifyEmailPage: React.FC = () => {
    const location = useLocation();
    const email = (location.state as { email?: string })?.email || '';

    const [resending, setResending] = useState(false);
    const [resent, setResent] = useState(false);
    const [error, setError] = useState('');

    const handleResend = async () => {
        if (!email) return;

        setResending(true);
        setError('');

        const { error } = await resendVerificationEmail(email);

        if (error) {
            setError(error.message);
        } else {
            setResent(true);
        }

        setResending(false);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-surface rounded-2xl shadow-xl p-8 border border-surface-highlight text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-8 h-8 text-primary" />
                    </div>

                    <h1 className="text-2xl font-bold text-text-main mb-3">
                        Revisa tu correo
                    </h1>

                    <p className="text-text-muted mb-6">
                        Hemos enviado un enlace de verificación a{' '}
                        <span className="text-primary font-medium">{email || 'tu correo'}</span>.
                        Haz clic en el enlace para activar tu cuenta.
                    </p>

                    {resent && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <p className="text-sm text-green-400">Email reenviado correctamente</p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <button
                            onClick={handleResend}
                            disabled={resending || !email}
                            className="w-full py-3 px-4 bg-surface-highlight hover:bg-surface-highlight/80 text-text-main font-medium rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                            {resending ? (
                                <RefreshCw className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <RefreshCw className="w-5 h-5" />
                                    Reenviar email
                                </>
                            )}
                        </button>

                        <Link
                            to="/login"
                            className="block w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg text-center transition-colors"
                        >
                            Ir a iniciar sesión
                        </Link>
                    </div>

                    <p className="mt-6 text-sm text-text-muted">
                        ¿No recibiste el email? Revisa tu carpeta de spam.
                    </p>
                </div>
            </div>
        </div>
    );
};
