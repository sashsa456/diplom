export interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
  category: string;
  size: string[];
  color: string;
  material: string;
  season: string;
  rating: number;
  gender: string;
  country: string;
  description?: string;
  characteristics?: Record<string, string>;
}

export interface Filters {
  category: string[];
  size: string[];
  color: string[];
  material: string[];
  season: string[];
  priceRange: [number, number];
  rating: number;
  gender: string[];
  country: string[];
}

export interface FilterSectionProps {
  title: string;
  options: string[] | number[];
  filterType: keyof Filters;
  filters: Filters;
  onFilterChange: (
    filterType: keyof Filters,
    value: string[] | number | [number, number],
  ) => void;
}
