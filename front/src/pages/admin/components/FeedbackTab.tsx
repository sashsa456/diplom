import { Card, Typography, Table, Button, message } from 'antd';
import { useFeedbacks, useDeleteFeedback, Feedback } from '@/shared/api/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/client';

const { Title } = Typography;

export const FeedbackTab = () => {
  const { data: feedbacks, isLoading: isFeedbacksLoading } = useFeedbacks();
  const deleteFeedbackMutation = useDeleteFeedback();
  const queryClient = useQueryClient();

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
        <Button
          danger
          onClick={() => handleFeedbackDelete(record.id)}
          loading={deleteFeedbackMutation.isPending}
        >
          Удалить
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <Title level={4}>Управление обратной связью пользователей</Title>
      <Table
        columns={feedbackColumns}
        dataSource={feedbacks}
        loading={isFeedbacksLoading}
        rowKey="id"
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </Card>
  );
};
