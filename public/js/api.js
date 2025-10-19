const API_BASE = '/api';

/**
 * Helper to perform HTTP requests against the backend API.
 */
async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('mfuToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorBody.message || 'Request failed');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function registerUser(payload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

async function loginUser(payload) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

async function fetchProfile() {
  return apiRequest('/auth/profile');
}

async function updateProfile(payload) {
  return apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

async function fetchProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  const path = query ? `/products?${query}` : '/products';
  return apiRequest(path, { method: 'GET', headers: {} });
}

async function fetchProduct(id) {
  return apiRequest(`/products/${id}`, { method: 'GET', headers: {} });
}

async function createProduct(payload) {
  return apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

async function updateProduct(id, payload) {
  return apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

async function deleteProduct(id) {
  return apiRequest(`/products/${id}`, { method: 'DELETE' });
}

async function createOrder(payload) {
  return apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

async function fetchMyOrders() {
  return apiRequest('/orders/me');
}

async function fetchAllOrders() {
  return apiRequest('/orders');
}

async function updateOrderStatus(id, payload) {
  return apiRequest(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
