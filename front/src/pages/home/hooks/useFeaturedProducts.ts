// TODO: Переехать с моков
import { Product } from '@/types/catalog';
import { mockProducts } from '@/pages/catalog/constants';

export const useFeaturedProducts = (): Product[] => {
  return mockProducts.filter((product) => product.rating === 5).slice(0, 6);
};
