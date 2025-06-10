import { Card, Typography, Table, Button, Space, message, Spin } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import {
  useProducts,
  useUpdateProductStatus,
  Product,
} from '@/shared/api/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/client';

const { Title, Text } = Typography;

export const ProductsTab = () => {
  const { data: products, isLoading: isProductsLoading } = useProducts();
  const updateProductStatusMutation = useUpdateProductStatus();
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: [queryKeys.products.all] });
    } catch (error) {
      message.error('Ошибка при обновлении статуса товара');
      console.error('Update product status error:', error);
    }
  };

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

  return (
    <Card>
      <Title level={4}>Модерация товаров</Title>
      {isProductsLoading ? (
        <div className="text-center py-5">
          <Spin size="large" />
          <Text className="d-block mt-3">Загрузка товаров...</Text>
        </div>
      ) : pendingProducts.length === 0 ? (
        <div className="text-center py-5">
          <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
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
  );
};
