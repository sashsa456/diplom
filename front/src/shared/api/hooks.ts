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
        username: data.username,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        avatar: data.avatar,
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
      const payload = JSON.parse(atob(data.accessToken.split('.')[1]));

      setUser({
        id: payload.sub,
        email: userData.email,
        username: userData.username,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        avatar: '',
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
  image: File;
  category: string;
  size: string;
  colors: string[];
  material: string;
  season: string;
  gender: string;
  countryMade: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  size: string;
  colors: string[];
  material: string;
  season: string;
  rating: number;
  gender: string;
  countryMade: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface User {
  id: number;
  email: string;
  username: string;
  accessToken: string;
  refreshToken: string;
  avatar: string;
  isAdmin?: boolean;
}

export interface Comment {
  id: number;
  user: User;
  createdAt: string;
  message: string;
}

export interface Review {
  id: number;
  user: User;
  rating: number;
  createdAt: string;
  text: string;
  comments: Comment[];
}

export interface Feedback {
  id: number;
  name: string;
  email: string;
  topic: string;
  text: string;
  createdAt: string;
}

export interface AppInfo {
  name: string;
  contactEmail: string;
  contactPhone: string;
}

export interface ProductSearch {
  size: string;
  age: string;
  season: string;
  gender: string;
  price: string;
}

export const useAppInfo = () => {
  return useQuery({
    queryKey: [queryKeys.app.all],
    queryFn: async () => {
      const { data } = await apiClient.get<AppInfo>(endpoints.app.all);
      return data;
    },
  });
};

export const useAppInfoUpdate = () => {
  return useMutation({
    mutationFn: async (appInfo: AppInfo) => {
      const { data } = await apiClient.patch(endpoints.app.all, appInfo);
      return data;
    },
  });
};

export const useMyProducts = (status?: 'pending' | 'accepted' | 'rejected') => {
  return useQuery<Product[]>({
    queryKey: queryKeys.products.myProducts(status),
    queryFn: async () => {
      const { data } = await apiClient.get(endpoints.products.myProducts, {
        params: { status },
      });
      const productsArray = data.products || [];
      return productsArray.filter((product: Product) =>
        status ? product.status === status : true,
      );
    },
  });
};

export const useCreateProduct = () => {
  return useMutation<Product, Error, ProductInput>({
    mutationFn: async (productData) => {
      const { data } = await apiClient.post(
        endpoints.products.create,
        productData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return data;
    },
  });
};

interface UpdateUserProfileInput {
  username?: string;
  email?: string;
  password?: string;
}

export const useUpdateUser = () => {
  return useMutation<User, Error, UpdateUserProfileInput>({
    mutationFn: async (userData) => {
      const { data } = await apiClient.patch(endpoints.user.profile, userData);
      return data;
    },
  });
};

interface ProductSearchParams {
  category?: string;
  query?: string;
  status?: 'pending' | 'accepted' | 'rejected';
  size?: string;
  color?: string;
  material?: string;
  season?: string;
  gender?: string;
  countryMade?: string;
  price?: string;
  rating?: number;
}

export const useProducts = (params?: ProductSearchParams) => {
  return useQuery({
    queryKey: [queryKeys.products.all, params],
    queryFn: async () => {
      const processedParams: Record<string, any> = { ...params };

      if (
        !processedParams.query ||
        String(processedParams.query).trim() === ''
      ) {
        processedParams.query = '%';
      }

      const endpoint = endpoints.products.search;

      const finalParams: { [key: string]: any } = {};

      for (const key in processedParams) {
        const value = processedParams[key];
        if (key !== 'status' && value !== undefined) {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              finalParams[key] = value.join(',');
            }
          } else if (key === 'price' && String(value) === '0-1000000') {
            continue;
          } else if (key === 'rating' && Number(value) === 0) {
            continue;
          } else if (
            typeof value === 'string' &&
            value.trim() === '' &&
            key !== 'query'
          ) {
            continue;
          } else {
            finalParams[key] = value;
          }
        }
      }

      const { data } = await apiClient.get(endpoint, {
        params: finalParams,
      });
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

export const useDeleteReview = (productId: number) => {
  return useMutation({
    mutationFn: async (reviewId: number) => {
      const { data } = await apiClient.delete(
        endpoints.reviews.delete(productId, reviewId),
      );
      return data;
    },
  });
};

export const useCreateComment = () => {
  return useMutation({
    mutationFn: async ({
      reviewId,
      message,
    }: {
      reviewId: number;
      message: string;
    }) => {
      const { data } = await apiClient.post(
        endpoints.reviews.comments(reviewId),
        { message },
      );
      return data;
    },
  });
};

export const useDeleteComment = () => {
  return useMutation({
    mutationFn: async ({
      reviewId,
      commentId,
    }: {
      reviewId: number;
      commentId: number;
    }) => {
      const { data } = await apiClient.delete(
        endpoints.reviews.comment(reviewId, commentId),
      );
      return data;
    },
  });
};

interface FeedbackFormData {
  name: string;
  email: string;
  topic: string;
  text: string;
}
export const useSendFeedback = () => {
  return useMutation({
    mutationFn: async (feedbackData: FeedbackFormData) => {
      const { data } = await apiClient.post(
        endpoints.feedbacks.create,
        feedbackData,
      );
      return data;
    },
  });
};

export const useFeedbacks = () => {
  return useQuery({
    queryKey: [queryKeys.feedbacks.all],
    queryFn: async () => {
      const { data } = await apiClient.get<Feedback[]>(endpoints.feedbacks.all);
      return data;
    },
    initialData: [],
  });
};

export const useDeleteFeedback = () => {
  return useMutation({
    mutationFn: async (feedbackId: number) => {
      const { data } = await apiClient.delete(
        `${endpoints.feedbacks.delete}/${feedbackId}`,
      );
      return data;
    },
  });
};

export const useUploadAvatar = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);

      const { data } = await apiClient.post(
        endpoints.user.uploadAvatar,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return data;
    },
  });
};

export const useUpdateProductStatus = () => {
  return useMutation<
    { message: string },
    Error,
    { productId: number; status: 'accepted' | 'rejected' }
  >({
    mutationFn: async ({ productId, status }) => {
      const { data } = await apiClient.post(
        `${endpoints.products.details(productId)}/status`,
        { status },
      );
      return data;
    },
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: [queryKeys.user.all],
    queryFn: async () => {
      const { data } = await apiClient.get(endpoints.user.all);
      return data;
    },
  });
};

export const useUpdateUserAdminStatus = () => {
  return useMutation<
    { message: string },
    Error,
    { userId: number; isAdmin: boolean }
  >({
    mutationFn: async ({ userId, isAdmin }) => {
      const { data } = await apiClient.patch(
        `${endpoints.user.all}/${userId}`,
        { isAdmin },
      );
      return data;
    },
  });
};

export const useUpdateUserActiveStatus = () => {
  return useMutation<
    { message: string },
    Error,
    { userId: number; isActive: boolean }
  >({
    mutationFn: async ({ userId, isActive }) => {
      const { data } = await apiClient.patch(
        `${endpoints.user.all}/${userId}`,
        { isActive },
      );
      return data;
    },
  });
};

export const useDeleteUser = () => {
  return useMutation<{ message: string }, Error, { userId: number }>({
    mutationFn: async ({ userId }) => {
      const { data } = await apiClient.delete(
        `${endpoints.user.all}/${userId}`,
      );
      return data;
    },
  });
};

export const useUpdateProduct = () => {
  return useMutation<
    Product,
    Error,
    { productId: number; data: Partial<ProductInput> }
  >({
    mutationFn: async ({ productId, data }) => {
      const { data: response } = await apiClient.patch(
        endpoints.products.details(productId),
        data,
      );
      return response;
    },
  });
};

export const useResubmitProduct = () => {
  return useMutation<{ message: string }, Error, { productId: number }>({
    mutationFn: async ({ productId }) => {
      const { data } = await apiClient.post(
        `${endpoints.products.details(productId)}/status`,
        { status: 'pending' },
      );
      return data;
    },
  });
};
