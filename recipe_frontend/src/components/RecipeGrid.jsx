import React from 'react';
import RecipeCard from './RecipeCard';

export default function RecipeGrid({ recipes = [] }) {
  if (!recipes.length) {
    return <div className="card" style={{ padding: 16 }}><p className="muted">No recipes found.</p></div>;
  }
  return (
    <div className="grid">
      {recipes.map((r) => (
        <RecipeCard key={r.id || r.slug || r.title} recipe={r} />
      ))}
    </div>
  );
}
