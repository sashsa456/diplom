import { Card, Row, Col, Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { ShoppingOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export const HomePage = () => {
  const featuredProducts = [
    {
      id: 1,
      title: 'Детский комбинезон',
      image: 'https://via.placeholder.com/300x400',
      price: '2,500 ₽',
    },
    {
      id: 2,
      title: 'Детская куртка',
      image: 'https://via.placeholder.com/300x400',
      price: '3,200 ₽',
    },
    {
      id: 3,
      title: 'Детские брюки',
      image: 'https://via.placeholder.com/300x400',
      price: '1,800 ₽',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary text-white py-5 mb-5 text-center">
        <div className="container">
          <Title level={1} className="text-white mb-4">
            Добро пожаловать в мир детской моды
          </Title>
          <Paragraph className="text-white fs-5 mb-4">
            Качественная одежда для вашего ребенка
          </Paragraph>
          <Button
            type="primary"
            size="large"
            icon={<ShoppingOutlined />}
            className="bg-white text-primary border-0"
          >
            <Link to="/catalog" className="text-primary text-decoration-none">
              Перейти в каталог
            </Link>
          </Button>
        </div>
      </div>

      {/* Featured Products */}
      <div className="container">
        <Title level={2} className="text-center mb-4">
          Популярные товары
        </Title>
        <Row gutter={[24, 24]}>
          {featuredProducts.map((product) => (
            <Col xs={24} sm={12} md={8} key={product.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={product.title}
                    src={product.image}
                    style={{ height: 300, objectFit: 'cover' }}
                  />
                }
              >
                <Card.Meta title={product.title} description={product.price} />
                <Button type="primary" block className="mt-3">
                  <Link
                    to={`/product/${product.id}`}
                    className="text-white text-decoration-none"
                  >
                    Подробнее
                  </Link>
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};
