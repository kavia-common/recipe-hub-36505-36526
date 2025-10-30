import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useRecipes from '../hooks/useRecipes';
import RecipeGrid from '../components/RecipeGrid';
import Pagination from '../components/Pagination';

export default function Home() {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get('page') || '1');
  const pageSize = 9;
  const { recipes, total, loading, error } = useRecipes({ page, pageSize, mode: 'list' });
  const navigate = useNavigate();

  const onPage = (p) => {
    const next = new URLSearchParams(params);
    next.set('page', String(p));
    navigate({ pathname: '/', search: next.toString() });
  };

  return (
    <section className="container">
      <h2 style={{ margin: '16px 0' }}>Featured Recipes</h2>
      {loading ? <p className="muted">Loading recipes...</p> : null}
      {error ? <p style={{ color: 'var(--error)' }}>{String(error.message || error)}</p> : null}
      {!loading && !error ? (
        <>
          <RecipeGrid recipes={recipes} />
          <Pagination page={page} pageSize={pageSize} total={total} onPage={onPage} />
        </>
      ) : null}
    </section>
  );
}
