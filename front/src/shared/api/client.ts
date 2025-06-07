import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-storage');
  if (token) {
    const { state } = JSON.parse(token);
    if (state.user?.token) {
      config.headers.Authorization = `Bearer ${state.user.token}`;
    }
  }
  return config;
});

export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
  },
  products: {
    list: '/products',
    details: (id: number) => `/products/${id}`,
    search: '/products/search',
  },
  reviews: {
    list: (productId: number) => `/products/${productId}/reviews`,
    create: (productId: number) => `/products/${productId}/reviews`,
  },
  cart: {
    list: '/cart',
    add: '/cart/add',
    remove: '/cart/remove',
    update: '/cart/update',
  },
  feedback: {
    create: '/feedback',
  },
};

export const queryKeys = {
  auth: {
    user: 'user',
  },
  products: {
    all: 'products',
    details: (id: number) => ['product', id],
    search: (query: string) => ['products', 'search', query],
  },
  reviews: {
    list: (productId: number) => ['reviews', productId],
  },
  cart: {
    items: 'cart-items',
  },
};
