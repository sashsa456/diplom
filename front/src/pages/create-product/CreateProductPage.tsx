import { useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  message,
  Typography,
  Upload,
  Row,
  Col,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useCreateProduct } from '@/shared/api/hooks';
import {
  PRODUCT_CATEGORIES,
  PRODUCT_SIZES,
  PRODUCT_COLORS,
  PRODUCT_MATERIALS,
  PRODUCT_SEASONS,
  PRODUCT_GENDERS,
  PRODUCT_COUNTRIES,
} from '@/shared/constants/product';
import { FORM_FIELDS, FORM_RULES } from './constants';
import styles from './CreateProductPage.module.css';
import { useState } from 'react';

const { Title } = Typography;
const { TextArea } = Input;

interface CreateProductFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  size: string;
  colors: string[];
  material: string;
  season: string;
  gender: string;
  countryMade: string;
}

export const CreateProductPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<CreateProductFormData>();
  const createProduct = useCreateProduct();

  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (values: CreateProductFormData) => {
    try {
      const productData = {
        ...values,
        image: image!,
      };
      console.log('Отправляемые данные продукта:', productData);
      await createProduct.mutateAsync(productData);
      message.success('Товар успешно создан!');
      navigate('/profile');
    } catch (error) {
      message.error('Ошибка при создании товара');
      console.error('Create product error:', error);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Загрузить фото</div>
    </div>
  );

  return (
    <div className={styles.container}>
      <Card className={styles.formCard}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          Создание нового товара
        </Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name={FORM_FIELDS.title.name}
                label={FORM_FIELDS.title.label}
                rules={[FORM_RULES.required('введите название товара')]}
              >
                <Input allowClear placeholder={FORM_FIELDS.title.placeholder} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={FORM_FIELDS.price.name}
                label={FORM_FIELDS.price.label}
                rules={[FORM_RULES.required('введите цену товара')]}
              >
                <InputNumber min={0} prefix="₽" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name={FORM_FIELDS.description.name}
            label={FORM_FIELDS.description.label}
            rules={[FORM_RULES.required('введите описание товара')]}
          >
            <TextArea
              rows={4}
              placeholder={FORM_FIELDS.description.placeholder}
            />
          </Form.Item>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name={FORM_FIELDS.category.name}
                label={FORM_FIELDS.category.label}
                rules={[FORM_RULES.required('выберите категорию')]}
              >
                <Select
                  allowClear
                  options={PRODUCT_CATEGORIES}
                  placeholder={FORM_FIELDS.category.placeholder}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={FORM_FIELDS.size.name}
                label={FORM_FIELDS.size.label}
                rules={[FORM_RULES.required('выберите размер')]}
              >
                <Select
                  allowClear
                  options={PRODUCT_SIZES}
                  placeholder={FORM_FIELDS.size.placeholder}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name={FORM_FIELDS.colors.name}
            label={FORM_FIELDS.colors.label}
            rules={[FORM_RULES.required('выберите цвета')]}
          >
            <Select
              allowClear
              mode="multiple"
              options={PRODUCT_COLORS}
              placeholder={FORM_FIELDS.colors.placeholder}
            />
          </Form.Item>

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name={FORM_FIELDS.material.name}
                label={FORM_FIELDS.material.label}
                rules={[FORM_RULES.required('выберите материал')]}
              >
                <Select
                  allowClear
                  options={PRODUCT_MATERIALS}
                  placeholder={FORM_FIELDS.material.placeholder}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={FORM_FIELDS.season.name}
                label={FORM_FIELDS.season.label}
                rules={[FORM_RULES.required('выберите сезон')]}
              >
                <Select
                  allowClear
                  options={PRODUCT_SEASONS}
                  placeholder={FORM_FIELDS.season.placeholder}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={FORM_FIELDS.gender.name}
                label={FORM_FIELDS.gender.label}
                rules={[FORM_RULES.required('выберите пол')]}
              >
                <Select
                  allowClear
                  options={PRODUCT_GENDERS}
                  placeholder={FORM_FIELDS.gender.placeholder}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name={FORM_FIELDS.countryMade.name}
            label={FORM_FIELDS.countryMade.label}
            rules={[FORM_RULES.required('выберите страну производителя')]}
          >
            <Select
              allowClear
              options={PRODUCT_COUNTRIES}
              placeholder={FORM_FIELDS.countryMade.placeholder}
            />
          </Form.Item>

          <Form.Item
            name="image"
            label="Изображение товара"
            rules={[
              {
                validator: async (_, value) => {
                  if (!value) {
                    return Promise.reject(
                      new Error('Пожалуйста, загрузите изображение'),
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              style={{ width: '100%' }}
              beforeUpload={(file) => {
                setImage(file);
                return false;
              }}
              onRemove={() => {
                setImage(null);
              }}
              onPreview={() => {}}
            >
              {uploadButton}
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={createProduct.isPending}
              block
              size="large"
            >
              Создать товар
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
