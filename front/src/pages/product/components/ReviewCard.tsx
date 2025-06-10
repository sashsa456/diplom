import {
  Row,
  Col,
  Typography,
  Button,
  Rate,
  Input,
  Card,
  Avatar,
  Space,
  message,
  Modal,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import {
  Review,
  User,
  Comment,
  useDeleteReview,
  useCreateComment,
  useDeleteComment,
} from '@/shared/api/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/client';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface ReviewCardProps {
  review: Review;
  productId: number;
  currentUser: User | null;
  newCommentText: { [key: number]: string };
  setNewCommentText: React.Dispatch<
    React.SetStateAction<{ [key: number]: string }>
  >;
}

export const ReviewCard = ({
  review,
  productId,
  currentUser,
  newCommentText,
  setNewCommentText,
}: ReviewCardProps) => {
  const queryClient = useQueryClient();
  const deleteReview = useDeleteReview(productId);
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();

  const handleReviewDelete = async (reviewId: number) => {
    try {
      await deleteReview.mutateAsync(reviewId);
      message.success('Отзыв успешно удален');
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.list(productId),
      });
    } catch (error) {
      message.error('Ошибка при удалении отзыва');
    }
  };

  const handleCommentSubmit = async (reviewId: number) => {
    const messageText = newCommentText[reviewId];
    if (!messageText) {
      message.error('Пожалуйста, введите комментарий');
      return;
    }

    try {
      await createComment.mutateAsync({ reviewId, message: messageText });
      message.success('Комментарий успешно добавлен');
      setNewCommentText((prev) => ({ ...prev, [reviewId]: '' }));
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.list(productId),
      });
    } catch (error) {
      message.error('Ошибка при добавлении комментария');
    }
  };

  const handleCommentDelete = async (reviewId: number, commentId: number) => {
    try {
      await deleteComment.mutateAsync({ reviewId, commentId });
      message.success('Комментарий успешно удален');
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.list(productId),
      });
    } catch (error) {
      message.error('Ошибка при удалении комментария');
    }
  };

  

  return (
    <Card key={review.id} style={{ width: '100%' }}>
      <Row gutter={16} align="top">
        <Col flex="none">
          <Avatar src={`http://localhost:3001/api${review.user.avatar}`} />
        </Col>
        <Col flex="1" style={{ minWidth: 0 }}>
          <Row justify="space-between" align="middle" style={{ width: '100%' }}>
            <Col>
              <Text strong>{review.user.username}</Text>
            </Col>
            <Col>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                {currentUser?.id === review.user.id && (
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      Modal.confirm({
                        title: 'Удалить отзыв?',
                        content: 'Вы уверены, что хотите удалить этот отзыв?',
                        okText: 'Да',
                        cancelText: 'Нет',
                        onOk: () => handleReviewDelete(review.id),
                      });
                    }}
                    loading={deleteReview.isPending}
                  />
                )}
              </div>
            </Col>
          </Row>
          <div style={{ width: '100%' }}>
            <Rate disabled defaultValue={review.rating} />
            <Text type="secondary" className="ms-2">
              {review.createdAt}
            </Text>
          </div>
          <Paragraph className="mt-2">{review.text}</Paragraph>
          {review.comments && review.comments.length > 0 && (
            <div className="mt-3">
              <Title level={5}>Комментарии:</Title>
              <Space direction="vertical" style={{ width: '100%' }}>
                {review.comments.map((comment: Comment) => (
                  <Card key={comment.id} size="small" extra={<>
                    {currentUser?.isAdmin || currentUser?.id !== comment.user.id && (
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          Modal.confirm({
                            title: 'Удалить комментарий?',
                            content: 'Вы уверены, что хотите удалить этот комментарий?',
                            okText: 'Да',
                            cancelText: 'Нет',
                            onOk: () => handleCommentDelete(review.id, comment.id),
                          });
                        }}
                        loading={deleteComment.isPending}
                      />
                    )}
                  </>}>
                    <Space align="start">
                      <Avatar
                        src={`http://localhost:3001/api${comment.user.avatar}`}
                      />
                      <div>
                        <Text strong>{comment.user.username}</Text>
                        <Text type="secondary" className="ms-2">
                          {comment.createdAt}
                        </Text>
                        <Paragraph className="mt-1">
                          {comment.message}
                        </Paragraph>
                      </div>
                    </Space>
                  </Card>
                ))}
              </Space>
            </div>
          )}
          <Card className="mt-3" size="small">
            <Title level={5}>Оставить комментарий</Title>
            <TextArea
              rows={2}
              value={newCommentText[review.id] || ''}
              onChange={(e) =>
                setNewCommentText((prev) => ({
                  ...prev,
                  [review.id]: e.target.value,
                }))
              }
              placeholder="Напишите ваш комментарий..."
            />
            <Button
              type="primary"
              className="mt-2"
              onClick={() => handleCommentSubmit(review.id)}
              loading={createComment.isPending}
            >
              Отправить комментарий
            </Button>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};
