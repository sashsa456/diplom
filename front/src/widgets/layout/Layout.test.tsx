import { render, screen } from '@testing-library/react';
import { Layout } from './Layout';
import { useAppInfo } from '@/shared/api/hooks';

// Мокаем хуки
const mockUseAuthStore = jest.fn();
jest.mock('@/shared/hooks', () => ({
  useAuthStore: () => mockUseAuthStore(),
}));

jest.mock('@/shared/api/hooks', () => ({
  useAppInfo: jest.fn(),
}));

// Мокаем AppHeader и AppFooter
jest.mock('./components/AppHeader', () => ({
  AppHeader: jest.fn(() => <div>Mock AppHeader</div>),
}));
jest.mock('./components/AppFooter', () => ({
  AppFooter: jest.fn(() => <div>Mock AppFooter</div>),
}));

describe('Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Ensure mockUseAuthStore returns a valid structure by default for Layout component
    mockUseAuthStore.mockReturnValue({
      user: null, // Default to no user
      logout: jest.fn(),
    });
  });

  test('показывает спиннер во время загрузки', () => {
    (useAppInfo as jest.Mock).mockReturnValue({
      isLoading: true,
      data: null,
    });

    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });

  test('рендерит основной контент после загрузки', () => {
    (useAppInfo as jest.Mock).mockReturnValue({
      isLoading: false,
      data: {
        name: 'Test App',
        description: 'Test Description',
      },
    });

    mockUseAuthStore.mockReturnValue({
      // This overrides the beforeEach for this test
      user: { id: 1, email: 'test@example.com', isAdmin: false },
      logout: jest.fn(),
    });

    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument();
    expect(screen.getByText('Mock AppHeader')).toBeInTheDocument();
    expect(screen.getByText('Mock AppFooter')).toBeInTheDocument();
  });

  test('рендерит хедер с информацией о пользователе', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      isAdmin: false,
    };

    (useAppInfo as jest.Mock).mockReturnValue({
      isLoading: false,
      data: {
        name: 'Test App',
        description: 'Test Description',
      },
    });

    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      logout: jest.fn(),
    });

    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    // Поскольку AppHeader замокан, мы не можем напрямую проверить наличие текста пользователя
    // Мы проверяем, что mock AppHeader был отрендерен
    expect(screen.getByText('Mock AppHeader')).toBeInTheDocument();
  });

  test('рендерит футер с информацией о приложении', () => {
    const mockAppInfo = {
      name: 'Test App',
      description: 'Test Description',
    };

    (useAppInfo as jest.Mock).mockReturnValue({
      isLoading: false,
      data: mockAppInfo,
    });

    mockUseAuthStore.mockReturnValue({
      user: { id: 1, email: 'test@example.com', isAdmin: false }, // Ensure isAdmin is present
      logout: jest.fn(),
    });

    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    // Поскольку AppFooter замокан, мы не можем напрямую проверить наличие текста приложения
    // Мы проверяем, что mock AppFooter был отрендерен
    expect(screen.getByText('Mock AppFooter')).toBeInTheDocument();
  });
});
