import React, { useState, useEffect } from 'react';
import FluentCard from '../components/FluentCard';
import { useAuth } from '../context/AuthContext';
import { KeyRound, AlertTriangle } from 'lucide-react';
import './Pages.css';

const Login = ({ setActivePage }) => {
  const { login, isAuthenticated } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null); // 'error', 'loading'
  const [errorMessage, setErrorMessage] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setActivePage('dashboard');
    }
  }, [isAuthenticated, setActivePage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setStatus('error');
      setErrorMessage('Username and password fields are required.');
      return;
    }

    setStatus('loading');
    const result = await login(username, password);
    
    if (result.success) {
      setActivePage('dashboard');
    } else {
      setStatus('error');
      setErrorMessage(result.error || 'Invalid credentials. Access Denied.');
    }
  };

  return (
    <div className="page-login section container animate-fade-in" style={{ paddingTop: '120px', display: 'flex', justifyContent: 'center' }}>
      <FluentCard className="login-card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0, 120, 212, 0.1)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'var(--color-brand)' }}>
            <KeyRound size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Admin Portal Login</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Authorized enterprise operators only. Credentials are encrypted and logged.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {status === 'error' && (
            <div className="status-alert error" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', margin: 0 }}>
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              required
              className="form-control"
              placeholder="e.g. admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              required
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary accent-glow-brand"
            disabled={status === 'loading'}
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
          >
            {status === 'loading' ? 'Verifying Identity...' : 'Sign In Securely'}
          </button>
        </form>

      </FluentCard>
    </div>
  );
};

export default Login;
