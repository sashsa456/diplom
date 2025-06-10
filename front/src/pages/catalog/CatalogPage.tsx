import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filters } from '../../types/catalog';
import { Product } from '@/shared/api/hooks';
import { usePagination } from './hooks/usePagination';
import { ProductFilters } from './components/ProductFilters';

import { useProducts } from '@/shared/api/hooks';
import { CatalogHeader } from './components/CatalogHeader';
import { ProductGrid } from './components/ProductGrid';
import { CatalogPagination } from './components/CatalogPagination';
import { CatalogLoader } from './components/CatalogLoader';
import { CatalogError } from './components/CatalogError';

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
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState<Filters>(() => {
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

  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || '',
  );

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setFilters((prev) => {
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
        ...prev,
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

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useProducts({
    status: 'accepted',
    query: searchQuery,
    category:
      filters.category.length > 0 ? filters.category.join(',') : undefined,
    size: filters.size.length > 0 ? filters.size.join(',') : undefined,
    color: filters.color.length > 0 ? filters.color.join(',') : undefined,
    material:
      filters.material.length > 0 ? filters.material.join(',') : undefined,
    season: filters.season.length > 0 ? filters.season.join(',') : undefined,
    gender: filters.gender.length > 0 ? filters.gender.join(',') : undefined,
    countryMade:
      filters.country.length > 0 ? filters.country.join(',') : undefined,
    price:
      filters.priceRange[0] === 0 && filters.priceRange[1] === 1000000
        ? undefined
        : `${filters.priceRange[0]}-${filters.priceRange[1]}`,
    rating: filters.rating === 0 ? undefined : filters.rating,
  });

  const { currentPage, setCurrentPage, getPaginatedItems } = usePagination(16);

  const paginatedProducts: Product[] = getPaginatedItems(products || []);

  if (isLoading) {
    return <CatalogLoader />;
  }

  if (isError) {
    return <CatalogError error={error} />;
  }

  return (
    <div className="container">
      <CatalogHeader />
      <ProductFilters
        filters={filters}
        setFilters={setFilters}
        onApplySearch={setSearchQuery}
        currentSearchQuery={searchQuery}
        isFilterDrawerVisible={isFilterDrawerVisible}
        setIsFilterDrawerVisible={setIsFilterDrawerVisible}
      />
      <ProductGrid paginatedProducts={paginatedProducts} />
      <CatalogPagination
        currentPage={currentPage}
        total={products?.length || 0}
        pageSize={16}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
