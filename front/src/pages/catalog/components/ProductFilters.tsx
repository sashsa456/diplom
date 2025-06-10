import { useEffect, useState } from 'react';
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
import { useSearchParams } from 'react-router-dom';
import { Filters, FilterSectionProps } from '@/types/catalog';
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
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onApplySearch: (query: string) => void;
  isFilterDrawerVisible: boolean;
  setIsFilterDrawerVisible: React.Dispatch<React.SetStateAction<boolean>>;
  currentSearchQuery: string;
}

// Inline FilterSection component (as it will be removed later)
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
  filters,
  setFilters,
  onApplySearch,
  isFilterDrawerVisible,
  setIsFilterDrawerVisible,
  currentSearchQuery,
}: ProductFiltersProps) => {
  const [searchParams] = useSearchParams();
  const [tempSearchQuery, setTempSearchQuery] = useState(currentSearchQuery);

  useEffect(() => {
    setTempSearchQuery(searchParams.get('search') || '');
    setFilters(() => {
      const initialCategory = searchParams.get('category');
      const initialSize = searchParams.get('size');
      const initialColor = searchParams.get('color');
      const initialMaterial = searchParams.get('material');
      const initialSeason = searchParams.get('season');
      const initialGender = searchParams.get('gender');
      const initialCountry = searchParams.get('countryMade');
      const initialPrice = searchParams.get('price');
      const initialRating = searchParams.get('rating');

      return {
        ...initialFilters,
        category: initialCategory ? initialCategory.split(',') : [],
        size: initialSize ? initialSize.split(',') : [],
        color: initialColor ? initialColor.split(',') : [],
        material: initialMaterial ? initialMaterial.split(',') : [],
        season: initialSeason ? initialSeason.split(',') : [],
        gender: initialGender ? initialGender.split(',') : [],
        country: initialCountry ? initialCountry.split(',') : [],
        priceRange: initialPrice
          ? (initialPrice.split('-').map(Number) as [number, number])
          : [0, 1000000],
        rating: initialRating ? Number(initialRating) : 0,
      };
    });
  }, [searchParams]);

  useEffect(() => {
    setTempSearchQuery(currentSearchQuery);
  }, [currentSearchQuery]);

  const handleFilterChange = (
    filterType: keyof Filters,
    value: string[] | number | [number, number],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    onApplySearch('');
  };

  const handleSearchSubmit = () => {
    onApplySearch(tempSearchQuery);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
      <Input
        placeholder="Поиск товаров..."
        prefix={<SearchOutlined />}
        value={tempSearchQuery}
        onChange={(e) => setTempSearchQuery(e.target.value)}
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
            step={100}
          />
          <Text>
            {filters.priceRange[0]} ₽ - {filters.priceRange[1]} ₽
          </Text>
        </div>

        <FilterSection
          title="Рейтинг"
          options={[
            { value: 1, label: 1 },
            { value: 2, label: 2 },
            { value: 3, label: 3 },
            { value: 4, label: 4 },
            { value: 5, label: 5 },
          ]}
          filterType="rating"
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <FilterSection
          title="Пол"
          options={PRODUCT_GENDERS.map((gender) => ({
            value: gender.value,
            label: gender.label,
          }))}
          filterType="gender"
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <FilterSection
          title="Страна"
          options={PRODUCT_COUNTRIES.map((country) => ({
            value: country.value,
            label: country.label,
          }))}
          filterType="country"
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <FilterSection
          title="Категории"
          options={PRODUCT_CATEGORIES.map((category) => ({
            value: category.value,
            label: category.label,
          }))}
          filterType="category"
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <FilterSection
          title="Размеры"
          options={PRODUCT_SIZES.map((size) => ({
            value: size.value,
            label: size.label,
          }))}
          filterType="size"
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <FilterSection
          title="Цвета"
          options={PRODUCT_COLORS.map((color) => ({
            value: color.value,
            label: color.label,
          }))}
          filterType="color"
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <FilterSection
          title="Материалы"
          options={PRODUCT_MATERIALS.map((material) => ({
            value: material.value,
            label: material.label,
          }))}
          filterType="material"
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <FilterSection
          title="Сезоны"
          options={PRODUCT_SEASONS.map((season) => ({
            value: season.value,
            label: season.label,
          }))}
          filterType="season"
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <Button type="default" block onClick={handleResetFilters}>
          Сбросить все фильтры
        </Button>
      </Drawer>
    </div>
  );
};
