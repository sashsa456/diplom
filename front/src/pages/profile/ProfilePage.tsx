import { Card, Typography, Button, Avatar, Tag, Space, Rate } from 'antd';
import { EditOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { productList, users } from './const';
import styles from './style/style.module.css';

const { Title, Text } = Typography;

export const ProfilePage = () => {
  const user = users[0];

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Card className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <Avatar
              size={80}
              icon={<UserOutlined />}
              src={user.avatar}
              className={styles.avatar}
            />
            <Text strong>{user.username}</Text>
            <Text type="secondary" className={styles.emailText}>
              {user.email}
            </Text>
          </div>

          <Space size="middle" className={styles.registrationSpace}>
            <div>
              <Text strong className={styles.registrationDate}>
                {user.createdAt}
              </Text>
              <Text type="secondary" className={styles.registrationLabel}>
                Дата регистрации
              </Text>
            </div>
          </Space>

          <div className={styles.roleTagWrapper}>
            <Tag color={user.isAdmin ? 'purple' : 'blue'}>
              {user.isAdmin ? 'Администратор' : 'Пользователь'}
            </Tag>
          </div>

          <Card type="inner" title="Настройки профиля">
            <div className={styles.settingsInputWrapper}>
              <Text type="secondary">Имя пользователя</Text>
              <input
                defaultValue={user.username}
                className={styles.settingsInput}
              />
            </div>
            <div className={styles.settingsInputWrapper}>
              <Text type="secondary">Email</Text>
              <input
                defaultValue={user.email}
                className={styles.settingsInput}
              />
            </div>
            <div className={styles.settingsInputWrapper}>
              <Text type="secondary">Новый пароль</Text>
              <input className={styles.settingsInput} />
            </div>
            <div className={styles.settingsInputPasswordWrapper}>
              <Text type="secondary">Старый пароль</Text>
              <input className={styles.settingsInput} />
            </div>
            <Button icon={<EditOutlined />} block>
              Сохранить
            </Button>
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
            <Button type="primary" icon={<PlusOutlined />}>
              Добавить товар
            </Button>
          }
          className={styles.productsCard}
        >
          <div className={styles.productsWrapper}>
            {productList.map((product) => (
              <Card
                key={product.id}
                hoverable
                cover={<img alt={product.title} src={product.img} />}
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
        </Card>
      </div>
    </div>
  );
};
