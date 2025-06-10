import { Spin } from 'antd';

export const CatalogLoader = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Spin fullscreen size="large" tip="Загрузка товаров..." />
    </div>
  );
};
