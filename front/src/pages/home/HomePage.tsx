import { Typography, Row, Col, Card, Button, Rate } from 'antd';
import { Link } from 'react-router-dom';
import { useFeaturedProducts } from './hooks/useFeaturedProducts';

const { Title, Text } = Typography;

export const HomePage = () => {
  const featuredProducts = useFeaturedProducts();

  return (
    <div>
      <div className="bg-primary text-white py-5 mb-5 text-center">
        <div className="container">
          <Title level={1} className="text-white mb-4">
            Добро пожаловать в мир детской моды
          </Title>
          <Text className="text-white fs-5 mb-4">
            Качественная одежда для вашего ребенка
          </Text>
          <Button
            type="primary"
            size="large"
            className="bg-white text-primary border-0"
          >
            <Link to="/catalog" className="text-primary text-decoration-none">
              Перейти в каталог
            </Link>
          </Button>
        </div>
      </div>

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
                <Card.Meta
                  title={product.title}
                  description={
                    <>
                      <Text strong>{product.price} ₽</Text>
                      <br />
                      <Rate disabled defaultValue={product.rating} />
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
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};
