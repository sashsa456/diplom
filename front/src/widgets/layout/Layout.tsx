import type { ReactNode } from 'react';
import { Layout as AntLayout, Menu, Button, Space } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  ShoppingOutlined,
  UserOutlined,
  MessageOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer } = AntLayout;

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">Главная</Link>,
    },
    {
      key: '/catalog',
      icon: <ShoppingOutlined />,
      label: <Link to="/catalog">Каталог</Link>,
    },
    {
      key: '/feedback',
      icon: <MessageOutlined />,
      label: <Link to="/feedback">Обратная связь</Link>,
    },
  ];

  return (
    <AntLayout className="min-vh-100">
      <Header className="d-flex align-items-center justify-content-between px-4">
        <div className="d-flex align-items-center">
          <Link to="/" className="text-white text-decoration-none">
            <h3 className="mb-0">KidsFashion</h3>
          </Link>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            className="ms-4"
          />
        </div>
        <Space>
          <Button type="primary" icon={<UserOutlined />}>
            <Link to="/auth" className="text-white text-decoration-none">
              Войти
            </Link>
          </Button>
        </Space>
      </Header>

      <Content className="py-4">
        <div className="container">{children}</div>
      </Content>

      <Footer className="text-center bg-light py-3">
        © 2024 Детская Одежда. Все права защищены.
      </Footer>
    </AntLayout>
  );
};
