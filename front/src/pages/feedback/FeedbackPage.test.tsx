import { render, screen } from '@testing-library/react';
import { FeedbackPage } from './FeedbackPage';
import { useAppInfo } from '@/shared/api/hooks';

jest.mock('@/shared/api/hooks', () => ({
  useAppInfo: jest.fn(),
}));

jest.mock('./components/FeedbackForm', () => ({
  FeedbackForm: jest.fn(() => <div>Mock FeedbackForm</div>),
}));

describe('FeedbackPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppInfo as jest.Mock).mockReturnValue({
      isLoading: false,
      data: {
        name: 'Test App',
        contactEmail: 'test@example.com',
        contactPhone: '+1234567890',
      },
    });
  });

  test('рендерит заголовок и описание', () => {
    render(<FeedbackPage />);

    expect(screen.getByText('Обратная связь')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Мы всегда рады услышать ваше мнение и ответить на ваши вопросы',
      ),
    ).toBeInTheDocument();
  });

  test('рендерит компонент FeedbackForm', () => {
    render(<FeedbackPage />);

    expect(screen.getByText('Mock FeedbackForm')).toBeInTheDocument();
  });

  test('рендерит контактную информацию', () => {
    render(<FeedbackPage />);

    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Телефон:')).toBeInTheDocument();
    expect(screen.getByText('+1234567890')).toBeInTheDocument();
    expect(screen.getByText('Адрес:')).toBeInTheDocument();
    expect(
      screen.getByText('г. Москва, ул. Примерная, д. 123'),
    ).toBeInTheDocument();
  });
});
