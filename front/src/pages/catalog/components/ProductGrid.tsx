import { Row, Col, Typography } from 'antd';
import { Product } from '@/shared/api/hooks';
import { ProductCard } from '@/shared/components/ProductCard';

const { Text } = Typography;

interface ProductGridProps {
  paginatedProducts: Product[];
}

export const ProductGrid = ({ paginatedProducts }: ProductGridProps) => {
  return (
    <Row gutter={[24, 24]}>
      {paginatedProducts.length > 0 ? (
        paginatedProducts.map((product: Product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <ProductCard product={product} />
          </Col>
        ))
      ) : (
        <Col span={24}>
          <div className="text-center py-5">
            <Text>Продукты не найдены по вашим критериям.</Text>
          </div>
        </Col>
      )}
    </Row>
  );
};
