// TODO: Разнести по компонентам, убрать отсюда

import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient, endpoints, queryKeys } from './client';
import { useAuthStore } from '../hooks';

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await apiClient.post(endpoints.auth.login, credentials);
      return { data, credentials };
    },
    onSuccess: ({ data, credentials }) => {
      const payload = JSON.parse(atob(data.accessToken.split('.')[1]));

      setUser({
        id: payload.sub,
        email: credentials.email,
        //FIXME временно используется часть email как username
        username: credentials.email.split('@')[0],
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    },
  });
};

export const useRegister = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (userData: {
      username: string;
      email: string;
      password: string;
    }) => {
      const { data } = await apiClient.post(endpoints.auth.register, userData);
      return { data, userData };
    },
    onSuccess: ({ data, userData }) => {
      // Получаем данные пользователя из токена
      const payload = JSON.parse(atob(data.accessToken.split('.')[1]));

      setUser({
        id: payload.sub,
        email: userData.email,
        username: userData.username,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    },
  });
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: [queryKeys.user.profile],
    queryFn: async () => {
      const { data } = await apiClient.get(endpoints.user.profile);
      return data;
    },
  });
};

interface ProductInput {
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  size: string;
  color: string;
  material: string;
  season: string;
  rating: number;
  gender: string;
  country: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  size: string;
  color: string;
  material: string;
  season: string;
  rating: number;
  gender: string;
  country: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const useMyProducts = (status?: 'pending' | 'approved' | 'rejected') => {
  return useQuery<Product[]>({
    // Явно указываем тип Product[]
    queryKey: queryKeys.products.myProducts(status),
    queryFn: async () => {
      const { data } = await apiClient.get(endpoints.products.myProducts, {
        params: { status },
      });
      return data;
    },
  });
};

export const useCreateProduct = () => {
  return useMutation<Product, Error, ProductInput>({
    mutationFn: async (productData) => {
      const { data } = await apiClient.post(
        endpoints.products.create,
        productData,
      );
      return data;
    },
  });
};

interface UpdateUserProfileInput {
  username?: string;
  email?: string;
  password?: string;
  oldPassword?: string;
}

export const useUpdateUser = () => {
  return useMutation<any, Error, UpdateUserProfileInput>({
    mutationFn: async (userData) => {
      const { data } = await apiClient.patch(endpoints.user.profile, userData);
      return data;
    },
  });
};

export const useProducts = (params?: {
  category?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: [queryKeys.products.all, params],
    queryFn: async () => {
      const { data } = await apiClient.get(endpoints.products.list, { params });
      return data;
    },
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: queryKeys.products.details(id),
    queryFn: async () => {
      const { data } = await apiClient.get(endpoints.products.details(id));
      return data;
    },
  });
};

export const useReviews = (productId: number) => {
  return useQuery({
    queryKey: queryKeys.reviews.list(productId),
    queryFn: async () => {
      const { data } = await apiClient.get(endpoints.reviews.list(productId));
      return data;
    },
  });
};

export const useCreateReview = (productId: number) => {
  return useMutation({
    mutationFn: async (reviewData: { rating: number; text: string }) => {
      const { data } = await apiClient.post(
        endpoints.reviews.create(productId),
        reviewData,
      );
      return data;
    },
  });
};

export const useSendFeedback = () => {
  return useMutation({
    mutationFn: async (feedbackData: {
      name: string;
      email: string;
      subject: string;
      message: string;
    }) => {
      const { data } = await apiClient.post(
        endpoints.feedback.create,
        feedbackData,
      );
      return data;
    },
  });
};
