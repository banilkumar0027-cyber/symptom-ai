'use client';
// app/auth/page.tsx
import { useState } from 'react';
import { createClient } from '@/lib/supabase';

type Mode = 'login' | 'signup' | 'forgot';

export default function AuthPage() {
  const supabase = createClient();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const reset = () => { setError(''); setMessage(''); };

  const handleLogin = async () => {
    reset();
    if (!email || !password) return setError('Please fill in all fields.');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else window.location.href = '/';
    setLoading(false);
  };

  const handleSignup = async () => {
    reset();
    if (!name || !email || !password) return setError('Please fill in all fields.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    });
    if (error) setError(error.message);
    else setMessage('✅ Account created! Check your email to confirm your account.');
    setLoading(false);
  };

  const handleForgot = async () => {
    reset();
    if (!email) return setError('Please enter your email address.');
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    });
    if (error) setError(error.message);
    else setMessage('✅ Password reset link sent! Check your email.');
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1.5px solid #1a2640',
    borderRadius: 12,
    padding: '13px 16px',
    color: '#f0f4ff',
    fontSize: 15,
    outline: 'none',
    marginBottom: 14,
    fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060c1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(6,214,160,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        background: '#0e1725',
        border: '1px solid #1a2640',
        borderRadius: 24,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 420,
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 22, fontWeight: 800,
          color: '#f0f4ff', marginBottom: 4,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ color: '#06d6a0' }}>◉</span> SymptomAI
        </div>
        <p style={{ color: '#6b82a0', fontSize: 14, marginBottom: 28 }}>
          {mode === 'login' && 'Welcome back — sign in to continue'}
          {mode === 'signup' && 'Create your free account today'}
          {mode === 'forgot' && 'Reset your password via email'}
        </p>

        {/* Error / Success messages */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#ef4444', borderRadius: 10, padding: '10px 14px',
            fontSize: 13, marginBottom: 16,
          }}>{error}</div>
        )}
        {message && (
          <div style={{
            background: 'rgba(6,214,160,0.1)', border: '1px solid rgba(6,214,160,0.3)',
            color: '#06d6a0', borderRadius: 10, padding: '10px 14px',
            fontSize: 13, marginBottom: 16,
          }}>{message}</div>
        )}

        {/* Google Button — only on login/signup */}
        {mode !== 'forgot' && (
          <>
            <button onClick={handleGoogle} style={{
              width: '100%', padding: '13px', borderRadius: 12,
              border: '1.5px solid #1a2640', background: 'transparent',
              color: '#f0f4ff', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', marginBottom: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              fontFamily: "'DM Sans', sans-serif",
              transition: 'border-color 0.2s',
            }}>
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: '#1a2640' }} />
              <span style={{ color: '#6b82a0', fontSize: 12 }}>or</span>
              <div style={{ flex: 1, height: 1, background: '#1a2640' }} />
            </div>
          </>
        )}

        {/* Name field — signup only */}
        {mode === 'signup' && (
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b82a0', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Full Name</label>
            <input
              style={inputStyle} type="text" placeholder="Anil Kumar"
              value={name} onChange={e => setName(e.target.value)}
            />
          </div>
        )}

        {/* Email */}
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b82a0', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Email Address</label>
        <input
          style={inputStyle} type="email" placeholder="you@gmail.com"
          value={email} onChange={e => setEmail(e.target.value)}
        />

        {/* Password */}
        {mode !== 'forgot' && (
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b82a0', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Password</label>
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <input
                style={{ ...inputStyle, marginBottom: 0, paddingRight: 48 }}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && mode === 'login' && handleLogin()}
              />
              <button onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: '#6b82a0', cursor: 'pointer', fontSize: 16,
              }}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
        )}

        {/* Confirm Password — signup only */}
        {mode === 'signup' && (
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b82a0', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Confirm Password</label>
            <input
              style={inputStyle} type="password" placeholder="••••••••"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>
        )}

        {/* Forgot password link */}
        {mode === 'login' && (
          <div style={{ textAlign: 'right', marginBottom: 20, marginTop: -8 }}>
            <span onClick={() => { setMode('forgot'); reset(); }}
              style={{ color: '#06d6a0', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
              Forgot password?
            </span>
          </div>
        )}

        {/* Main button */}
        <button
          onClick={mode === 'login' ? handleLogin : mode === 'signup' ? handleSignup : handleForgot}
          disabled={loading}
          style={{
            width: '100%', padding: '14px', borderRadius: 12, border: 'none',
            background: loading ? '#04a07a' : '#06d6a0',
            color: '#060c1a', fontFamily: "'Syne', sans-serif",
            fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: 20, transition: 'all 0.2s',
          }}>
          {loading ? '⏳ Please wait...' :
            mode === 'login' ? 'Sign In →' :
            mode === 'signup' ? 'Create Account →' :
            'Send Reset Link →'}
        </button>

        {/* Toggle links */}
        <div style={{ textAlign: 'center', fontSize: 14, color: '#6b82a0' }}>
          {mode === 'login' && (
            <>Don't have an account?{' '}
              <span onClick={() => { setMode('signup'); reset(); }}
                style={{ color: '#06d6a0', fontWeight: 700, cursor: 'pointer' }}>
                Sign up free
              </span>
            </>
          )}
          {mode === 'signup' && (
            <>Already have an account?{' '}
              <span onClick={() => { setMode('login'); reset(); }}
                style={{ color: '#06d6a0', fontWeight: 700, cursor: 'pointer' }}>
                Sign in
              </span>
            </>
          )}
          {mode === 'forgot' && (
            <>Remember your password?{' '}
              <span onClick={() => { setMode('login'); reset(); }}
                style={{ color: '#06d6a0', fontWeight: 700, cursor: 'pointer' }}>
                Back to sign in
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
