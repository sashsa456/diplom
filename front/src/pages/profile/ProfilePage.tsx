import { useEffect, useState } from 'react';
import {
  Card,
  Typography,
  Button,
  Avatar,
  Tag,
  Space,
  Rate,
  Tabs,
  Input,
  Form,
  message,
  Spin,
  Tooltip,
  Upload,
  InputNumber,
  Select,
} from 'antd';
import { EditOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import {
  useUserProfile,
  useMyProducts,
  useUpdateUser,
  Product as APIProductType,
  useUploadAvatar,
  useUpdateProduct,
  useResubmitProduct,
} from '@/shared/api/hooks';
import { useNavigate } from 'react-router-dom';
import styles from './ProfilePage.module.css';
import {
  PRODUCT_CATEGORIES,
  PRODUCT_SIZES,
  PRODUCT_COLORS,
  PRODUCT_MATERIALS,
  PRODUCT_SEASONS,
  PRODUCT_GENDERS,
  PRODUCT_COUNTRIES,
} from '@/shared/constants/product';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/client';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const ProfilePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: userProfile,
    isLoading: isUserLoading,
    error: userError,
  } = useUserProfile();
  const { data: pendingProducts, isLoading: isPendingLoading } =
    useMyProducts();
  const { data: approvedProducts, isLoading: isApprovedLoading } =
    useMyProducts('accepted');
  const { data: rejectedProducts, isLoading: isRejectedLoading } =
    useMyProducts('rejected');
  const updateUserMutation = useUpdateUser();
  const updateProductMutation = useUpdateProduct();
  const resubmitProductMutation = useResubmitProduct();

  const [activeTab, setActiveTab] = useState('1');
  const [form] = Form.useForm();
  const [productForm] = Form.useForm();
  const uploadAvatarMutation = useUploadAvatar();
  const [editingProduct, setEditingProduct] = useState<APIProductType | null>(
    null,
  );
  const [isFormChanged, setIsFormChanged] = useState(false);

  useEffect(() => {
    if (userProfile) {
      form.setFieldsValue({
        username: userProfile.username,
        email: userProfile.email,
      });
    }
  }, [userProfile, form]);

  useEffect(() => {
    if (editingProduct) {
      productForm.setFieldsValue({
        title: editingProduct.title,
        description: editingProduct.description,
        price: editingProduct.price,
        category: editingProduct.category,
        size: editingProduct.size,
        colors: editingProduct.colors,
        material: editingProduct.material,
        season: editingProduct.season,
        gender: editingProduct.gender,
        countryMade: editingProduct.countryMade,
      });
      setIsFormChanged(false);
    }
  }, [editingProduct, productForm]);

  const handleAvatarChange = async (file: File) => {
    try {
      await uploadAvatarMutation.mutateAsync(file);
      queryClient.invalidateQueries({ queryKey: [queryKeys.user.profile] });
      message.success('Аватар успешно обновлён');
    } catch (error) {
      console.error(error);
      message.error('Ошибка при загрузке аватара');
    }
  };

  const handleUpdateProfile = async (values: any) => {
    try {
      await updateUserMutation.mutateAsync(values);
      message.success('Профиль успешно обновлен!');
    } catch (error) {
      message.error('Ошибка при обновлении профиля.');
      console.error('Update profile error:', error);
    }
  };

  const handleAddProductClick = () => {
    navigate('/create-product');
  };

  const handleEditProduct = (product: APIProductType) => {
    setEditingProduct(product);
  };

  const handleProductUpdate = async (values: any) => {
    if (!editingProduct) return;

    try {
      const updatedProduct = await updateProductMutation.mutateAsync({
        productId: editingProduct.id,
        data: values,
      });
      message.success('Товар успешно обновлен');
      setEditingProduct(updatedProduct);
      queryClient.invalidateQueries({
        queryKey: [queryKeys.products.myProducts],
      });
      queryClient.invalidateQueries({ queryKey: [queryKeys.products.all] });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.products.myProducts('pending')],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.products.myProducts('accepted')],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.products.myProducts('rejected')],
      });
      setIsFormChanged(false);
    } catch (error) {
      message.error('Ошибка при обновлении товара');
      console.error('Update product error:', error);
    }
  };

  const handleResubmitProduct = async () => {
    if (!editingProduct) return;

    try {
      await resubmitProductMutation.mutateAsync({
        productId: editingProduct.id,
      });
      message.success('Товар отправлен на повторную проверку');
      queryClient.invalidateQueries({
        queryKey: [queryKeys.products.myProducts],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.products.myProducts('pending')],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.products.myProducts('accepted')],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.products.myProducts('rejected')],
      });
      setEditingProduct(null);
    } catch (error) {
      message.error('Ошибка при отправке товара на проверку');
      console.error('Resubmit product error:', error);
    }
  };

  const renderProducts = (
    products: APIProductType[] | undefined,
    isLoading: boolean,
    isRejected: boolean = false,
  ) => {
    if (isLoading) {
      return (
        <div className="text-center py-5">
          <Spin size="large" />
          <Text>Загрузка товаров...</Text>
        </div>
      );
    }
    if (!products || products.length === 0) {
      return (
        <div className="text-center py-5">
          <Text type="secondary">Нет товаров в этой категории.</Text>
        </div>
      );
    }

    return (
      <div className={styles.productsWrapper}>
        {products.map((product) => (
          <Card
            key={product.id}
            hoverable
            onClick={() => navigate(`/product/${product.id}`)}
            cover={
              <img
                alt={product.title}
                src={`http://localhost:3001/api${product.image}`}
                className={styles.productImage}
              />
            }
            className={styles.productCard}
            actions={
              isRejected
                ? [
                    <Button
                      key="edit"
                      type="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProduct(product);
                      }}
                    >
                      Редактировать
                    </Button>,
                  ]
                : undefined
            }
          >
            <Title level={5} className={styles.productTitle}>
              {product.title}
            </Title>
            <Text strong>{product.price.toLocaleString()} ₽</Text>

            <div className={styles.productRatingWrapper}>
              <Rate disabled defaultValue={product.rating} />
              <Text type="secondary" className={styles.productRatingText}>
                ({product.rating})
              </Text>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  if (isUserLoading) {
    return (
      <div className="container py-5 text-center">
        <Spin size="large" />
        <Text>Загрузка профиля...</Text>
      </div>
    );
  }

  if (userError || !userProfile) {
    return (
      <div className="container py-5 text-center">
        <Title level={3} type="danger">
          Ошибка загрузки профиля.
        </Title>
        <Text type="secondary">Пожалуйста, попробуйте еще раз позже.</Text>
      </div>
    );
  }

  const items = [
    {
      key: '1',
      label: 'Мои товары',
      children: renderProducts(pendingProducts, isPendingLoading),
    },
    {
      key: '2',
      label: 'Принятые',
      children: renderProducts(approvedProducts, isApprovedLoading),
    },
    {
      key: '3',
      label: 'Отклоненные',
      children: renderProducts(rejectedProducts, isRejectedLoading, true),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Card className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <Tooltip title="Нажмите, чтобы изменить аватар">
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  handleAvatarChange(file);
                  return false;
                }}
              >
                <Avatar
                  size={80}
                  icon={<UserOutlined />}
                  src={`http://localhost:3001/api${userProfile.avatar}`}
                  className={styles.avatar}
                  style={{ cursor: 'pointer' }}
                />
              </Upload>
            </Tooltip>

            <Text strong>{userProfile.username}</Text>
            <Text type="secondary" className={styles.emailText}>
              {userProfile.email}
            </Text>
          </div>

          <Space size="middle" className={styles.registrationSpace}>
            <Text type="secondary" className={styles.registrationLabel}>
              Дата регистрации
            </Text>
            <Text strong className={styles.registrationDate}>
              {userProfile.createdAt
                ? new Date(userProfile.createdAt).toLocaleDateString()
                : 'N/A'}
            </Text>
          </Space>

          <div className={styles.roleTagWrapper}>
            <Tag color={userProfile.isAdmin ? 'purple' : 'blue'}>
              {userProfile.isAdmin ? (
                <span role="button" onClick={() => navigate('/admin')}>
                  Администратор
                </span>
              ) : (
                'Пользователь'
              )}
            </Tag>
          </div>

          <Card type="inner" title="Настройки профиля">
            <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
              <Form.Item label="Имя пользователя" name="username">
                <Input />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    type: 'email',
                    message: 'Некорректный email',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Новый пароль"
                name="password"
                rules={[
                  {
                    min: 6,
                    message: 'Пароль должен содержать не менее 6 символов',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<EditOutlined />}
                  block
                  loading={updateUserMutation.isPending}
                >
                  Сохранить
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Card>
      </div>

      <div className={styles.content}>
        {editingProduct ? (
          <Card
            title="Редактирование товара"
            extra={
              <Space>
                <Button onClick={() => setEditingProduct(null)}>Отмена</Button>
                <Button
                  type="primary"
                  onClick={handleResubmitProduct}
                  disabled={!isFormChanged}
                  loading={resubmitProductMutation.isPending}
                >
                  Отправить на проверку
                </Button>
              </Space>
            }
          >
            <Form
              form={productForm}
              layout="vertical"
              onFinish={handleProductUpdate}
              onValuesChange={() => setIsFormChanged(true)}
            >
              <Form.Item
                label="Название"
                name="title"
                rules={[{ required: true, message: 'Введите название товара' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Описание"
                name="description"
                rules={[{ required: true, message: 'Введите описание товара' }]}
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                label="Цена"
                name="price"
                rules={[{ required: true, message: 'Введите цену товара' }]}
              >
                <InputNumber min={0} prefix="₽" style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                label="Категория"
                name="category"
                rules={[{ required: true, message: 'Выберите категорию' }]}
              >
                <Select options={PRODUCT_CATEGORIES} />
              </Form.Item>
              <Form.Item
                label="Размер"
                name="size"
                rules={[{ required: true, message: 'Выберите размер' }]}
              >
                <Select options={PRODUCT_SIZES} />
              </Form.Item>
              <Form.Item
                label="Цвета"
                name="colors"
                rules={[{ required: true, message: 'Выберите цвета' }]}
              >
                <Select
                  mode="multiple"
                  options={PRODUCT_COLORS}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item
                label="Материал"
                name="material"
                rules={[{ required: true, message: 'Выберите материал' }]}
              >
                <Select options={PRODUCT_MATERIALS} />
              </Form.Item>
              <Form.Item
                label="Сезон"
                name="season"
                rules={[{ required: true, message: 'Выберите сезон' }]}
              >
                <Select options={PRODUCT_SEASONS} />
              </Form.Item>
              <Form.Item
                label="Пол"
                name="gender"
                rules={[{ required: true, message: 'Выберите пол' }]}
              >
                <Select options={PRODUCT_GENDERS} />
              </Form.Item>
              <Form.Item
                label="Страна производства"
                name="countryMade"
                rules={[{ required: true, message: 'Выберите страну' }]}
              >
                <Select options={PRODUCT_COUNTRIES} />
              </Form.Item>
            </Form>
          </Card>
        ) : (
          <Card
            title={
              <Space>
                <Text strong style={{ fontSize: 18 }}>
                  Мои товары
                </Text>
              </Space>
            }
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddProductClick}
              >
                Добавить товар
              </Button>
            }
            className={styles.productsCard}
          >
            <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
          </Card>
        )}
      </div>
    </div>
  );
};
