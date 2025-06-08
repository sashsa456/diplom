import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Upload,
  message,
  Typography,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useCreateProduct } from '@/shared/api/hooks';
import styles from './CreateProductPage.module.css';

const { Title } = Typography;
const { TextArea } = Input;

const categories = [
  { value: 'clothing', label: 'Одежда' },
  { value: 'shoes', label: 'Обувь' },
  { value: 'accessories', label: 'Аксессуары' },
];

const sizes = [
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
];

const colors = [
  { value: 'red', label: 'Красный' },
  { value: 'blue', label: 'Синий' },
  { value: 'green', label: 'Зеленый' },
  { value: 'black', label: 'Черный' },
  { value: 'white', label: 'Белый' },
];

const materials = [
  { value: 'cotton', label: 'Хлопок' },
  { value: 'wool', label: 'Шерсть' },
  { value: 'silk', label: 'Шелк' },
  { value: 'leather', label: 'Кожа' },
];

const seasons = [
  { value: 'summer', label: 'Лето' },
  { value: 'winter', label: 'Зима' },
  { value: 'spring', label: 'Весна' },
  { value: 'autumn', label: 'Осень' },
];

const genders = [
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
  { value: 'unisex', label: 'Унисекс' },
];

export const CreateProductPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>('');
  const createProduct = useCreateProduct();

  const handleSubmit = async (values: any) => {
    try {
      await createProduct.mutateAsync({
        ...values,
        image: imageUrl,
        rating: 0, // Начальный рейтинг для нового товара
      });
      message.success('Товар успешно создан!');
      navigate('/profile');
    } catch (error) {
      message.error('Ошибка при создании товара');
      console.error('Create product error:', error);
    }
  };

  const handleImageUpload = (info: any) => {
    if (info.file.status === 'done') {
      setImageUrl(info.file.response.url);
      message.success('Изображение успешно загружено');
    } else if (info.file.status === 'error') {
      message.error('Ошибка при загрузке изображения');
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.formCard}>
        <Title level={2}>Создание нового товара</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
        >
          <Form.Item
            name="title"
            label="Название товара"
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите название товара',
              },
            ]}
          >
            <Input placeholder="Введите название товара" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Описание"
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите описание товара',
              },
            ]}
          >
            <TextArea rows={4} placeholder="Введите описание товара" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Цена"
            rules={[
              { required: true, message: 'Пожалуйста, введите цену товара' },
            ]}
          >
            <InputNumber min={0} prefix="₽" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="category"
            label="Категория"
            rules={[
              { required: true, message: 'Пожалуйста, выберите категорию' },
            ]}
          >
            <Select options={categories} placeholder="Выберите категорию" />
          </Form.Item>

          <Form.Item
            name="size"
            label="Размер"
            rules={[{ required: true, message: 'Пожалуйста, выберите размер' }]}
          >
            <Select options={sizes} placeholder="Выберите размер" />
          </Form.Item>

          <Form.Item
            name="color"
            label="Цвет"
            rules={[{ required: true, message: 'Пожалуйста, выберите цвет' }]}
          >
            <Select options={colors} placeholder="Выберите цвет" />
          </Form.Item>

          <Form.Item
            name="material"
            label="Материал"
            rules={[
              { required: true, message: 'Пожалуйста, выберите материал' },
            ]}
          >
            <Select options={materials} placeholder="Выберите материал" />
          </Form.Item>

          <Form.Item
            name="season"
            label="Сезон"
            rules={[{ required: true, message: 'Пожалуйста, выберите сезон' }]}
          >
            <Select options={seasons} placeholder="Выберите сезон" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Пол"
            rules={[{ required: true, message: 'Пожалуйста, выберите пол' }]}
          >
            <Select options={genders} placeholder="Выберите пол" />
          </Form.Item>

          <Form.Item
            name="country"
            label="Страна производитель"
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите страну производителя',
              },
            ]}
          >
            <Input placeholder="Введите страну производителя" />
          </Form.Item>

          <Form.Item
            label="Изображение товара"
            rules={[
              {
                required: true,
                message: 'Пожалуйста, загрузите изображение товара',
              },
            ]}
          >
            <Upload
              name="file"
              action="/api/upload" // TODO: Заменить на реальный эндпоинт загрузки
              onChange={handleImageUpload}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Загрузить изображение</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={createProduct.isPending}
              block
            >
              Создать товар
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
