import { useState } from 'react';
import { Tabs, Typography, Row, Col } from 'antd';
import {
  useProducts,
  useUsers,
  useFeedbacks,
  Product,
} from '@/shared/api/hooks';
import { UsersTab } from './components/UsersTab';
import { ProductsTab } from './components/ProductsTab';
import { SettingsTab } from './components/SettingsTab';
import { FeedbackTab } from './components/FeedbackTab';

const { Title, Text } = Typography;

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('1');
  const { data: products } = useProducts();
  const { data: users } = useUsers();
  const { data: feedbacks } = useFeedbacks();

  const pendingProducts =
    products?.filter((product: Product) => product.status === 'pending') || [];

  const items = [
    {
      key: '1',
      label: 'Пользователи',
      children: <UsersTab />,
    },
    {
      key: '2',
      label: 'Товары',
      children: <ProductsTab />,
    },
    {
      key: '3',
      label: 'Настройки',
      children: <SettingsTab />,
    },
    {
      key: '4',
      label: 'Обратная связь',
      children: <FeedbackTab />,
    },
  ];

  return (
    <div className="container py-4">
      <Row justify="space-between" align="middle" className="mb-4">
        <Col>
          <Title level={2} className="mb-0">
            Панель администратора
          </Title>
        </Col>
        <Col>
          <Text type="secondary">
            Пользователей: {users?.length || 0} Товаров на модерации:{' '}
            {pendingProducts.length} Обращений: {feedbacks?.length || 0}
          </Text>
        </Col>
      </Row>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </div>
  );
};
