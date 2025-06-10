import { useState } from 'react';
import {
  Slider,
  Typography,
  Button,
  Drawer,
  Input,
  Rate,
  Space,
  Checkbox,
} from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Filters, FilterSectionProps, Category } from '@/types/catalog';
import {
  PRODUCT_CATEGORIES,
  PRODUCT_COLORS,
  PRODUCT_COUNTRIES,
  PRODUCT_GENDERS,
  PRODUCT_MATERIALS,
  PRODUCT_SEASONS,
  PRODUCT_SIZES,
} from '@/shared/constants/product';

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

interface ProductFiltersProps {
  isFilterDrawerVisible: boolean;
  setIsFilterDrawerVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterSection = ({
  title,
  options,
  filterType,
  filters,
  onFilterChange,
}: FilterSectionProps) => (
  <div className="mb-4">
    <Title level={5}>{title}</Title>
    <Space direction="vertical">
      {options.map((option) => (
        <Checkbox
          key={option.value.toString()}
          checked={
            filterType === 'rating'
              ? filters[filterType] === option.value
              : (filters[filterType] as (string | number)[]).includes(
                  option.value.toString(),
                )
          }
          onChange={(e) => {
            if (filterType === 'rating') {
              onFilterChange(
                filterType,
                e.target.checked ? (option.value as number) : 0,
              );
            } else {
              const newValues = e.target.checked
                ? [
                    ...(filters[filterType] as string[]),
                    option.value.toString(),
                  ]
                : (filters[filterType] as string[]).filter(
                    (item) => item !== option.value.toString(),
                  );
              onFilterChange(filterType, newValues);
            }
          }}
        >
          {filterType === 'rating' ? (
            <Rate disabled defaultValue={option.value as number} count={5} />
          ) : (
            option.label
          )}
        </Checkbox>
      ))}
    </Space>
  </div>
);

export const ProductFilters = ({
  isFilterDrawerVisible,
  setIsFilterDrawerVisible,
}: ProductFiltersProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(() => {
    const initialCategory = searchParams.get('category');
    const initialSize = searchParams.get('size');
    const initialColor = searchParams.get('color');
    const initialMaterial = searchParams.get('material');
    const initialSeason = searchParams.get('season');
    const initialGender = searchParams.get('gender');
    const initialCountry = searchParams.get('countryMade');
    const initialMinPrice = searchParams.get('maxPrice');
    const initialMaxPrice = searchParams.get('minPrice');
    const initialRating = searchParams.get('rating');

    const validCategories = PRODUCT_CATEGORIES.map((cat) => cat.value);
    const categories = initialCategory ? initialCategory.split(',') : [];
    const filteredCategories = categories.filter((cat) =>
      validCategories.includes(cat as Category),
    ) as Category[];

    return {
      ...initialFilters,
      category: filteredCategories,
      size: initialSize ? initialSize.split(',') : [],
      color: initialColor ? initialColor.split(',') : [],
      material: initialMaterial ? initialMaterial.split(',') : [],
      season: initialSeason ? initialSeason.split(',') : [],
      gender: initialGender ? initialGender.split(',') : [],
      country: initialCountry ? initialCountry.split(',') : [],
      priceRange:
        initialMinPrice && initialMaxPrice
          ? [Number(initialMinPrice), Number(initialMaxPrice)]
          : [0, 1000000],
      rating: initialRating ? Number(initialRating) : 0,
    };
  });
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('query') || '',
  );

  const updateSearchParams = (
    currentFilters: Filters,
    currentSearchQuery: string,
  ) => {
    const params = new URLSearchParams();

    if (currentSearchQuery) {
      params.set('query', currentSearchQuery);
    }

    currentFilters.category.forEach((item) => {
      params.append('category', item);
    });
    currentFilters.size.forEach((item) => {
      params.append('size', item);
    });
    currentFilters.color.forEach((item) => {
      params.append('color', item);
    });
    currentFilters.material.forEach((item) => {
      params.append('material', item);
    });
    currentFilters.season.forEach((item) => {
      params.append('season', item);
    });
    currentFilters.gender.forEach((item) => {
      params.append('gender', item);
    });
    currentFilters.country.forEach((item) => {
      params.append('countryMade', item);
    });

    if (
      currentFilters.priceRange[0] !== 0 ||
      currentFilters.priceRange[1] !== 1000000
    ) {
      params.set('minPrice', currentFilters.priceRange[0].toString());

      params.set('maxPrice', currentFilters.priceRange[1].toString());
    }
    if (currentFilters.rating !== 0) {
      params.set('rating', currentFilters.rating.toString());
    }

    navigate({ search: params.toString() }, { replace: true });
  };

  const handleFilterChange = (
    filterType: keyof Filters,
    value: string[] | number | [number, number],
  ) => {
    setFilters((prev) => {
      const updatedFilters = {
        ...prev,
        [filterType]: value,
      };

      if (filterType === 'category' && Array.isArray(value)) {
        const validCategories = PRODUCT_CATEGORIES.map((cat) => cat.value);
        const filteredCategories = value.filter((cat) =>
          validCategories.includes(cat as Category),
        ) as Category[];
        updatedFilters.category = filteredCategories;
      }

      if (filterType === 'priceRange') {
        const [minPrice, maxPrice] = value as [number, number];
        updatedFilters.priceRange = [minPrice, maxPrice];
      }

      updateSearchParams(updatedFilters, searchQuery);
      return updatedFilters;
    });
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setSearchQuery('');
    updateSearchParams(initialFilters, '');
  };

  const handleSearchSubmit = () => {
    updateSearchParams(filters, searchQuery);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
      <Input
        placeholder="Поиск товаров..."
        prefix={<SearchOutlined />}
        value={searchQuery}
        allowClear
        onClear={() => {
          setSearchQuery('');
          updateSearchParams(filters, '');
        }}
        onChange={(e) => setSearchQuery(e.target.value)}
        onPressEnter={handleSearchSubmit}
        className="mb-4"
      />
      <Button
        type="primary"
        icon={<SearchOutlined />}
        onClick={handleSearchSubmit}
      >
        Поиск
      </Button>

      <Button
        type="primary"
        icon={<FilterOutlined />}
        onClick={() => setIsFilterDrawerVisible(true)}
      >
        Фильтры
      </Button>

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
            step={1000}
            tooltip={{ formatter: (value) => `${value} ₽` }}
          />
          <Space>
            <Text>{filters.priceRange[0]} ₽</Text>
            <Text>-</Text>
            <Text>{filters.priceRange[1]} ₽</Text>
          </Space>
        </div>

        <FilterSection
          title="Категория"
          options={PRODUCT_CATEGORIES}
          filterType="category"
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <FilterSection
          title="Размер"
          options={PRODUCT_SIZES}
          filterType="size"
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <FilterSection
          title="Цвет"
          options={PRODUCT_COLORS}
          filterType="color"
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <FilterSection
          title="Материал"
          options={PRODUCT_MATERIALS}
          filterType="material"
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <FilterSection
          title="Сезон"
          options={PRODUCT_SEASONS}
          filterType="season"
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <FilterSection
          title="Пол"
          options={PRODUCT_GENDERS}
          filterType="gender"
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <FilterSection
          title="Страна"
          options={PRODUCT_COUNTRIES}
          filterType="country"
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <FilterSection
          title="Рейтинг"
          options={[1, 2, 3, 4, 5].map((num) => ({
            label: `От ${num} звезд`,
            value: num,
          }))}
          filterType="rating"
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <Button onClick={handleResetFilters} block className="mt-4">
          Сбросить фильтры
        </Button>
      </Drawer>
    </div>
  );
};
