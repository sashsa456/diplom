import { useState } from 'react';
import {
  Card,
  Tabs,
  Typography,
  Row,
  Col,
  Table,
  Button,
  Input,
  Space,
  Form,
  message,
  Spin,
  Modal,
} from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import {
  useProducts,
  useUpdateProductStatus,
  Product,
  useUsers,
  useUpdateUserAdminStatus,
} from '@/shared/api/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/client';

const { Title, Text } = Typography;

// Интерфейс для feedback
interface Feedback {
  id: number;
  name: string;
  email: string;
  theme: string;
  status: string;
  dateRegistered: string;
  message: string;
}

// Моковые данные для feedback
const mockFeedbacks: Feedback[] = [
  {
    id: 1,
    name: 'Анна',
    email: 'anna@example.com',
    theme: 'Ошибка на сайте',
    status: 'Новый',
    dateRegistered: '01.06.2025',
    message: 'При оформлении заказа возникла ошибка',
  },
  {
    id: 2,
    name: 'Иван',
    email: 'ivan@example.com',
    theme: 'Предложение по улучшению',
    status: 'Обработан',
    dateRegistered: '02.06.2025',
    message: 'Добавьте возможность фильтрации по размеру',
  },
];

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [siteName, setSiteName] = useState('KidsFashion');
  const [contactEmail, setContactEmail] = useState('info@kidsfashion.ru');
  const queryClient = useQueryClient();

  const { data: products, isLoading: isProductsLoading } = useProducts();
  const { data: users, isLoading: isUsersLoading } = useUsers();
  const updateProductStatusMutation = useUpdateProductStatus();
  const updateUserAdminStatusMutation = useUpdateUserAdminStatus();

  const pendingProducts =
    products?.filter((product: Product) => product.status === 'pending') || [];

  const handleProductStatusUpdate = async (
    productId: number,
    newStatus: 'accepted' | 'rejected',
  ) => {
    try {
      await updateProductStatusMutation.mutateAsync({
        productId,
        status: newStatus,
      });
      message.success(
        `Товар ${newStatus === 'accepted' ? 'одобрен' : 'отклонен'}`,
      );
      // Invalidate and refetch products to update the table
      queryClient.invalidateQueries({ queryKey: [queryKeys.products.all] });
    } catch (error) {
      message.error('Ошибка при обновлении статуса товара');
      console.error('Update product status error:', error);
    }
  };

  const handleAdminStatusUpdate = async (userId: number, isAdmin: boolean) => {
    try {
      await updateUserAdminStatusMutation.mutateAsync({ userId, isAdmin });
      message.success(
        `Пользователь ${isAdmin ? 'назначен' : 'снят с'} администратором`,
      );
      // Invalidate and refetch users to update the table
      queryClient.invalidateQueries({ queryKey: [queryKeys.user.all] });
    } catch (error) {
      message.error('Ошибка при обновлении статуса администратора');
      console.error('Update admin status error:', error);
    }
  };

  const handleSaveSettings = () => {
    console.log('Настройки сохранены:', { siteName, contactEmail });
  };

  const usersColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Имя', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Статус',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      render: (isAdmin: boolean) =>
        isAdmin ? 'Администратор' : 'Пользователь',
    },
    {
      title: 'Дата регистрации',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="primary"
            danger={record.isAdmin}
            onClick={() => {
              Modal.confirm({
                title: `Вы уверены, что хотите ${
                  record.isAdmin ? 'снять с' : 'назначить'
                } пользователя администратором?`,
                onOk: () => handleAdminStatusUpdate(record.id, !record.isAdmin),
              });
            }}
            loading={updateUserAdminStatusMutation.isPending}
          >
            {record.isAdmin
              ? 'Снять с администратора'
              : 'Сделать администратором'}
          </Button>
          <Button danger>Удалить</Button>
        </Space>
      ),
    },
  ];

  // Колонки для таблицы feedback
  const feedbackColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Имя', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Тема', dataIndex: 'theme', key: 'theme' },
    {
      title: 'Сообщение',
      dataIndex: 'message',
      key: 'message',
      render: (text: string) => (
        <span title={text}>
          {text.length > 100 ? `${text.substring(0, 100)}...` : text}
        </span>
      ),
    },
    { title: 'Статус', dataIndex: 'status', key: 'status' },
    {
      title: 'Дата',
      dataIndex: 'dateRegistered',
      key: 'dateRegistered',
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: Feedback) => (
        <Space size="middle">
          <Button type="primary" danger>
            Отметить как обработанный
          </Button>
          <Button type="link" danger>
            Удалить
          </Button>
        </Space>
      ),
    },
  ];

  const productColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Название', dataIndex: 'title', key: 'title' },
    {
      title: 'Цена',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price} ₽`,
    },
    { title: 'Категория', dataIndex: 'category', key: 'category' },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handleProductStatusUpdate(record.id, 'accepted')}
            loading={updateProductStatusMutation.isPending}
          >
            Подтвердить
          </Button>
          <Button
            danger
            onClick={() => handleProductStatusUpdate(record.id, 'rejected')}
            loading={updateProductStatusMutation.isPending}
          >
            Отказать
          </Button>
        </Space>
      ),
    },
  ];

  const items = [
    {
      key: '1',
      label: 'Пользователи',
      children: (
        <Card>
          <Title level={4}>Управление пользователями</Title>
          {isUsersLoading ? (
            <div className="text-center py-5">
              <Spin size="large" />
              <Text className="d-block mt-3">Загрузка пользователей...</Text>
            </div>
          ) : (
            <Table
              columns={usersColumns}
              dataSource={users}
              rowKey="id"
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
          )}
        </Card>
      ),
    },
    {
      key: '2',
      label: 'Товары',
      children: (
        <Card>
          <Title level={4}>Модерация товаров</Title>
          {isProductsLoading ? (
            <div className="text-center py-5">
              <Spin size="large" />
              <Text className="d-block mt-3">Загрузка товаров...</Text>
            </div>
          ) : pendingProducts.length === 0 ? (
            <div className="text-center py-5">
              <CheckCircleOutlined
                style={{ fontSize: '48px', color: '#52c41a' }}
              />
              <Title level={5} className="mt-3">
                Нет товаров на модерации
              </Title>
              <Text type="secondary">В данный момент все товары проверены</Text>
            </div>
          ) : (
            <Table
              columns={productColumns}
              dataSource={pendingProducts}
              rowKey="id"
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
          )}
        </Card>
      ),
    },
    {
      key: '3',
      label: 'Настройки',
      children: (
        <Card>
          <Title level={4}>Настройки сайта</Title>
          <Form layout="vertical">
            <Form.Item label="Название сайта">
              <Input
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Контактный email">
              <Input
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleSaveSettings}>
                Сохранить настройки
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: '4',
      label: 'Обратная связь',
      children: (
        <Card>
          <Title level={4}>Управление обратной связью пользователей</Title>
          <Table
            columns={feedbackColumns}
            dataSource={mockFeedbacks}
            rowKey="id"
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
        </Card>
      ),
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
            {pendingProducts.length} feedback: {mockFeedbacks.length}
          </Text>
        </Col>
      </Row>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </div>
  );
};
