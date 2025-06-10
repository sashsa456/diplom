import { Typography } from 'antd';

const { Title } = Typography;

export const CatalogHeader = () => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <Title level={2}>Каталог</Title>
    </div>
  );
};
