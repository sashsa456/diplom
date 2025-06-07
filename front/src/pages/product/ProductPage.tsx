import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Row,
  Col,
  Typography,
  Button,
  Rate,
  Input,
  Card,
  Avatar,
  Tabs,
  Space,
  message,
} from 'antd';
import {
  FacebookShareButton,
  TwitterShareButton,
  VKShareButton,
  FacebookIcon,
  TwitterIcon,
  VKIcon,
} from 'react-share';
import { useCreateReview, useProduct, useReviews } from '@/shared/api/hooks';
import { useCartStore } from '@/shared/hooks';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  text: string;
}

export const ProductPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('1');
  const [newReview, setNewReview] = useState({
    rating: 0,
    text: '',
  });

  const { data: product, isLoading: isProductLoading } = useProduct(Number(id));
  const { data: reviews, isLoading: isReviewsLoading } = useReviews(Number(id));
  const createReview = useCreateReview(Number(id));
  const addToCart = useCartStore((state) => state.addItem);

  const handleReviewSubmit = async () => {
    try {
      await createReview.mutateAsync(newReview);
      message.success('Отзыв успешно добавлен');
      setNewReview({ rating: 0, text: '' });
    } catch {
      message.error('Ошибка при добавлении отзыва');
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
      message.success('Товар добавлен в корзину');
    }
  };

  if (isProductLoading) {
    return <div className="text-center py-5">Загрузка...</div>;
  }

  if (!product) {
    return <div className="text-center py-5">Товар не найден</div>;
  }

  const items = [
    {
      key: '1',
      label: 'Характеристики',
      children: (
        <Row gutter={[24, 24]}>
          {Object.entries(product.characteristics).map(([key, value]) => (
            <Col xs={24} sm={12} key={key}>
              <Text strong>{key}:</Text>
              <Text className="ms-2">{value as string}</Text>
            </Col>
          ))}
        </Row>
      ),
    },
    {
      key: '2',
      label: 'Отзывы',
      children: (
        <div>
          <Card className="mb-4">
            <Title level={5}>Оставить отзыв</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Rate
                value={newReview.rating}
                onChange={(value) =>
                  setNewReview((prev) => ({ ...prev, rating: value }))
                }
              />
              <TextArea
                rows={4}
                value={newReview.text}
                onChange={(e) =>
                  setNewReview((prev) => ({ ...prev, text: e.target.value }))
                }
                placeholder="Напишите ваш отзыв..."
              />
              <Button
                type="primary"
                onClick={handleReviewSubmit}
                loading={createReview.isPending}
              >
                Отправить
              </Button>
            </Space>
          </Card>

          {isReviewsLoading ? (
            <div className="text-center py-3">Загрузка отзывов...</div>
          ) : (
            <Space direction="vertical" style={{ width: '100%' }}>
              {reviews?.map((review: Review) => (
                <Card key={review.id}>
                  <Space align="start">
                    <Avatar>{review.author[0]}</Avatar>
                    <div>
                      <Text strong>{review.author}</Text>
                      <div>
                        <Rate disabled defaultValue={review.rating} />
                        <Text type="secondary" className="ms-2">
                          {review.date}
                        </Text>
                      </div>
                      <Paragraph className="mt-2">{review.text}</Paragraph>
                    </div>
                  </Space>
                </Card>
              ))}
            </Space>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="container">
      <Row gutter={[32, 32]}>
        <Col xs={24} md={12}>
          <img
            src={product.image}
            alt={product.title}
            style={{ width: '100%', height: 'auto', borderRadius: 8 }}
          />
        </Col>
        <Col xs={24} md={12}>
          <Title level={2}>{product.title}</Title>
          <Title level={3} className="text-primary">
            {product.price}
          </Title>
          <Space className="mb-4">
            <Rate disabled defaultValue={product.rating} />
            <Text>({product.rating})</Text>
          </Space>
          <Paragraph>{product.description}</Paragraph>

          <div className="mb-4">
            <Text strong>Поделиться:</Text>
            <Space className="ms-2">
              <FacebookShareButton url={window.location.href}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton url={window.location.href}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <VKShareButton url={window.location.href}>
                <VKIcon size={32} round />
              </VKShareButton>
            </Space>
          </div>

          <Button type="primary" size="large" block onClick={handleAddToCart}>
            Добавить в корзину
          </Button>
        </Col>
      </Row>

      <div className="mt-5">
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
      </div>
    </div>
  );
};
