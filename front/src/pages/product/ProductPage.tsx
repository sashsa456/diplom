import { useState } from 'react';
import { Row, Col, Typography, Tabs, Spin, Result } from 'antd';
import { useParams } from 'react-router-dom';
import { useProduct, useReviews } from '@/shared/api/hooks';
import { ProductDetailsSection } from './components/ProductDetailsSection';
import { ProductCharacteristicsTab } from './components/ProductCharacteristicsTab';
import { ProductReviewsTab } from './components/ProductReviewsTab';

const { Text } = Typography;

export const ProductPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('1');

  const {
    data: product,
    isLoading: isProductLoading,
    error: productError,
  } = useProduct(Number(id));
  const { data: reviews, isLoading: isReviewsLoading } = useReviews(Number(id));

  if (isProductLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spin fullscreen size="large" tip="Загрузка товара..." />
      </div>
    );
  }

  if (productError) {
    return (
      <Result
        status="error"
        title="Ошибка загрузки товара"
        subTitle={
          productError?.message || 'Произошла ошибка при загрузке данных.'
        }
      />
    );
  }

  if (!product) {
    return (
      <Result
        status="404"
        title="Товар не найден"
        subTitle="Возможно, товар был удален или никогда не существовал."
      />
    );
  }

  if (product.status === 'rejected') {
    return (
      <Result
        status="warning"
        title="Товар отклонен"
        subTitle={
          <>
            <Text>
              Этот товар был отклонен модератором и недоступен для просмотра.
            </Text>
            {product.rejectionReason && (
              <Text type="secondary" className="d-block mt-2">
                Причина отклонения: {product.rejectionReason}
              </Text>
            )}
          </>
        }
      />
    );
  }

  const items = [
    {
      key: '1',
      label: 'Характеристики',
      children: <ProductCharacteristicsTab product={product} />,
    },
    {
      key: '2',
      label: 'Отзывы',
      children: (
        <ProductReviewsTab
          productId={Number(id)}
          reviews={reviews}
          isReviewsLoading={isReviewsLoading}
        />
      ),
    },
  ];

  return (
    <div className="container">
      <Row gutter={[32, 32]}>
        <Col xs={24} md={12}>
          <img
            src={`http://localhost:3001/api${product.image}`}
            alt={product.title}
            style={{ width: '100%', height: 'auto', borderRadius: 8 }}
          />
        </Col>
        <ProductDetailsSection
          product={product}
          onReviewButtonClick={() => setActiveTab('2')}
        />
      </Row>

      <div className="mt-5">
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
      </div>
    </div>
  );
};
