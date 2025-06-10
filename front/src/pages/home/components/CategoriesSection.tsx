import { Typography, Row, Col, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from '../HomePage.module.css';

const { Title, Text } = Typography;

interface CategoryItem {
  key: string;
  label: string;
  icon: string;
}

const categories: CategoryItem[] = [
  { key: 'Верхняя одежда', label: 'Верхняя одежда', icon: '👕' },
  { key: 'Нижнее белье', label: 'Нижнее белье', icon: '🩲' },
  { key: 'Одежда для сна', label: 'Одежда для сна', icon: '😴' },
  { key: 'Головные уборы', label: 'Головные уборы', icon: '🧢' },
  { key: 'Носки', label: 'Носки', icon: '🧦' },
  { key: 'Обувь', label: 'Обувь', icon: '👟' },
  {
    key: 'Одежда для новорожденных',
    label: 'Одежда для новорожденных',
    icon: '👶',
  },
  {
    key: 'Одежда для особых случаев',
    label: 'Одежда для особых случаев',
    icon: '👗',
  },
];

export const CategoriesSection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    navigate(`/catalog?category=${category}`);
  };

  return (
    <div className="container mb-5">
      <Title level={4} className="mb-3">
        Категории
      </Title>
      <Row gutter={[16, 16]}>
        {categories.map((cat) => (
          <Col xs={12} sm={6} md={6} lg={3} key={cat.key}>
            <Card
              hoverable
              className={styles.categoryCard}
              onClick={() => handleCategoryClick(cat.key)}
            >
              <div className={styles.categoryIcon}>{cat.icon}</div>
              <Text className={styles.categoryText}>{cat.label}</Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
