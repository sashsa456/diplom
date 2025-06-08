import { Card, Form, Input, Button, Typography, Row, Col, message } from 'antd';
import { MailOutlined, UserOutlined, ReadOutlined } from '@ant-design/icons';
import { useAppInfo, useSendFeedback } from '@/shared/api/hooks';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface FeedbackFormData {
  name: string;
  email: string;
  topic: string;
  text: string;
}

export const FeedbackPage = () => {
  const [form] = Form.useForm();
  const sendFeedback = useSendFeedback();


  const { data: appInfo } = useAppInfo();

  const onFinish = async (values: FeedbackFormData) => {
    try {
      await sendFeedback.mutateAsync(values);
      message.success(
        'Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.',
      );
      form.resetFields();
    } catch {
      message.error(
        'Ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.',
      );
    }
  };

  return (
    <div className="container py-4">
      <Title level={2} className="text-center mb-4">
        Обратная связь
      </Title>
      <Paragraph className="text-center mb-5" type="secondary">
        Мы всегда рады услышать ваше мнение и ответить на ваши вопросы
      </Paragraph>

      <Card className="mb-5">
        <Form
          form={form}
          name="feedback"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="Ваше имя"
                rules={[
                  { required: true, message: 'Пожалуйста, введите ваше имя' },
                  { min: 2, message: 'Имя должно содержать минимум 2 символа' },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Имя" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Пожалуйста, введите ваш email' },
                  {
                    type: 'email',
                    message: 'Пожалуйста, введите корректный email',
                  },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="topic"
                label="Тема"
                rules={[
                  {
                    required: true,
                    message: 'Пожалуйста, введите тему сообщения',
                  },
                  {
                    min: 5,
                    message: 'Тема должна содержать минимум 5 символов',
                  },
                ]}
              >
                <Input prefix={<ReadOutlined />} placeholder="Тема" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="text"
                label="Сообщение"
                rules={[
                  {
                    required: true,
                    message: 'Пожалуйста, введите ваше сообщение',
                  },
                  {
                    min: 10,
                    message: 'Сообщение должно содержать минимум 10 символов',
                  },
                ]}
              >
                <TextArea rows={4} placeholder="Ваше сообщение..." />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={sendFeedback.isPending}
              >
                Отправить
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <div>
        <Title level={4} className="mb-3">
          Контактная информация
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12}>
            <Text strong>Email:</Text>
            <Paragraph>{appInfo?.contactEmail}</Paragraph>
          </Col>
          <Col xs={24} sm={12}>
            <Text strong>Телефон:</Text>
            <Paragraph>{appInfo?.contactPhone}</Paragraph>
          </Col>
          <Col xs={24}>
            <Text strong>Адрес:</Text>
            <Paragraph>г. Москва, ул. Примерная, д. 123</Paragraph>
          </Col>
        </Row>
      </div>
    </div>
  );
};
