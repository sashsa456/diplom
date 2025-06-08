import { Product, Filters } from '@/types/catalog';

export const useFilteredProducts = (
  products: Product[],
  filters: Filters,
  searchQuery: string,
) => {
  return products.filter((product: Product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      filters.category.length === 0 ||
      filters.category.includes(product.category);

    const matchesSize =
      filters.size.length === 0 ||
      product.size.some((s: string) => filters.size.includes(s));

    const matchesColor =
      filters.color.length === 0 || filters.color.includes(product.color);

    const matchesMaterial =
      filters.material.length === 0 ||
      filters.material.includes(product.material);

    const matchesSeason =
      filters.season.length === 0 || filters.season.includes(product.season);

    const matchesPrice =
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1];

    const matchesRating =
      filters.rating === 0 || product.rating >= filters.rating;

    const matchesGender =
      filters.gender.length === 0 || filters.gender.includes(product.gender);

    const matchesCountry =
      filters.country.length === 0 || filters.country.includes(product.country);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesSize &&
      matchesColor &&
      matchesMaterial &&
      matchesSeason &&
      matchesPrice &&
      matchesRating &&
      matchesGender &&
      matchesCountry
    );
  });
};
