import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header({ theme, onToggleTheme, onSearch, currentPath }) {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
  }, [searchParams]);

  const submit = (e) => {
    e?.preventDefault();
    onSearch?.(query);
  };

  return (
    <header className="header">
      <div className="container navbar">
        <Link to="/" className="brand" aria-label="Recipe Hub Home">
          <span className="dot" />
          <span>Recipe Hub</span>
        </Link>

        <form className="searchbar" onSubmit={submit} role="search" aria-label="Recipe search">
          <span aria-hidden>🔎</span>
          <input
            ref={inputRef}
            placeholder="Search recipes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search recipes"
          />
          <button type="submit">Search</button>
        </form>

        <div className="actions">
          <button className="icon-btn" onClick={onToggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>

          {user ? (
            <>
              <Link to="/favorites" className="link-btn">⭐ Favorites</Link>
              <button className="link-btn" onClick={() => { logout(); if (currentPath === '/favorites') navigate('/'); }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="link-btn">Login</Link>
              <Link to="/register" className="primary-btn">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
