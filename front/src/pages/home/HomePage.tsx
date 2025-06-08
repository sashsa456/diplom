import { useState } from 'react';
import { Typography, Row, Col, Card, Button, Rate, Select, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { useProducts, Product } from '@/shared/api/hooks';
import {
  PRODUCT_SIZES,
  PRODUCT_GENDERS,
  PRODUCT_SEASONS,
} from '@/shared/constants/product';
import styles from './HomePage.module.css';

const { Title, Text } = Typography;

interface CategoryItem {
  key: string;
  label: string;
  icon: string;
}

const categories: CategoryItem[] = [
  { key: 'Верхняя одежда', label: 'Верхняя одежда', icon: '👕' },
  { key: 'Нижнее белье', label: 'Нижнее белье', icon: '🩲' },
  { key: 'Одежда для сна', label: 'Одежда для сна', icon: '😴' },
  { key: 'Головные уборы', label: 'Головные уборы', icon: '🧢' },
  { key: 'Носки', label: 'Носки', icon: '🧦' },
  { key: 'Обувь', label: 'Обувь', icon: '👟' },
  {
    key: 'Одежда для новорожденных',
    label: 'Одежда для новорожденных',
    icon: '👶',
  },
  {
    key: 'Одежда для особых случаев',
    label: 'Одежда для особых случаев',
    icon: '👗',
  },
];

const sizes = PRODUCT_SIZES;
const seasons = PRODUCT_SEASONS;
const genders = PRODUCT_GENDERS;

export const HomePage = () => {
  const { data: allProducts, isLoading, error } = useProducts();
  const [filters, setFilters] = useState({
    size: [] as string[],
    age: [] as string[],
    season: [] as string[],
    gender: [] as string[],
    price: [] as string[],
  });

  type FilterValue = string | string[];
  const handleFilterChange = (filterType: string, value: FilterValue) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const featuredProducts = (allProducts || [])
    .filter((product: Product) => product.rating === 5)
    .slice(0, 6);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spin fullscreen size="large" tip="Загрузка товаров..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <Title level={3} type="danger">
          Ошибка загрузки товаров
        </Title>
        <Text>{error?.message || 'Не удалось загрузить товары'}</Text>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className="container">
          <Title level={1} className="text-white mb-4">
            Оценивайте и обсуждайте детскую одежду вместе с нами
          </Title>
          <Text className="text-white fs-5 mb-4 d-block">
            Делитесь опытом и находите лучшие вещи для ваших детей
          </Text>
          <Row justify="center">
            <Col xs={24} md={12} lg={10}>
              <Button type="primary" size="large">
                <Link to="/catalog" className="text-white text-decoration-none">
                  Перейти в каталог
                </Link>
              </Button>
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
              <Card hoverable className={styles.categoryCard}>
                <div className={styles.categoryIcon}>{cat.icon}</div>
                <Text className={styles.categoryText}>{cat.label}</Text>
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
              allowClear
              placeholder="Размер"
              style={{ width: '100%' }}
              size="large"
              onChange={(value) => handleFilterChange('size', value)}
              options={sizes}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              allowClear
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
              allowClear
              placeholder="Сезон"
              style={{ width: '100%' }}
              size="large"
              onChange={(value) => handleFilterChange('season', value)}
              options={seasons}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              allowClear
              placeholder="Пол ребенка"
              style={{ width: '100%' }}
              size="large"
              onChange={(value) => handleFilterChange('gender', value)}
              options={genders}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              allowClear
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
        {featuredProducts.length === 0 ? (
          <div className="text-center py-4">
            <Text type="secondary">
              На данный момент популярных товаров нет.
            </Text>
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {featuredProducts.map((product: Product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={product.title}
                      src={`http://localhost:3001/api${product.image}`}
                      className={styles.productImage}
                    />
                  }
                >
                  <Card.Meta
                    title={product.title}
                    description={
                      <>
                        <Text strong>{product.price} ₽</Text>
                        <br />
                        <Rate
                          allowHalf
                          disabled
                          defaultValue={product.rating}
                        />
                        <Text type="secondary" className={styles.productRating}>
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
        )}
      </div>
    </div>
  );
};
