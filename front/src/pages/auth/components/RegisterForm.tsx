import { Form, Input, Button, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '@/shared/api/hooks';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export const RegisterForm = () => {
  const navigate = useNavigate();
  const register = useRegister();

  const handleRegister = async (values: RegisterFormData) => {
    try {
      await register.mutateAsync({
        username: values.name,
        email: values.email,
        password: values.password,
      });
      message.success('Регистрация успешна');
      navigate('/');
    } catch {
      message.error('Ошибка при регистрации');
    }
  };

  const handleDownloadAgreement = () => {
    window.open(
      'http://localhost:3001/api/static/user_agreement.docx',
      '_blank',
    );
  };

  return (
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

      <Form.Item
        name="agreeToTerms"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(
                    new Error('Необходимо принять пользовательское соглашение'),
                  ),
          },
        ]}
      >
        <Checkbox>
          Я принимаю условия
          <a
            onClick={handleDownloadAgreement}
            style={{ marginLeft: '4px', color: 'blue' }}
          >
            пользовательского соглашения
          </a>
        </Checkbox>
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
  );
};
