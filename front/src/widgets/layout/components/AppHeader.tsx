import { useState, useEffect } from 'react';
import { Layout as AntLayout, Menu, Button, Space, Spin, Drawer } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import { User } from '@/shared/hooks';
import { menuItems } from '../constants';
import styles from './AppHeader.module.css';

const { Header } = AntLayout;

interface AppHeaderProps {
  user: User | null;
  logout: () => void;
  appInfo: { name: string } | undefined;
  isAppInfoLoading: boolean;
}

export const AppHeader = ({
  user,
  logout,
  appInfo,
  isAppInfoLoading,
}: AppHeaderProps) => {
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const isAuthenticated = !!user;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
  };

  const handleLogout = () => {
    logout();
    onCloseDrawer();
  };

  if (isAppInfoLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spin fullscreen size="large" tip="Загрузка..." />
      </div>
    );
  }

  return (
    <Header
      className={`d-flex align-items-center justify-content-between px-4 ${styles.header}`}
    >
      <div className="d-flex align-items-center">
        <Link to="/" className="text-white text-decoration-none">
          <h3 className="mb-0">{appInfo?.name || 'KidsFashion'}</h3>
        </Link>
        {!isMobile && (
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            className="ms-4"
          />
        )}
      </div>
      <Space>
        {isMobile ? (
          <Button type="primary" icon={<MenuOutlined />} onClick={showDrawer} />
        ) : (
          <>
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
          </>
        )}
      </Space>

      <Drawer
        title="Меню"
        placement="right"
        onClose={onCloseDrawer}
        open={drawerVisible}
        className={styles.drawer}
      >
        <Menu
          theme="light"
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={menuItems.map((item) => ({
            ...item,
            onClick: onCloseDrawer,
          }))}
          style={{ borderRight: 0 }}
        />
        <Space direction="vertical" className="mt-4 w-100">
          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={onCloseDrawer}>
                <Button type="primary" icon={<UserOutlined />} block>
                  Профиль
                </Button>
              </Link>
              <Button onClick={handleLogout} block>
                Выйти
              </Button>
            </>
          ) : (
            <Link to="/auth" onClick={onCloseDrawer}>
              <Button type="primary" icon={<UserOutlined />} block>
                Войти
              </Button>
            </Link>
          )}
        </Space>
      </Drawer>
    </Header>
  );
};
