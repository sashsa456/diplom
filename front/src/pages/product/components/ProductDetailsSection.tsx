import { Col, Typography, Button, Rate, Space } from 'antd';
import {
  VKShareButton,
  VKIcon,
  TelegramShareButton,
  TelegramIcon,
  EmailShareButton,
  EmailIcon,
} from 'react-share';
import { Product } from '@/shared/api/hooks';

const { Title, Text, Paragraph } = Typography;

interface ProductDetailsSectionProps {
  product: Product;
  onReviewButtonClick: () => void;
}

export const ProductDetailsSection = ({
  product,
  onReviewButtonClick,
}: ProductDetailsSectionProps) => {
  return (
    <Col xs={24} md={12}>
      <Title level={2}>{product.title}</Title>
      <Title level={3} className="text-primary">
        {product.price.toString()} ₽
      </Title>
      <Space className="mb-4">
        <Rate disabled defaultValue={product.rating} />
        <Text>({product.rating})</Text>
      </Space>
      <Paragraph>{product.description}</Paragraph>

      <div className="mb-4">
        <Text strong>Поделиться:</Text>
        <Space className="ms-2">
          <TelegramShareButton url={window.location.href}>
            <TelegramIcon size={32} round />
          </TelegramShareButton>
          <VKShareButton url={window.location.href}>
            <VKIcon size={32} round />
          </VKShareButton>
          <EmailShareButton url={window.location.href}>
            <EmailIcon size={32} round />
          </EmailShareButton>
        </Space>
      </div>

      <Button type="primary" size="large" block onClick={onReviewButtonClick}>
        Оставить отзыв
      </Button>
    </Col>
  );
};
