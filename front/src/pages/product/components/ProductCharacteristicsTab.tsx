import { Row, Col, Typography } from 'antd';
import { Product } from '@/shared/api/hooks';

const { Text } = Typography;

const productDetails = [
  { label: 'Материал', value: (product: Product) => product.material },
  { label: 'Сезон', value: (product: Product) => product.season },
  { label: 'Пол', value: (product: Product) => product.gender },
  { label: 'Страна', value: (product: Product) => product.countryMade },
  { label: 'Размер', value: (product: Product) => product.size },
  { label: 'Цвет', value: (product: Product) => product.colors[0] },
];

interface ProductCharacteristicsTabProps {
  product: Product;
}

export const ProductCharacteristicsTab = ({
  product,
}: ProductCharacteristicsTabProps) => {
  return (
    <Row gutter={[24, 24]}>
      {productDetails.map(({ label, value }) => (
        <Col xs={24} sm={12} key={label}>
          <Text strong>{label}:</Text>
          <Text className="ms-2">{value(product)}</Text>
        </Col>
      ))}
    </Row>
  );
};
