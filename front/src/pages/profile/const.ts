import ava from "./ava.png";

type User = { 
    id: number;
    username: string;
    password: string;
    email: string;
    avatar?: string; 
    createdAt: string; 
    refreshToken?: string | null;
    isAdmin: boolean;
};

type Product = { 
    id: number;
    title: string;
    price: number;
    img: string;
    rating: number;
};

export const users: User[] = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123', 
    email: 'adminAlex.ru',
    avatar: ava,
    createdAt: '2025-06-07',
    refreshToken: null,
    isAdmin: true,
  },
  {
    id: 2,
    username: 'user1',
    password: 'user123',
    email: 'user1@example.com',
    createdAt: '2025-06-01',
    isAdmin: false,
  },
];

export const productList: Product[] = [
  {
    id: 1,
    title: 'Футболки для малышей комплект 2 шт',
    price: 3250,
    img: 'https://basket-14.wbbasket.ru/vol2084/part208495/208495470/images/big/1.webp',
    rating: 2,
  },
  {
    id: 2,
    title: 'Детский вязаный костюм',
    price: 1015,
    img: 'https://basket-13.wbbasket.ru/vol1973/part197300/197300771/images/c246x328/1.webp',
    rating: 1,
  },
  {
    id: 3,
    title: 'Спортивный костюм для девочки',
    price: 1723,
    img: 'https://basket-12.wbbasket.ru/vol1884/part188449/188449379/images/c246x328/1.webp',
    rating: 1,
  },
];
