import { useState } from 'react';
import { Card, Tabs, Typography } from 'antd';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';

const { Title } = Typography;

export const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('1');

  const items = [
    {
      key: '1',
      label: 'Вход',
      children: <LoginForm />,
    },
    {
      key: '2',
      label: 'Регистрация',
      children: <RegisterForm />,
    },
  ];

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <Card className="mt-5">
            <Title level={2} className="text-center mb-4">
              Добро пожаловать
            </Title>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={items}
              centered
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
