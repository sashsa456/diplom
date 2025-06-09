import { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Input,
  Slider,
  Typography,
  Button,
  Drawer,
  Rate,
  Pagination,
  Spin,
} from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Filters } from '../../types/catalog';
import { Product } from '@/shared/api/hooks';
import { FilterSection } from './components/FilterSection';
import { usePagination } from './hooks/usePagination';
import {
  categories,
  colors,
  countries,
  genders,
  materials,
  seasons,
  sizes,
} from './constants';
import { useProducts } from '@/shared/api/hooks';

const { Title, Text } = Typography;

const initialFilters: Filters = {
  category: [],
  size: [],
  color: [],
  material: [],
  season: [],
  priceRange: [0, 1000000],
  rating: 0,
  gender: [],
  country: [],
};

export const CatalogPage = () => {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useProducts({
    status: 'accepted',
  });

  const handleFilterChange = (
    filterType: keyof Filters,
    value: string[] | number | [number, number],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const filteredProducts: Product[] = products || []; // Явно указываем тип Product[]

  const { currentPage, setCurrentPage, getPaginatedItems, getTotalPages } =
    usePagination(16);

  const paginatedProducts = getPaginatedItems(filteredProducts);
  const totalPages = getTotalPages(filteredProducts.length);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spin fullscreen size="large" tip="Загрузка товаров..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-5">
        <Title level={3} type="danger">
          Ошибка загрузки товаров
        </Title>
        <Text>{error?.message || 'Произошла ошибка при загрузке данных.'}</Text>
      </div>
    );
  }

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

      <Row gutter={[24, 24]}>
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={product.title}
                    src={`http://localhost:3001/api${product.image}`}
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
          ))
        ) : (
          <Col span={24}>
            <div className="text-center py-5">
              <Text>Продукты не найдены по вашим критериям.</Text>
            </div>
          </Col>
        )}
      </Row>

      {totalPages > 1 && (
        <div className="text-center mt-4">
          <Pagination
            current={currentPage}
            total={filteredProducts.length}
            pageSize={16}
            onChange={setCurrentPage}
            showSizeChanger={false}
          />
        </div>
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
            onChange={(value) =>
              handleFilterChange('priceRange', value as [number, number])
            }
            min={0}
            max={1000000}
            step={100}
          />
          <Text>
            {filters.priceRange[0]} ₽ - {filters.priceRange[1]} ₽
          </Text>
        </div>

        <FilterSection
          title="Рейтинг"
          options={[5, 4, 3, 2, 1]}
          filterType="rating"
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <FilterSection
          title="Пол"
          options={genders}
          filterType="gender"
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <FilterSection
          title="Страна"
          options={countries}
          filterType="country"
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <FilterSection
          title="Категории"
          options={categories}
          filterType="category"
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <FilterSection
          title="Размеры"
          options={sizes}
          filterType="size"
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <FilterSection
          title="Цвета"
          options={colors}
          filterType="color"
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <FilterSection
          title="Материалы"
          options={materials}
          filterType="material"
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <FilterSection
          title="Сезоны"
          options={seasons}
          filterType="season"
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <Button type="default" block onClick={() => setFilters(initialFilters)}>
          Сбросить все фильтры
        </Button>
      </Drawer>
    </div>
  );
};
