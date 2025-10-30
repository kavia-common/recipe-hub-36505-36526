/* API client with environment-based base URL and JWT handling */
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

/**
 * Simple wrapper over fetch that injects Authorization and handles 401.
 */
async function apiFetch(path, { method = 'GET', headers = {}, body, auth = true } = {}) {
  const token = localStorage.getItem('token');
  const finalHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };
  if (auth && token) {
    finalHeaders['Authorization'] = `Bearer ${token}`;
  }
  const url = `${API_BASE_URL}${path}`;
  const resp = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (resp.status === 401) {
    // Token invalid/expired -> clear and optionally redirect
    localStorage.removeItem('token');
    // bubble up to allow UI to handle redirect
    const error = new Error('Unauthorized');
    error.status = 401;
    throw error;
  }
  const contentType = resp.headers.get('content-type') || '';
  if (!resp.ok) {
    let message = `HTTP ${resp.status}`;
    try {
      if (contentType.includes('application/json')) {
        const data = await resp.json();
        message = data?.detail || data?.message || message;
      } else {
        const text = await resp.text();
        message = text || message;
      }
    } catch {}
    const error = new Error(message);
    error.status = resp.status;
    throw error;
  }

  if (contentType.includes('application/json')) {
    return resp.json();
  }
  return resp.text();
}

// PUBLIC_INTERFACE
export function getBaseUrl() {
  /** Returns API base URL read from REACT_APP_API_BASE_URL for diagnostics. */
  return API_BASE_URL;
}

// PUBLIC_INTERFACE
export const api = {
  /** Authenticate and obtain JWT tokens */
  login: (username, password) =>
    apiFetch('/auth/login', {
      method: 'POST',
      auth: false,
      body: { username, password },
    }),

  /** Register a new user */
  register: (username, email, password) =>
    apiFetch('/auth/register', {
      method: 'POST',
      auth: false,
      body: { username, email, password },
    }),

  /** Get current user profile using token; safe if backend not implemented */
  me: async () => {
    try {
      return await apiFetch('/users/me', { method: 'GET', auth: true });
    } catch (e) {
      // Stub-safe fallback: return null on 404/Not implemented
      if (e?.status === 404) return null;
      throw e;
    }
  },

  /** Search recipes with pagination */
  searchRecipes: ({ q = '', page = 1, page_size = 9 } = {}) => {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    params.append('page', String(page));
    params.append('page_size', String(page_size));
    return apiFetch(`/recipes/search?${params.toString()}`, { method: 'GET', auth: false });
  },

  /** List recipes for home feed */
  listRecipes: ({ page = 1, page_size = 9 } = {}) => {
    const params = new URLSearchParams({ page: String(page), page_size: String(page_size) });
    return apiFetch(`/recipes?${params.toString()}`, { method: 'GET', auth: false });
  },

  /** Get a single recipe by id */
  getRecipe: (id) => apiFetch(`/recipes/${id}`, { method: 'GET', auth: false }),

  /** Favorites */
  getFavorites: () => apiFetch('/favorites', { method: 'GET', auth: true }),
  addFavorite: (id) => apiFetch(`/favorites/${id}`, { method: 'POST', auth: true }),
  removeFavorite: (id) => apiFetch(`/favorites/${id}`, { method: 'DELETE', auth: true }),
};
