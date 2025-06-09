import { useState, useEffect } from 'react';
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
  Switch,
} from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import {
  useProducts,
  useUpdateProductStatus,
  Product,
  useUsers,
  useUpdateUserAdminStatus,
  useFeedbacks,
  useDeleteFeedback,
  Feedback,
  useAppInfo,
  useAppInfoUpdate,
  AppInfo,
  useDeleteUser,
  useUpdateUserActiveStatus,
} from '@/shared/api/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/client';

const { Title, Text } = Typography;

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('1');
  const queryClient = useQueryClient();

  const { data: products, isLoading: isProductsLoading } = useProducts();
  const { data: users, isLoading: isUsersLoading } = useUsers();
  const { data: feedbacks, isLoading: isFeedbacksLoading } = useFeedbacks();
  const { data: appInfo } = useAppInfo();
  const updateProductStatusMutation = useUpdateProductStatus();
  const updateUserAdminStatusMutation = useUpdateUserAdminStatus();
  const updateUserActiveStatusMutation = useUpdateUserActiveStatus();
  const deleteUserMutation = useDeleteUser();
  const deleteFeedbackMutation = useDeleteFeedback();
  const updateAppInfoMutation = useAppInfoUpdate();

  const [form] = Form.useForm<AppInfo>();

  useEffect(() => {
    if (appInfo) {
      form.setFieldsValue({
        name: appInfo.name,
        contactEmail: appInfo.contactEmail,
        contactPhone: appInfo.contactPhone,
      });
    }
  }, [appInfo, form]);

  const pendingProducts =
    products?.filter((product: Product) => product.status === 'pending') || [];

  const handleUserDelete = async (userId: number) => {
    try {
      await deleteUserMutation.mutateAsync({userId});
      message.success('Пользователь успешно удален');
      queryClient.invalidateQueries({ queryKey: [queryKeys.user.all] });
    } catch (error) {
      message.error('Ошибка при удалении пользователя');
      console.error('Delete user error:', error);
    }
  };


  const handleFeedbackDelete = async (feedbackId: number) => {
    try {
      await deleteFeedbackMutation.mutateAsync(feedbackId);
      message.success('Отзыв успешно удален');
      queryClient.invalidateQueries({ queryKey: [queryKeys.feedbacks.all] });
    } catch (error) {
      message.error('Ошибка при удалении отзыва');
      console.error('Delete feedback error:', error);
    }
  };

  const handleAppInfoUpdate = async (values: AppInfo) => {
    try {
      await updateAppInfoMutation.mutateAsync(values);
      message.success('Настройки сайта успешно обновлены!');
      queryClient.invalidateQueries({ queryKey: [queryKeys.app.all] });
    } catch (error) {
      message.error('Ошибка при сохранении настроек сайта.');
      console.error('Update app info error:', error);
    }
  };

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
        `Пользователь назначен администратором`,
      );
      queryClient.invalidateQueries({ queryKey: [queryKeys.user.all] });
    } catch (error) {
      message.error('Ошибка при обновлении статуса администратора');
      console.error('Update admin status error:', error);
    }
  };

  const handleUserActiveStatusUpdate = async (userId: number, isActive: boolean) => {
    try {
      await updateUserActiveStatusMutation.mutateAsync({ userId, isActive });
      message.success(
        `Пользователь ${isActive ? 'активирован' : 'заблокирован'}`,
      );
      queryClient.invalidateQueries({ queryKey: [queryKeys.user.all] });
    } catch (error) {
      message.error('Ошибка при обновлении статуса пользователя');
      console.error('Update user status error:', error);
    }
  };

  const usersColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Имя', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Роль',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      render: (isAdmin: boolean) =>
        isAdmin ? 'Администратор' : 'Пользователь',
    },
    {
      title: 'Статус блокировки',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (_: boolean, record: any) => {
        return (
            <Switch
                checkedChildren="Активен"
                unCheckedChildren="Заблокирован"
                defaultChecked={record.isActive}
                value={record.isActive}
                disabled={record.isAdmin}
                onChange={(checked) => {
                  Modal.confirm({
                      title: `Вы уверены, что хотите ${!checked ? 'заблокировать' : 'активировать'} пользователя?`,
                      onOk: () =>
                          handleUserActiveStatusUpdate(record.id, checked)
                  })
                }}
            />
        );
      }
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
          {!record.isAdmin &&
            (
            <>
              <Button
                type="primary"
                danger={record.isAdmin}
                onClick={() => {
                  Modal.confirm({
                      title: `Вы уверены, что хотите назначить пользователя администратором?`,
                      onOk: () =>
                          handleAdminStatusUpdate(record.id, !record.isAdmin)
                  });
                }}
                loading={updateUserAdminStatusMutation.isPending}
              >
                Сделать администратором
              </Button>
              <Button danger onClick={() => {
                Modal.confirm({
                    title: `Вы уверены, что хотите удалить пользователя?`,
                    onOk: () => handleUserDelete(record.id)
                });
              }}>Удалить</Button>
            </>
          )
          }
        </Space>
      ),
    },
  ];

  const feedbackColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Имя', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Тема', dataIndex: 'topic', key: 'topic' },
    {
      title: 'Сообщение',
      dataIndex: 'text',
      key: 'text',
      render: (text: string) => (
        <span title={text}>
          {text.length > 100 ? `${text.substring(0, 100)}...` : text}
        </span>
      ),
    },
    {
      title: 'Дата',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: Feedback) => (
        <Button danger onClick={() => handleFeedbackDelete(record.id)} loading={deleteFeedbackMutation.isPending}>
          Удалить
        </Button>
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
          key: "1",
          label: "Пользователи",
          children: (
              <Card>
                  <Title level={4}>Управление пользователями</Title>
                  {isUsersLoading ? (
                      <div className="text-center py-5">
                          <Spin size="large" />
                          <Text className="d-block mt-3">
                              Загрузка пользователей...
                          </Text>
                      </div>
                  ) : (
                      <Table
                          columns={usersColumns}
                          dataSource={users}
                          rowKey="id"
                          pagination={false}
                          scroll={{ x: "max-content" }}
                      />
                  )}
              </Card>
          )
      },
      {
          key: "2",
          label: "Товары",
          children: (
              <Card>
                  <Title level={4}>Модерация товаров</Title>
                  {isProductsLoading ? (
                      <div className="text-center py-5">
                          <Spin size="large" />
                          <Text className="d-block mt-3">
                              Загрузка товаров...
                          </Text>
                      </div>
                  ) : pendingProducts.length === 0 ? (
                      <div className="text-center py-5">
                          <CheckCircleOutlined
                              style={{ fontSize: "48px", color: "#52c41a" }}
                          />
                          <Title level={5} className="mt-3">
                              Нет товаров на модерации
                          </Title>
                          <Text type="secondary">
                              В данный момент все товары проверены
                          </Text>
                      </div>
                  ) : (
                      <Table
                          columns={productColumns}
                          dataSource={pendingProducts}
                          rowKey="id"
                          pagination={false}
                          scroll={{ x: "max-content" }}
                      />
                  )}
              </Card>
          )
      },
      {
          key: "3",
          label: "Настройки",
          children: (
              <Card>
                  <Title level={4}>Настройки сайта</Title>
                  <Form layout="vertical" form={form} onFinish={handleAppInfoUpdate}>
                      <Form.Item
                          name="name"
                          label="Название сайта"
                          initialValue={appInfo?.name}
                      >
                          <Input />
                      </Form.Item>
                      <Form.Item
                          name="contactEmail"
                          label="Электронная почта"
                          initialValue={appInfo?.contactEmail}
                      >
                          <Input />
                      </Form.Item>
                      <Form.Item
                          name="contactPhone"
                          label="Телефон"
                          initialValue={appInfo?.contactPhone}
                      >
                          <Input />
                      </Form.Item>
                      <Form.Item>
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={updateAppInfoMutation.isPending}
                          >
                              Сохранить настройки
                          </Button>
                      </Form.Item>
                  </Form>
              </Card>
          )
      },
      {
          key: "4",
          label: "Обратная связь",
          children: (
              <Card>
                  <Title level={4}>
                      Управление обратной связью пользователей
                  </Title>
                  <Table
                      columns={feedbackColumns}
                      dataSource={feedbacks}
                      loading={isFeedbacksLoading}
                      rowKey="id"
                      pagination={false}
                      scroll={{ x: "max-content" }}
                  />
              </Card>
          )
      }
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
            {pendingProducts.length} feedback: {feedbacks.length}
          </Text>
        </Col>
      </Row>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </div>
  );
};
