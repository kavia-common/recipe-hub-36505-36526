import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useRecipes from '../hooks/useRecipes';
import RecipeGrid from '../components/RecipeGrid';
import Pagination from '../components/Pagination';

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const page = Number(params.get('page') || '1');
  const pageSize = 9;

  const { recipes, total, loading, error } = useRecipes({ search: q, page, pageSize, mode: 'search' });
  const navigate = useNavigate();

  const onPage = (p) => {
    const next = new URLSearchParams({ q, page: String(p) });
    navigate({ pathname: '/search', search: next.toString() });
  };

  return (
    <section className="container">
      <h2 style={{ margin: '16px 0' }}>Search results {q ? `for "${q}"` : ''}</h2>
      {loading ? <p className="muted">Searching...</p> : null}
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
