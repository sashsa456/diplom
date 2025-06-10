import type { ReactNode } from 'react';
import { Layout as AntLayout, Spin } from 'antd';
import { useAuthStore } from '@/shared/hooks';
import { useAppInfo } from '@/shared/api/hooks';
import { AppHeader } from './components/AppHeader';
import { AppFooter } from './components/AppFooter';

const { Content } = AntLayout;

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuthStore();
  const { data: appInfo, isLoading: isAppInfoLoading } = useAppInfo();

  if (isAppInfoLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spin fullscreen size="large" tip="Загрузка..." />
      </div>
    );
  }

  return (
    <AntLayout className="min-vh-100">
      <AppHeader
        user={user}
        logout={logout}
        appInfo={appInfo}
        isAppInfoLoading={isAppInfoLoading}
      />

      <Content className="py-4">
        <div className="container">{children}</div>
      </Content>

      <AppFooter appInfo={appInfo} />
    </AntLayout>
  );
};
