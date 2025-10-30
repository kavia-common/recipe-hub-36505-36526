import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.getRecipe(id);
        if (mounted) setRecipe(data);
      } catch (e) {
        if (mounted) setErr(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const addFav = async () => {
    try {
      await api.addFavorite(id);
      alert('Added to favorites');
    } catch (e) {
      alert(e?.message || 'Failed to add favorite');
    }
  };

  const removeFav = async () => {
    try {
      await api.removeFavorite(id);
      alert('Removed from favorites');
    } catch (e) {
      alert(e?.message || 'Failed to remove favorite');
    }
  };

  if (loading) return <div className="container"><p className="muted">Loading...</p></div>;
  if (err) return <div className="container"><p style={{ color: 'var(--error)' }}>{String(err.message || err)}</p></div>;
  if (!recipe) return <div className="container"><p className="muted">Recipe not found.</p></div>;

  const { title, image_url, image, description, ingredients, instructions, time, tags } = recipe;
  const media = image_url || image;

  return (
    <section className="container">
      <div className="card" style={{ overflow: 'hidden' }}>
        {media ? (
          <div className="media" style={{ paddingTop: '40%' }}>
            <img src={media} alt={title} />
          </div>
        ) : null}
        <div className="content" style={{ padding: 16 }}>
          <h2 className="title">{title || 'Recipe'}</h2>
          <p className="muted" style={{ marginTop: 8 }}>{description}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {time ? <span className="badge">⏱ {time} min</span> : null}
            {Array.isArray(tags) ? tags.map((t) => <span className="badge" key={t}>{t}</span>) : null}
          </div>
          {user ? (
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button className="primary-btn" onClick={addFav}>Add to Favorites</button>
              <button className="icon-btn" onClick={removeFav}>Remove</button>
            </div>
          ) : (
            <p className="muted" style={{ marginTop: 12 }}>Login to save this recipe.</p>
          )}
          <div style={{ marginTop: 16, display: 'grid', gap: 16, gridTemplateColumns: '1fr' }}>
            {Array.isArray(ingredients) && ingredients.length ? (
              <div className="card" style={{ padding: 16 }}>
                <h3>Ingredients</h3>
                <ul>
                  {ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
                </ul>
              </div>
            ) : null}
            {Array.isArray(instructions) && instructions.length ? (
              <div className="card" style={{ padding: 16 }}>
                <h3>Instructions</h3>
                <ol>
                  {instructions.map((step, idx) => <li key={idx} style={{ marginBottom: 6 }}>{step}</li>)}
                </ol>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
