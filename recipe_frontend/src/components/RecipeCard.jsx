import React from 'react';
import { Link } from 'react-router-dom';

export default function RecipeCard({ recipe }) {
  const { id, title, image_url, image, description, time, tags } = recipe || {};
  const media = image_url || image;

  return (
    <article className="card" aria-label={`Recipe ${title || id}`}>
      <div className="media">
        {media ? (
          <img src={media} alt={title || 'Recipe image'} loading="lazy" />
        ) : null}
      </div>
      <div className="content">
        <h3 className="title" title={title}>{title || 'Untitled Recipe'}</h3>
        <p className="meta">
          {time ? <span className="badge">⏱ {time} min</span> : <span className="badge">Recipe</span>}
        </p>
        <p className="muted" style={{ minHeight: 36 }}>
          {description ? String(description).slice(0, 80) : 'Explore delicious details...'}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to={`/recipes/${id}`} className="link-btn">View</Link>
          {Array.isArray(tags) && tags.length ? (
            <span className="muted" style={{ fontSize: 12 }}>{tags.slice(0,2).join(' • ')}</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
