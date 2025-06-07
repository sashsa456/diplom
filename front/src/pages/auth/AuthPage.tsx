import { useState } from 'react';
import { Card, Form, Input, Button, Tabs, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLogin, useRegister } from '@/shared/api/hooks';

const { Title, Text } = Typography;

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('1');
  const navigate = useNavigate();
  const login = useLogin();
  const register = useRegister();

  const handleLogin = async (values: LoginFormData) => {
    try {
      await login.mutateAsync(values);
      message.success('Успешный вход');
      navigate('/');
    } catch {
      message.error('Ошибка при входе');
    }
  };

  const handleRegister = async (values: RegisterFormData) => {
    try {
      await register.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      message.success('Регистрация успешна');
      navigate('/');
    } catch {
      message.error('Ошибка при регистрации');
    }
  };

  const items = [
    {
      key: '1',
      label: 'Вход',
      children: (
        <Form
          name="login"
          onFinish={handleLogin}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Введите корректный email' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Введите пароль' },
              { min: 6, message: 'Пароль должен содержать минимум 6 символов' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Пароль"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={login.isPending}
            >
              Войти
            </Button>
          </Form.Item>

          <div className="text-center">
            <Text type="secondary">
              <a href="#">Забыли пароль?</a>
            </Text>
          </div>
        </Form>
      ),
    },
    {
      key: '2',
      label: 'Регистрация',
      children: (
        <Form
          name="register"
          onFinish={handleRegister}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="name"
            rules={[
              { required: true, message: 'Введите имя' },
              { min: 2, message: 'Имя должно содержать минимум 2 символа' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Имя" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Введите корректный email' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Введите пароль' },
              { min: 6, message: 'Пароль должен содержать минимум 6 символов' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Пароль"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Подтвердите пароль' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароли не совпадают'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Подтвердите пароль"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={register.isPending}
            >
              Зарегистрироваться
            </Button>
          </Form.Item>
        </Form>
      ),
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
