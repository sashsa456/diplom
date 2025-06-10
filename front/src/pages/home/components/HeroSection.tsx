import { Typography, Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import styles from '../HomePage.module.css';

const { Title, Text } = Typography;

export const HeroSection = () => {
  return (
    <div className={styles.heroSection}>
      <div className="container">
        <Title level={1} className="text-white mb-4">
          Оценивайте и обсуждайте детскую одежду вместе с нами
        </Title>
        <Text className="text-white fs-5 mb-4 d-block">
          Делитесь опытом и находите лучшие вещи для ваших детей
        </Text>
        <Row justify="center">
          <Col xs={24} md={12} lg={10}>
            <Link to="/catalog" className="text-white text-decoration-none">
              <Button type="primary" size="large">
                Перейти в каталог
              </Button>
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  );
};
