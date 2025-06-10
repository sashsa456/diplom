import { Card, Typography, Row, Col } from 'antd';
import { useAppInfo } from '@/shared/api/hooks';
import { FeedbackForm } from './components/FeedbackForm';

const { Title, Text, Paragraph } = Typography;

export const FeedbackPage = () => {
  const { data: appInfo } = useAppInfo();

  return (
    <div className="container py-4">
      <Title level={2} className="text-center mb-4">
        Обратная связь
      </Title>
      <Paragraph className="text-center mb-5" type="secondary">
        Мы всегда рады услышать ваше мнение и ответить на ваши вопросы
      </Paragraph>

      <Card className="mb-5">
        <FeedbackForm />
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
