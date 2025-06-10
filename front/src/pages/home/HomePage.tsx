import { Typography, Spin } from 'antd';
import { useProducts } from '@/shared/api/hooks';
import { HeroSection } from './components/HeroSection';
import { CategoriesSection } from './components/CategoriesSection';
import { PopularProductsSection } from './components/PopularProductsSection';
import { useSearchParams } from 'react-router-dom';

const { Title, Text } = Typography;

export const HomePage = () => {
  const [searchParams] = useSearchParams("query=%");
  const { data: allProducts, isLoading, error } = useProducts(searchParams);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spin fullscreen size="large" tip="Загрузка товаров..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <Title level={3} type="danger">
          Ошибка загрузки товаров
        </Title>
        <Text>{error?.message || 'Не удалось загрузить товары'}</Text>
      </div>
    );
  }

  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <PopularProductsSection
        products={allProducts || []}
        isLoading={isLoading}
      />
    </div>
  );
};
