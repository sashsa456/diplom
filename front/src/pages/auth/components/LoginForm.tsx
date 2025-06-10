import { Form, Input, Button, Typography, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '@/shared/api/hooks';

const { Text } = Typography;

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const navigate = useNavigate();
  const login = useLogin();

  const handleLogin = async (values: LoginFormData) => {
    try {
      await login.mutateAsync(values);
      message.success('Успешный вход');
      navigate('/');
    } catch {
      message.error('Ошибка при входе');
    }
  };

  return (
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
  );
};
