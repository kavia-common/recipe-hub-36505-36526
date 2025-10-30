import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import RecipeGrid from '../components/RecipeGrid';

export default function Favorites() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.getFavorites();
        const items = data?.items || data?.results || data?.recipes || data || [];
        if (mounted) setRecipes(items);
      } catch (e) {
        if (mounted) setErr(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  if (!user) return <div className="container"><p className="muted">Please login to view your favorites.</p></div>;
  if (loading) return <div className="container"><p className="muted">Loading favorites...</p></div>;
  if (err) return <div className="container"><p style={{ color: 'var(--error)' }}>{String(err.message || err)}</p></div>;

  return (
    <section className="container">
      <h2 style={{ margin: '16px 0' }}>Your Favorites</h2>
      <RecipeGrid recipes={recipes} />
    </section>
  );
}
