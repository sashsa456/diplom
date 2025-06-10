import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProductPage } from './ProductPage';
import { useProduct, useReviews } from '@/shared/api/hooks';

jest.mock('@/shared/api/hooks', () => ({
  useProduct: jest.fn(),
  useReviews: jest.fn(),
}));

describe('ProductPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('показывает спиннер во время загрузки', () => {
    (useProduct as jest.Mock).mockReturnValue({
      isLoading: true,
      data: null,
      error: null,
    });

    (useReviews as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={['/product/1']}>
        <Routes>
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Загрузка товара...')).toBeInTheDocument();
  });

  test('показывает сообщение, если товар не найден', () => {
    (useProduct as jest.Mock).mockReturnValue({
      isLoading: false,
      data: null,
      error: null,
    });

    (useReviews as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={['/product/1']}>
        <Routes>
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Товар не найден')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Возможно, товар был удален или никогда не существовал.',
      ),
    ).toBeInTheDocument();
  });

  test('показывает сообщение, если товар отклонен', () => {
    const rejectionReason = 'Несоответствие требованиям';
    (useProduct as jest.Mock).mockReturnValue({
      isLoading: false,
      data: {
        id: 1,
        title: 'Тестовый товар',
        status: 'rejected',
        rejectionReason,
      },
      error: null,
    });

    (useReviews as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={['/product/1']}>
        <Routes>
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Товар отклонен')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Этот товар был отклонен модератором и недоступен для просмотра.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Причина отклонения: ${rejectionReason}`),
    ).toBeInTheDocument();
  });

  test('отображает информацию о товаре при успешной загрузке', () => {
    const mockProduct = {
      id: 1,
      title: 'Тестовый товар',
      image: '/images/test.jpg',
      price: 1000,
      description: 'Описание товара',
      status: 'approved',
      category: 'Верхняя одежда',
      size: 'S',
      colors: ['Красный'],
      material: 'Хлопок',
      season: 'Лето',
      rating: 4.5,
      gender: 'Мужское',
      countryMade: 'Россия',
    };

    const mockReviews = [
      {
        id: 1,
        rating: 5,
        comment: 'Отличный товар!',
      },
    ];

    (useProduct as jest.Mock).mockReturnValue({
      isLoading: false,
      data: mockProduct,
      error: null,
    });

    (useReviews as jest.Mock).mockReturnValue({
      data: mockReviews,
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={['/product/1']}>
        <Routes>
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText('1000 ₽')).toBeInTheDocument();
    expect(screen.getByAltText(mockProduct.title)).toHaveAttribute(
      'src',
      `http://localhost:3001/api${mockProduct.image}`,
    );
  });
});
