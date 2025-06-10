import {
  PRODUCT_CATEGORIES,
  PRODUCT_SIZES,
  PRODUCT_COLORS,
  PRODUCT_MATERIALS,
  PRODUCT_SEASONS,
  PRODUCT_GENDERS,
  PRODUCT_COUNTRIES,
} from '@/shared/constants/product';

export type Category = (typeof PRODUCT_CATEGORIES)[number]['value'];
export type Size = (typeof PRODUCT_SIZES)[number]['value'];
export type Color = (typeof PRODUCT_COLORS)[number]['value'];
export type Material = (typeof PRODUCT_MATERIALS)[number]['value'];
export type Season = (typeof PRODUCT_SEASONS)[number]['value'];
export type Gender = (typeof PRODUCT_GENDERS)[number]['value'];
export type Country = (typeof PRODUCT_COUNTRIES)[number]['value'];

export interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
  category: Category;
  size: Size;
  colors: Color[];
  material: Material;
  season: Season;
  rating: number;
  gender: Gender;
  countryMade: Country;
  description?: string;
  characteristics?: Record<string, string>;
}

export interface Filters {
  category: Category[];
  size: Size[];
  color: Color[];
  material: Material[];
  season: Season[];
  priceRange: [number, number];
  rating: number;
  gender: Gender[];
  country: Country[];
}

export interface FilterOption {
  label: string;
  value: string | number;
}

export interface FilterSectionProps {
  title: string;
  options: readonly FilterOption[];
  filterType: keyof Filters;
  filters: Filters;
  onFilterChange: (
    filterType: keyof Filters,
    value: string[] | number | [number, number],
  ) => void;
}
