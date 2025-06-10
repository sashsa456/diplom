import { useState } from 'react';
import {
  Card,
  Button,
  Rate,
  Input,
  Space,
  message,
  Spin,
  Typography,
} from 'antd';
import { useCreateReview, Review } from '@/shared/api/hooks';
import { useAuthStore } from '@/shared/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/client';
import { ReviewCard } from './ReviewCard';

const { Title } = Typography;
const { TextArea } = Input;

interface ProductReviewsTabProps {
  productId: number;
  reviews: Review[] | undefined;
  isReviewsLoading: boolean;
}

export const ProductReviewsTab = ({
  productId,
  reviews,
  isReviewsLoading,
}: ProductReviewsTabProps) => {
  const [newReview, setNewReview] = useState({
    rating: 0,
    text: '',
  });
  const [newCommentText, setNewCommentText] = useState<{
    [key: number]: string;
  }>({});
  const currentUser = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const createReview = useCreateReview(productId);

  const handleReviewSubmit = async () => {
    if (!newReview.rating || !newReview.text) {
      message.error('Пожалуйста, заполните все поля');
      return;
    }

    try {
      await createReview.mutateAsync(newReview);
      message.success('Отзыв успешно добавлен');
      setNewReview({ rating: 0, text: '' });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.list(productId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.details(productId),
      });
    } catch (error) {
      message.error('Ошибка при добавлении отзыва');
    }
  };

  return (
    <div>
      <Card className="mb-4">
        <Title level={5}>Оставить отзыв</Title>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Rate
            value={newReview.rating}
            onChange={(value) =>
              setNewReview((prev) => ({ ...prev, rating: value }))
            }
          />
          <TextArea
            rows={4}
            value={newReview.text}
            onChange={(e) =>
              setNewReview((prev) => ({ ...prev, text: e.target.value }))
            }
            placeholder="Напишите ваш отзыв..."
          />
          <Button
            type="primary"
            onClick={handleReviewSubmit}
            loading={createReview.isPending}
          >
            Отправить
          </Button>
        </Space>
      </Card>

      {isReviewsLoading ? (
        <div className="text-center py-4">
          <Spin tip="Загрузка отзывов..." />
        </div>
      ) : (
        <Space direction="vertical" style={{ width: '100%' }}>
          {reviews?.map((review: Review) => (
            <ReviewCard
              key={review.id}
              review={review}
              productId={productId}
              currentUser={currentUser}
              newCommentText={newCommentText}
              setNewCommentText={setNewCommentText}
            />
          ))}
        </Space>
      )}
    </div>
  );
};
