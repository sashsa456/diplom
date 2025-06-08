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
  Empty,
  Form,
} from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Интерфейс для пользователя
interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  dateRegistered: string;
}


// Интерфейс для feedback
interface Feedback {
  id: number;
  name: string;
  email: string;
  theme:string;
  status: string;
  dateRegistered: string;
  message:string;
}


// Моковые данные для пользователей
const mockUsers: User[] = [
  {
    id: 1,
    name: 'admin',
    email: 'admin@kidsfashion.ru',
    status: 'Активен',
    dateRegistered: '29.05.2025',
  },
  {
    id: 2,
    name: 'Roman',
    email: 'roma@gmail.com',
    status: 'Активен',
    dateRegistered: '30.05.2025',
  },
];


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

  const handleSaveSettings = () => {
    console.log('Настройки сохранены:', { siteName, contactEmail });
    // Здесь будет логика сохранения настроек на бэкенде
  };

  const usersColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Имя', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Статус', dataIndex: 'status', key: 'status' },
    {
      title: 'Дата регистрации',
      dataIndex: 'dateRegistered',
      key: 'dateRegistered',
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button type="primary" danger>
            Сделать администратором
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
  { title: 'Сообщение', dataIndex: 'message', key: 'message' },
  { title: 'Статус', dataIndex: 'status', key: 'status' },
  {
    title: 'Дата',
    dataIndex: 'dateRegistered',
    key: 'dateRegistered',
  },
  {
    title: 'Действия',
    align:'center',
    key: 'actions',
    render: (_: any, record: Feedback) => (
      <Space size="middle">
        <Button type="link">Отметить как обработанный</Button>
        <Button type="link" danger>
          Удалить
        </Button>
      </Space>
    ),
  },
];

  const productsForModeration = []; // Моковые данные для товаров на модерации

  const items = [
    {
      key: '1',
      label: 'Пользователи',
      children: (
        <Card>
          <Title level={4}>Управление пользователями</Title>
          <Table
            columns={usersColumns}
            dataSource={mockUsers}
            rowKey="id"
            pagination={false}
          />
        </Card>
      ),
    },
    {
      key: '2',
      label: 'Товары',
      children: (
        <Card>
          <Title level={4}>Модерация товаров</Title>
          {productsForModeration.length === 0 ? (
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
            <Empty description="Товары на модерации" />
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
      label: 'Feedback',
      children: (
        <Card>
          <Title level={4}>Управление feedback</Title>
          <Table
            columns={feedbackColumns}
            dataSource={mockFeedbacks}
            rowKey="id"
            pagination={false}
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
          <Text type="secondary">Пользователей: 2 Товаров на модерации: 0 feedback:3</Text>
        </Col>
      </Row>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </div>
  );
};
