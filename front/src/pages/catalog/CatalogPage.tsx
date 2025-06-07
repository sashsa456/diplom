import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Input,
  Slider,
  Checkbox,
  Space,
  Typography,
  Button,
  Drawer,
  Spin,
} from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useProducts } from '@/shared/api/hooks';

const { Title, Text } = Typography;

interface Product {
  id: number;
  title: string;
  image: string;
  price: string;
  category?: string;
  size?: string;
  color?: string;
  material?: string;
  season?: string;
}

interface Filters {
  category: string[];
  size: string[];
  color: string[];
  material: string[];
  season: string[];
  priceRange: number[];
}

// Mock data for filters
const categories = ['Комбинезоны', 'Куртки', 'Брюки', 'Футболки', 'Платья'];

const sizes = [
  '0-3 месяца',
  '3-6 месяцев',
  '6-12 месяцев',
  '1-2 года',
  '2-3 года',
];

const colors = ['Синий', 'Красный', 'Зеленый', 'Желтый', 'Черный'];

const materials = ['Хлопок', 'Шерсть', 'Синтетика', 'Джинс'];

const seasons = ['Лето', 'Зима', 'Демисезон'];

export const CatalogPage = () => {
  const [filters, setFilters] = useState<Filters>({
    category: [],
    size: [],
    color: [],
    material: [],
    season: [],
    priceRange: [0, 10000],
  });

  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: products, isLoading } = useProducts({
    search: searchQuery,
    category: filters.category.join(','),
  });

  const handleFilterChange = (
    filterType: keyof Filters,
    value: string[] | number[],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const FilterSection = ({
    title,
    options,
    filterType,
  }: {
    title: string;
    options: string[];
    filterType: keyof Filters;
  }) => (
    <div className="mb-4">
      <Title level={5}>{title}</Title>
      <Space direction="vertical">
        {options.map((option) => (
          <Checkbox
            key={option}
            checked={(filters[filterType] as string[]).includes(option)}
            onChange={(e) => {
              const newValues = e.target.checked
                ? [...(filters[filterType] as string[]), option]
                : (filters[filterType] as string[]).filter(
                    (item) => item !== option,
                  );
              handleFilterChange(filterType, newValues);
            }}
          >
            {option}
          </Checkbox>
        ))}
      </Space>
    </div>
  );

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Title level={2}>Каталог</Title>
        <Button
          type="primary"
          icon={<FilterOutlined />}
          onClick={() => setIsFilterDrawerVisible(true)}
        >
          Фильтры
        </Button>
      </div>

      <Input
        placeholder="Поиск товаров..."
        prefix={<SearchOutlined />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />

      {isLoading ? (
        <div className="text-center py-5">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {products?.map((product: Product) => (
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
      )}

      <Drawer
        title="Фильтры"
        placement="right"
        onClose={() => setIsFilterDrawerVisible(false)}
        open={isFilterDrawerVisible}
        width={300}
      >
        <div className="mb-4">
          <Title level={5}>Цена</Title>
          <Slider
            range
            value={filters.priceRange}
            onChange={(value) => handleFilterChange('priceRange', value)}
            min={0}
            max={10000}
          />
          <Text>
            {filters.priceRange[0]} ₽ - {filters.priceRange[1]} ₽
          </Text>
        </div>

        <FilterSection
          title="Категории"
          options={categories}
          filterType="category"
        />
        <FilterSection title="Размеры" options={sizes} filterType="size" />
        <FilterSection title="Цвета" options={colors} filterType="color" />
        <FilterSection
          title="Материалы"
          options={materials}
          filterType="material"
        />
        <FilterSection title="Сезоны" options={seasons} filterType="season" />
      </Drawer>
    </div>
  );
};
