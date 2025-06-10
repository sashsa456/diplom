import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import type { Product } from '@/shared/api/hooks';

const mockProduct: Product = {
  id: 1,
  title: 'Тестовый товар',
  image: '/images/test-product.jpg',
  price: 999,
  category: 'Верхняя одежда',
  size: 'S',
  colors: ['Красный'],
  material: 'Хлопок',
  season: 'Лето',
  rating: 4.5,
  gender: 'Мужское',
  countryMade: 'Россия',
  description: 'Описание тестового товара',
  status: 'approved',
};

describe('ProductCard', () => {
  test('рендерится с корректной информацией о товаре', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>,
    );

    expect(screen.getByText('Тестовый товар')).toBeInTheDocument();
    expect(screen.getByText('999 ₽')).toBeInTheDocument();
    expect(screen.getByAltText('Тестовый товар')).toHaveAttribute(
      'src',
      'http://localhost:3001/api/images/test-product.jpg',
    );
    expect(screen.getByText('(4.5)')).toBeInTheDocument();
  });

  test('ссылка "Подробнее" ведет на страницу товара', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>,
    );

    const link = screen.getByRole('link', { name: /подробнее/i });
    expect(link).toHaveAttribute('href', '/product/1');
  });

  test('кнопка "Подробнее" присутствует', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>,
    );

    expect(
      screen.getByRole('button', { name: /подробнее/i }),
    ).toBeInTheDocument();
  });
});
