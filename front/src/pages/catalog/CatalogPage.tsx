import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from '@/shared/api/hooks';
import { usePagination } from './hooks/usePagination';
import { ProductFilters } from './components/ProductFilters';
import { useProducts } from '@/shared/api/hooks';
import { CatalogHeader } from './components/CatalogHeader';
import { ProductGrid } from './components/ProductGrid';
import { CatalogPagination } from './components/CatalogPagination';
import { CatalogLoader } from './components/CatalogLoader';
import { CatalogError } from './components/CatalogError';

export const CatalogPage = () => {
  const [searchParams] = useSearchParams('?query=%');
  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);

  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
  } = useProducts(searchParams);

  const { currentPage, setCurrentPage, getPaginatedItems } = usePagination(16);
  const paginatedProducts: Product[] = getPaginatedItems(products || []);

  useEffect(() => {
    refetch();
  }, [searchParams]);

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
