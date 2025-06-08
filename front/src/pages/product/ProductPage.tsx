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
  Spin,
} from 'antd';
import {
  FacebookShareButton,
  TwitterShareButton,
  VKShareButton,
  FacebookIcon,
  TwitterIcon,
  VKIcon,
} from 'react-share';
import { useParams } from 'react-router-dom';
import {
  useProduct,
  useReviews,
  useCreateReview,
  Product,
} from '@/shared/api/hooks';

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
  { label: 'Страна', value: (product: Product) => product.countryMade },
  { label: 'Размер', value: (product: Product) => product.size },
  { label: 'Цвет', value: (product: Product) => product.colors[0] },
];

export const ProductPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('1');
  const [newReview, setNewReview] = useState({
    rating: 0,
    text: '',
  });

  const {
    data: product,
    isLoading: isProductLoading,
    error: productError,
  } = useProduct(Number(id));
  const { data: reviews, isLoading: isReviewsLoading } = useReviews(Number(id));
  const createReview = useCreateReview(Number(id));
  console.log(product);
  const handleReviewSubmit = async () => {
    if (!newReview.rating || !newReview.text) {
      message.error('Пожалуйста, заполните все поля');
      return;
    }

    try {
      await createReview.mutateAsync(newReview);
      message.success('Отзыв успешно добавлен');
      setNewReview({ rating: 0, text: '' });
    } catch (error) {
      message.error('Ошибка при добавлении отзыва');
    }
  };

  if (isProductLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spin fullscreen size="large" tip="Загрузка товара..." />
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="text-center py-5">
        <Title level={3} type="danger">
          Ошибка загрузки товара
        </Title>
        <Text>{productError?.message || 'Товар не найден'}</Text>
      </div>
    );
  }

  const items = [
    {
      key: '1',
      label: 'Характеристики',
      children: (
        <Row gutter={[24, 24]}>
          {productDetails.map(({ label, value }) => (
            <Col xs={24} sm={12} key={label}>
              <Text strong>{label}:</Text>
              <Text className="ms-2">{value(product)}</Text>
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
            <div className="text-center py-4">
              <Spin tip="Загрузка отзывов..." />
            </div>
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

          <Button
            type="primary"
            size="large"
            block
            onClick={() => setActiveTab('2')}
          >
            Оставить отзыв
          </Button>
        </Col>
      </Row>

      <div className="mt-5">
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
      </div>
    </div>
  );
};
