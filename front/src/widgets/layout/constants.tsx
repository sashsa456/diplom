import {
  HomeOutlined,
  ShoppingOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

export const menuItems = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: <Link to="/">Главная</Link>,
  },
  {
    key: '/catalog',
    icon: <ShoppingOutlined />,
    label: <Link to="/catalog">Каталог</Link>,
  },
  {
    key: '/feedback',
    icon: <MessageOutlined />,
    label: <Link to="/feedback">Обратная связь</Link>,
  },
];
