import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Извините, страница, которую вы ищете, не существует."
      extra={
        <Button type="primary">
          <Link to="/" className="text-white text-decoration-none">
            Вернуться на главную
          </Link>
        </Button>
      }
    />
  );
};
