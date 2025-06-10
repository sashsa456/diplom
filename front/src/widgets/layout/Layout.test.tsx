import { render, screen } from '@testing-library/react';
import { Layout } from './Layout';
import { useAppInfo } from '@/shared/api/hooks';

const mockUseAuthStore = jest.fn();
jest.mock('@/shared/hooks', () => ({
  useAuthStore: () => mockUseAuthStore(),
}));

jest.mock('@/shared/api/hooks', () => ({
  useAppInfo: jest.fn(),
}));

jest.mock('./components/AppHeader', () => ({
  AppHeader: jest.fn(() => <div>Mock AppHeader</div>),
}));
jest.mock('./components/AppFooter', () => ({
  AppFooter: jest.fn(() => <div>Mock AppFooter</div>),
}));

describe('Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthStore.mockReturnValue({
      user: null,
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
      user: { id: 1, email: 'test@example.com', isAdmin: false },
      logout: jest.fn(),
    });

    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    expect(screen.getByText('Mock AppFooter')).toBeInTheDocument();
  });
});
