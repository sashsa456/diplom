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

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user = useAuthStore.getState().user;
        if (!user?.refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken: user.refreshToken,
        });

        const { accessToken, refreshToken } = response.data;

        useAuthStore.setState({
          user: {
            ...user,
            accessToken,
            refreshToken,
          },
        });

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        useAuthStore.setState({ user: null });
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export const endpoints = {
    auth: {
        login: "/auth/login",
        register: "/auth/register",
        logout: "/auth/logout",
        getUserAgreement: "/static/user_agreement.docx",
        refresh: "/auth/refresh"
    },
    user: {
        profile: "/users/me",
        uploadAvatar: "/users/me/avatar",
        all: "/users"
    },
    products: {
        list: "/products",
        details: (id: number) => `/products/${id}`,
        search: "/products/search",
        create: "/products",
        myProducts: "/users/me/products"
    },
    reviews: {
        list: (productId: number) => `/products/${productId}/reviews`,
        create: (productId: number) => `/products/${productId}/reviews`,
        delete: (productId: number, reviewId: number) =>
            `/products/${productId}/reviews/${reviewId}`,
        comments: (reviewId: number) => `/reviews/${reviewId}/comments`,
        comment: (reviewId: number, commentId: number) => `/reviews/${reviewId}/comments/${commentId}`
    },
    feedbacks: {
        create: "/feedbacks",
        all: "/feedbacks",
        delete: "/feedbacks"
    },
    app: {
        all: "/app"
    }
};

export const queryKeys = {
  auth: {
    user: 'user',
  },
  user: {
    profile: 'userProfile',
    all: 'users',
  },
  products: {
    all: 'products',
    details: (id: number) => ['product', id],
    search: (query: string) => ['products', 'search', query],
    myProducts: (status?: string) => ['myProducts', status],
  },
  reviews: {
    list: (productId: number) => ['reviews', productId],
  },
  feedbacks: {
    all: 'feedbacks',
  },
  app: {
    all: 'app',
  },
};
