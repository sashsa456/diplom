import { useState, useEffect } from 'react';
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
} from 'antd';
import { EditOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import {
  useUserProfile,
  useMyProducts,
  useUpdateUser,
  Product as APIProductType,
  useUploadAvatar,
} from '@/shared/api/hooks';
import { useNavigate } from 'react-router-dom';
import styles from './ProfilePage.module.css';

const { Title, Text } = Typography;

export const ProfilePage = () => {
  const navigate = useNavigate();
  const {
    data: userProfile,
    isLoading: isUserLoading,
    error: userError,
  } = useUserProfile();
  const { data: pendingProducts, isLoading: isPendingLoading } =
    useMyProducts('pending');
  const { data: approvedProducts, isLoading: isApprovedLoading } =
    useMyProducts('approved');
  const { data: rejectedProducts, isLoading: isRejectedLoading } =
    useMyProducts('rejected');
  const updateUserMutation = useUpdateUser();

  const [activeTab, setActiveTab] = useState('1');
  const [form] = Form.useForm();
  const uploadAvatarMutation = useUploadAvatar();

  useEffect(() => {
    if (userProfile) {
      form.setFieldsValue({
        username: userProfile.username,
        email: userProfile.email,
      });
    }
  }, [userProfile, form]);




const handleAvatarChange = async (file: File) => {
  try {
    await uploadAvatarMutation.mutateAsync(file);
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

  const renderProducts = (
    products: APIProductType[] | undefined,
    isLoading: boolean,
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
            cover={
              <img
                alt={product.title}
                src={product.image}
                className={styles.productImage}
              />
            }
            className={styles.productCard}
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
      children: renderProducts(rejectedProducts, isRejectedLoading),
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
      icon={ <UserOutlined />}
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
              {userProfile.isAdmin ? 'Администратор' : 'Пользователь'}
            </Tag>
          </div>

          <Card type="inner" title="Настройки профиля">
            <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
              <Form.Item label="Имя пользователя" name="username">
                <Input />
              </Form.Item>
              <Form.Item label="Email" name="email">
                <Input />
              </Form.Item>
              <Form.Item label="Новый пароль" name="password">
                <Input.Password />
              </Form.Item>
              <Form.Item label="Старый пароль" name="oldPassword">
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
      </div>
    </div>
  );
};
