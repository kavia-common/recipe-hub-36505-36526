import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

/**
 * Hook to fetch recipe lists with pagination for home/search pages.
 */
export default function useRecipes({ search = '', page = 1, pageSize = 9, mode = 'list' }) {
  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const fetcher = useMemo(() => {
    if (mode === 'search') {
      return () => api.searchRecipes({ q: search, page, page_size: pageSize });
    }
    return () => api.listRecipes({ page, page_size: pageSize });
  }, [mode, search, page, pageSize]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await fetcher();
      // Be flexible with backend response structure:
      const items = data?.items || data?.results || data?.recipes || data?.data || [];
      const count = data?.total || data?.count || data?.total_count || items.length;
      setRecipes(items);
      setTotal(count);
    } catch (e) {
      setErr(e);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => { load(); }, [load]);

  return { recipes, total, loading, error: err, reload: load, page, pageSize };
}
