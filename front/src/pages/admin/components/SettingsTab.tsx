import { Card, Typography, Form, Input, Button, message } from 'antd';
import { useAppInfo, useAppInfoUpdate, AppInfo } from '@/shared/api/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/client';
import { useEffect } from 'react';

const { Title } = Typography;

export const SettingsTab = () => {
  const { data: appInfo } = useAppInfo();
  const updateAppInfoMutation = useAppInfoUpdate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm<AppInfo>();

  useEffect(() => {
    if (appInfo) {
      form.setFieldsValue({
        name: appInfo.name,
        contactEmail: appInfo.contactEmail,
        contactPhone: appInfo.contactPhone,
      });
    }
  }, [appInfo, form]);

  const handleAppInfoUpdate = async (values: AppInfo) => {
    try {
      await updateAppInfoMutation.mutateAsync(values);
      message.success('Настройки сайта успешно обновлены!');
      queryClient.invalidateQueries({ queryKey: [queryKeys.app.all] });
    } catch (error) {
      message.error('Ошибка при сохранении настроек сайта.');
      console.error('Update app info error:', error);
    }
  };

  return (
    <Card>
      <Title level={4}>Настройки сайта</Title>
      <Form layout="vertical" form={form} onFinish={handleAppInfoUpdate}>
        <Form.Item
          name="name"
          label="Название сайта"
          initialValue={appInfo?.name}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="contactEmail"
          label="Электронная почта"
          initialValue={appInfo?.contactEmail}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="contactPhone"
          label="Телефон"
          initialValue={appInfo?.contactPhone}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={updateAppInfoMutation.isPending}
          >
            Сохранить настройки
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
