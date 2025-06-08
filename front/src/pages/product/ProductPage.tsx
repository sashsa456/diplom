// TODO: Переехать с моков

import { useState } from 'react';
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
import { mockProduct, mockReviews } from './constants';
import { Product } from '@/types/catalog';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  text: string;
}

const productDetails = [
  { label: 'Материал', value: (product: Product) => product.material },
  { label: 'Сезон', value: (product: Product) => product.season },
  { label: 'Пол', value: (product: Product) => product.gender },
  { label: 'Страна', value: (product: Product) => product.country },
  { label: 'Размеры', value: (product: Product) => product.size.join(', ') },
  { label: 'Цвет', value: (product: Product) => product.color },
];

export const ProductPage = () => {
  // const { id } = useParams();
  const [activeTab, setActiveTab] = useState('1');
  const [newReview, setNewReview] = useState({
    rating: 0,
    text: '',
  });

  const handleReviewSubmit = () => {
    message.success('Отзыв успешно добавлен');
    setNewReview({ rating: 0, text: '' });
  };

  const items = [
    {
      key: '1',
      label: 'Характеристики',
      children: (
        <Row gutter={[24, 24]}>
          {productDetails.map(({ label, value }) => (
            <Col xs={24} sm={12} key={label}>
              <Text strong>{label}:</Text>
              <Text className="ms-2">{value(mockProduct)}</Text>
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
              <Button type="primary" onClick={handleReviewSubmit}>
                Отправить
              </Button>
            </Space>
          </Card>

          <Space direction="vertical" style={{ width: '100%' }}>
            {mockReviews.map((review: Review) => (
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
        </div>
      ),
    },
  ];

  return (
    <div className="container">
      <Row gutter={[32, 32]}>
        <Col xs={24} md={12}>
          <img
            src={mockProduct.image}
            alt={mockProduct.title}
            style={{ width: '100%', height: 'auto', borderRadius: 8 }}
          />
        </Col>
        <Col xs={24} md={12}>
          <Title level={2}>{mockProduct.title}</Title>
          <Title level={3} className="text-primary">
            {mockProduct.price.toString()} ₽
          </Title>
          <Space className="mb-4">
            <Rate disabled defaultValue={mockProduct.rating} />
            <Text>({mockProduct.rating})</Text>
          </Space>
          <Paragraph>{mockProduct.description}</Paragraph>

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

          <Button type="primary" size="large" block>
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
