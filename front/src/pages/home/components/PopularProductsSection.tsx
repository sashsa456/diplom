import { Typography, Row, Col, Spin } from 'antd';
import { Product } from '@/shared/api/hooks';
import { ProductCard } from '@/shared/components/ProductCard/ProductCard';

const { Title, Text } = Typography;

interface PopularProductsSectionProps {
  products: Product[];
  isLoading: boolean;
}

export const PopularProductsSection = ({
  products,
  isLoading,
}: PopularProductsSectionProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-4">
        <Spin tip="Загрузка популярных товаров..." />
      </div>
    );
  }

  const featuredProducts = products
    .filter((product: Product) => product.rating === 5)
    .slice(0, 6);

  return (
    <div className="container mb-5">
      <Title level={2} className="text-center mb-4">
        Популярные товары
      </Title>
      <Text type="secondary" className="d-block text-center mb-4">
        Товары с наивысшими оценками от наших пользователей
      </Text>
      {featuredProducts.length === 0 ? (
        <div className="text-center py-4">
          <Text type="secondary">На данный момент популярных товаров нет.</Text>
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {featuredProducts.map((product: Product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};
