import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import './Login.css';

function Login() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState(null);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                // Rimosso alert per email di conferma su richiesta utente
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

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>{isSignUp ? 'Registrati' : 'Accedi'}</h2>
                <p className="login-subtitle">Gestisci le tue finanze con stile</p>

                <form onSubmit={handleAuth}>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="tua@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={(e) => e.target.select()}
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
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={(e) => e.target.select()}
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
            </div>
        </div>
    );
}

export default Login;
