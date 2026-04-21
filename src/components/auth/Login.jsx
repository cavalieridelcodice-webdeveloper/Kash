import React, { useState, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import './Login.css';

function Login() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isRecovering, setIsRecovering] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // Refs for explicit iOS focus
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            if (isRecovering) {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/reset-password`,
                });
                if (error) throw error;
                setSuccessMsg('Email di recupero inviata! Controlla la tua casella di posta (Mittente: Supabase Auth <noreply@mail.app.supabase.io>).');
            } else if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}`,
                }
            });
            if (error) throw error;
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                {isRecovering ? (
                    <div className="recovery-view">
                        <div className="recovery-back" onClick={() => setIsRecovering(false)}>
                            ← Torna all'accesso
                        </div>
                        <h2>Recupero Password</h2>
                        <p className="login-subtitle">Inserisci la tua email per ricevere un link di reset</p>
                        
                        <form onSubmit={handleAuth}>
                            <div className="input-group">
                                <label>Email</label>
                                <input
                                    ref={emailRef}
                                    type="email"
                                    placeholder="tua@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            {successMsg && <p className="success-message">{successMsg}</p>}
                            <button type="submit" className="login-btn" disabled={loading}>
                                {loading ? 'Invio in corso...' : 'Invia Link di Reset'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <>
                        <h2>{isSignUp ? 'Registrati' : 'Accedi'}</h2>
                        <p className="login-subtitle">Gestisci le tue finanze con stile</p>

                        <button className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="google-icon" />
                            {isSignUp ? 'Registrati con Google' : 'Accedi con Google'}
                        </button>

                        <div className="divider">oppure</div>

                        <form onSubmit={handleAuth}>
                            <div className="input-group">
                                <label>Email</label>
                                <input
                                    ref={emailRef}
                                    type="email"
                                    placeholder="tua@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={(e) => e.target.select()}
                                    onClick={() => emailRef.current?.focus()}
                                    autoComplete="email"
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    spellCheck="false"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        ref={passwordRef}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={(e) => e.target.select()}
                                        onClick={() => passwordRef.current?.focus()}
                                        autoComplete="current-password"
                                        required
                                    />
                                    <span
                                        className="eye-icon"
                                        onClick={() => setShowPassword(!showPassword)}
                                        title={showPassword ? "Nascondi password" : "Mostra password"}
                                    >
                                        {showPassword ? '🔓' : '🔒'}
                                    </span>
                                </div>
                                {!isSignUp && (
                                    <span className="forgot-password-link" onClick={() => setIsRecovering(true)}>
                                        Hai dimenticato la password?
                                    </span>
                                )}
                            </div>

                            {error && <p className="error-message">{error}</p>}

                            <button type="submit" className="login-btn" disabled={loading}>
                                {loading ? 'Caricamento...' : (isSignUp ? 'Crea Account' : 'Entra')}
                            </button>
                        </form>

                        <div className="auth-toggle">
                            {isSignUp ? (
                                <p>Hai già un account? <span onClick={() => setIsSignUp(false)}>Accedi</span></p>
                            ) : (
                                <p>Non hai un account? <span onClick={() => setIsSignUp(true)}>Registrati</span></p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Login;
