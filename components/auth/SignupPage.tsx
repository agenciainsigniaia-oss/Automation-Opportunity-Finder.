import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { signUp } from '../../services/authService';

export const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setLoading(true);

        const { error, user } = await signUp(email, password);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        // Redirect to verification page with email
        navigate('/verify-email', { state: { email } });
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-surface rounded-2xl shadow-xl p-8 border border-surface-highlight">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-text-main mb-2">
                            Crea tu cuenta
                        </h1>
                        <p className="text-text-muted">
                            Empieza a identificar oportunidades de automatización
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-background border border-surface-highlight rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text-main"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-background border border-surface-highlight rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text-main"
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">
                                Confirmar contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-background border border-surface-highlight rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text-main"
                                    placeholder="Repite tu contraseña"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Crear cuenta
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-text-muted">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
