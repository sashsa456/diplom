import { Typography } from 'antd';

const { Title, Text } = Typography;

interface CatalogErrorProps {
  error: Error | null;
}

export const CatalogError = ({ error }: CatalogErrorProps) => {
  return (
    <div className="text-center py-5">
      <Title level={3} type="danger">
        Ошибка загрузки товаров
      </Title>
      <Text>{error?.message || 'Произошла ошибка при загрузке данных.'}</Text>
    </div>
  );
};
