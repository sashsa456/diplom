import axios from 'axios';
import { useAuthStore } from '../hooks';

const API_URL = 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const user = useAuthStore.getState().user;
  if (user?.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }
  return config;
});

export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    getUserAgreement: '/static/user_agreement.docx',
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
