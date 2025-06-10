import {
  Card,
  Typography,
  Table,
  Button,
  Space,
  Modal,
  message,
  Spin,
  Switch,
} from 'antd';
import {
  useUsers,
  useUpdateUserAdminStatus,
  useUpdateUserActiveStatus,
  useDeleteUser,
} from '@/shared/api/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/client';

const { Title, Text } = Typography;

export const UsersTab = () => {
  const { data: users, isLoading: isUsersLoading } = useUsers();
  const updateUserAdminStatusMutation = useUpdateUserAdminStatus();
  const queryClient = useQueryClient();
  const updateUserActiveStatusMutation = useUpdateUserActiveStatus();
  const deleteUserMutation = useDeleteUser();

  const handleUserActiveStatusUpdate = async (
    userId: number,
    isActive: boolean,
  ) => {
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

  const handleUserDelete = async (userId: number) => {
    try {
      await deleteUserMutation.mutateAsync({ userId });
      message.success('Пользователь успешно удален');
      queryClient.invalidateQueries({ queryKey: [queryKeys.user.all] });
    } catch (error) {
      message.error('Ошибка при удалении пользователя');
      console.error('Delete user error:', error);
    }
  };

  const handleAdminStatusUpdate = async (userId: number, isAdmin: boolean) => {
    try {
      await updateUserAdminStatusMutation.mutateAsync({ userId, isAdmin });
      message.success(`Пользователь назначен администратором`);
      queryClient.invalidateQueries({ queryKey: [queryKeys.user.all] });
    } catch (error) {
      message.error('Ошибка при обновлении статуса администратора');
      console.error('Update admin status error:', error);
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
                title: `Вы уверены, что хотите ${
                  !checked ? 'заблокировать' : 'активировать'
                } пользователя?`,
                onOk: () => handleUserActiveStatusUpdate(record.id, checked),
              });
            }}
          />
        );
      },
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
          {!record.isAdmin && (
            <>
              <Button
                type="primary"
                danger={record.isAdmin}
                onClick={() => {
                  Modal.confirm({
                    title: `Вы уверены, что хотите назначить пользователя администратором?`,
                    onOk: () =>
                      handleAdminStatusUpdate(record.id, !record.isAdmin),
                  });
                }}
                loading={updateUserAdminStatusMutation.isPending}
              >
                Сделать администратором
              </Button>
              <Button
                danger
                onClick={() => {
                  Modal.confirm({
                    title: `Вы уверены, что хотите удалить пользователя?`,
                    onOk: () => handleUserDelete(record.id),
                  });
                }}
              >
                Удалить
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
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
  );
};
