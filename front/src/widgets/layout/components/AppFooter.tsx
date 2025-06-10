import { Layout as AntLayout } from 'antd';

const { Footer } = AntLayout;

interface AppFooterProps {
  appInfo: { name: string } | undefined;
}

export const AppFooter = ({ appInfo }: AppFooterProps) => {
  return (
    <Footer className="text-center bg-light py-3">
      © 2024 {appInfo?.name || 'KidsFashion'}. Все права защищены.
    </Footer>
  );
};
