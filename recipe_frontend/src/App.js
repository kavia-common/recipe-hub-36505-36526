import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import Search from './pages/Search';
import RecipeDetail from './pages/RecipeDetail';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';

/**
 * Root application component that wires routing and global theme handling.
 * Provides Auth context to all pages and renders a shared Header.
 */
function AppShell() {
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const onSearch = (q) => {
    if (!q || !q.trim()) return;
    const params = new URLSearchParams({ q: q.trim(), page: '1' });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="App">
      <Header
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        onSearch={onSearch}
        currentPath={location.pathname}
      />
      <main className="container" style={{ paddingTop: 16, paddingBottom: 32 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <footer className="footer">
        <p className="muted">© {new Date().getFullYear()} Recipe Hub</p>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Public entry for the React app that mounts providers. */
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
