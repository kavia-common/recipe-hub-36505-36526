import React from 'react';

export default function Pagination({ page = 1, pageSize = 9, total = 0, onPage }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;
  const items = [];
  for (let p = 1; p <= totalPages; p++) {
    items.push(
      <button
        key={p}
        className={`page-btn ${p === Number(page) ? 'active' : ''}`}
        onClick={() => onPage?.(p)}
        aria-label={`Go to page ${p}`}
      >
        {p}
      </button>
    );
  }
  return <div className="pagination" role="navigation" aria-label="Pagination">{items}</div>;
}
