import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage';

describe('NotFoundPage', () => {
  test('рендерит сообщение 404 и ссылку на главную страницу', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(
      screen.getByText('Извините, страница, которую вы ищете, не существует.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Вернуться на главную')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /вернуться на главную/i }),
    ).toHaveAttribute('href', '/');
  });
});
