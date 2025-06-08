import { useState } from 'react';
import { Typography, Row, Col, Card, Button, Input, Rate, Select } from 'antd';
import { Link } from 'react-router-dom';
import { useFeaturedProducts } from './hooks/useFeaturedProducts';

const { Title, Text } = Typography;

// Моковые данные для категорий и фильтров (позже можно вынести в константы)
const categories = [
  { key: 'toddler', label: 'Для малышей', icon: '👶' },
  { key: 'preschool', label: 'Для дошкольников', icon: '👧' },
  { key: 'outerwear', label: 'Верхняя одежда', icon: '👕' },
  { key: 'accessories', label: 'Аксессуары', icon: '🧦' },
];

const sizes = [
  '50',
  '60',
  '70',
  '80',
  '90',
  '100',
  '110',
  '120',
  '130',
  '140',
  '150',
  '160',
  '170',
  '180',
  '190',
  '200',
];
const seasons = ['Лето', 'Зима', 'Демисезон'];
const genders = ['Мальчик', 'Девочка', 'Унисекс'];

export const HomePage = () => {
  const featuredProducts = useFeaturedProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    size: [],
    age: [],
    season: [],
    gender: [],
    price: [],
  });

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  return (
    <div>
      {/* Hero Section */}
      <div
        className="text-white py-5 mb-5 text-center"
        style={{
          background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
        }}
      >
        <div className="container">
          <Title level={1} className="text-white mb-4">
            Оценивайте и обсуждайте детскую одежду вместе с нами
          </Title>
          <Text className="text-white fs-5 mb-4 d-block">
            Делитесь опытом и находите лучшие вещи для ваших детей
          </Text>
          <Row justify="center">
            <Col xs={24} md={12} lg={10}>
              <Input.Search
                placeholder="Поиск товаров..."
                enterButton="Найти"
                size="large"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={() => console.log('Search:', searchQuery)}
              />
            </Col>
          </Row>
        </div>
      </div>

      <div className="container mb-5">
        {/* Categories Section */}
        <Title level={4} className="mb-3">
          Категории
        </Title>
        <Row gutter={[16, 16]}>
          {categories.map((cat) => (
            <Col xs={12} sm={6} md={6} lg={3} key={cat.key}>
              <Card
                hoverable
                className="text-center py-3"
                style={{ borderRadius: '8px' }}
              >
                <div className="fs-3 mb-2">{cat.icon}</div>
                <Text>{cat.label}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <div className="container mb-5">
        {/* Filters Section */}
        <Title level={4} className="mb-3">
          Фильтры
        </Title>
        <Row gutter={[16, 16]} align="bottom">
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Размер"
              style={{ width: '100%' }}
              size="large"
              onChange={(value) => handleFilterChange('size', value)}
              options={sizes.map((s) => ({ value: s, label: s }))}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Возраст"
              style={{ width: '100%' }}
              size="large"
              onChange={(value) => handleFilterChange('age', value)}
              options={[
                { value: '0-1', label: '0-1 год' },
                { value: '1-3', label: '1-3 года' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Сезон"
              style={{ width: '100%' }}
              size="large"
              onChange={(value) => handleFilterChange('season', value)}
              options={seasons.map((s) => ({ value: s, label: s }))}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Пол ребенка"
              style={{ width: '100%' }}
              size="large"
              onChange={(value) => handleFilterChange('gender', value)}
              options={genders.map((g) => ({ value: g, label: g }))}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Цена"
              style={{ width: '100%' }}
              size="large"
              onChange={(value) => handleFilterChange('price', value)}
              options={[
                { value: '0-1000', label: 'До 1000 ₽' },
                { value: '1000-5000', label: '1000-5000 ₽' },
              ]}
            />
          </Col>
          <Col xs={24} sm={24} md={6}>
            <Button type="primary" size="large" block>
              Применить фильтры
            </Button>
          </Col>
        </Row>
      </div>

      {/* Popular Products Section */}
      <div className="container mb-5">
        <Title level={2} className="text-center mb-4">
          Популярные товары
        </Title>
        <Text type="secondary" className="d-block text-center mb-4">
          Товары с наивысшими оценками от наших пользователей
        </Text>
        <Row gutter={[24, 24]}>
          {featuredProducts.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={product.title}
                    src={product.image}
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
            </Col>
          ))}
        </Row>
        <div className="text-center mt-5">
          <Button type="primary" size="large">
            <Link to="/catalog" className="text-white text-decoration-none">
              Перейти в каталог
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
