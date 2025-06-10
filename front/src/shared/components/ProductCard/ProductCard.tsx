import { Card, Typography, Button, Rate } from 'antd';
import { Link } from 'react-router-dom';
import { Product } from '@/shared/api/hooks';

const { Text } = Typography;

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card
      hoverable
      cover={
        <img
          alt={product.title}
          src={`http://localhost:3001/api${product.image}`}
          style={{ height: 200, objectFit: 'cover' }}
        />
      }
    >
      <Card.Meta
        title={product.title}
        description={
          <>
            <Text strong>{product.price} ₽</Text>
            <br />
            <Rate allowHalf disabled defaultValue={product.rating} />
            <Text type="secondary" className="ms-2">
              ({product.rating})
            </Text>
          </>
        }
      />
      <Button type="primary" block className="mt-3">
        <Link
          to={`/product/${product.id}`}
          className="text-white text-decoration-none"
        >
          Подробнее
        </Link>
      </Button>
    </Card>
  );
};
