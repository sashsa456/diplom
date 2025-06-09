import type { ReactNode } from 'react';
import { Layout as AntLayout, Menu, Button, Space, Spin } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/shared/hooks';
import { menuItems } from './constants';
import { useAppInfo } from '@/shared/api/hooks';

const { Header, Content, Footer } = AntLayout;

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { data: appInfo, isLoading: isAppInfoLoading } = useAppInfo();
  const isAuthenticated = !!user;

  const handleLogout = () => {
    logout();
  };
  if (isAppInfoLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spin fullscreen size="large" tip="Загрузка..." />
      </div>
    );
  }

  return (
    <AntLayout className="min-vh-100">
      <Header className="d-flex align-items-center justify-content-between px-4">
        <div className="d-flex align-items-center">
          <Link to="/" className="text-white text-decoration-none">
            <h3 className="mb-0"> {appInfo?.name || 'KidsFashion'}</h3>
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
          {isAuthenticated ? (
            <>
              <Link to="/profile">
                <Button type="primary" icon={<UserOutlined />}>
                  Профиль
                </Button>
              </Link>
              <Button onClick={handleLogout}>Выйти</Button>
            </>
          ) : (
            <Button type="primary" icon={<UserOutlined />}>
              <Link to="/auth" className="text-white text-decoration-none">
                Войти
              </Link>
            </Button>
          )}
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
