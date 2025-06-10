import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/app/styles/global.css';
import { Layout } from '@widgets/layout';
import { AuthPage } from '@pages/auth';
import { CatalogPage } from '@pages/catalog';
import { FeedbackPage } from '@pages/feedback';
import { HomePage } from '@/pages/home';
import { ProductPage } from '@/pages/product';
import { NotFoundPage } from '@/pages/not-found';
import { ProfilePage } from '@/pages/profile';
import { AdminPage } from '@/pages/admin';
import { CreateProductPage } from '@/pages/create-product';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { AppInfo } from '@/shared/api/hooks';
import { queryKeys, apiClient, endpoints } from '@/shared/api/client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

queryClient
  .fetchQuery({
    queryKey: [queryKeys.app.all],
    queryFn: async () => {
      const { data } = await apiClient.get<AppInfo>(endpoints.app.all);
      return data;
    },
  })
  .then(({ name }) => {
    document.title = name;
  });

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 6,
          },
        }}
      >
        <Router>
          <Layout>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/catalog"
                element={
                  <ProtectedRoute>
                    <CatalogPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/product/:id"
                element={
                  <ProtectedRoute>
                    <ProductPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/feedback"
                element={
                  <ProtectedRoute>
                    <FeedbackPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-product"
                element={
                  <ProtectedRoute>
                    <CreateProductPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
