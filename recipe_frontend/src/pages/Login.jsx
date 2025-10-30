import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(username, password);
      const to = (loc.state && loc.state.from) || '/';
      nav(to);
    } catch (e2) {
      setErr(e2?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container" style={{ maxWidth: 420 }}>
      <div className="card" style={{ padding: 20 }}>
        <h2>Welcome back</h2>
        <p className="muted">Login to continue</p>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, marginTop: 12 }}>
          <label>
            <div className="muted">Username</div>
            <input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            />
          </label>
          <label>
            <div className="muted">Password</div>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            />
          </label>
          {err ? <p style={{ color: 'var(--error)' }}>{String(err)}</p> : null}
          <button className="primary-btn" disabled={loading} type="submit">{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <p className="muted" style={{ marginTop: 12 }}>
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  );
}
