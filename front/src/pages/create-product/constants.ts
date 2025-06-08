export const FORM_FIELDS = {
  title: {
    name: 'title',
    label: 'Название',
    placeholder: 'Введите название товара',
  },
  description: {
    name: 'description',
    label: 'Описание',
    placeholder: 'Введите описание товара',
  },
  price: {
    name: 'price',
    label: 'Цена',
    placeholder: 'Введите цену',
  },
  category: {
    name: 'category',
    label: 'Категория',
    placeholder: 'Выберите категорию',
  },
  size: {
    name: 'size',
    label: 'Размер',
    placeholder: 'Выберите размер',
  },
  colors: {
    name: 'colors',
    label: 'Цвета',
    placeholder: 'Выберите цвета',
  },
  material: {
    name: 'material',
    label: 'Материал',
    placeholder: 'Выберите материал',
  },
  season: {
    name: 'season',
    label: 'Сезон',
    placeholder: 'Выберите сезон',
  },
  gender: {
    name: 'gender',
    label: 'Пол',
    placeholder: 'Выберите пол',
  },
  countryMade: {
    name: 'countryMade',
    label: 'Страна производитель',
    placeholder: 'Выберите страну',
  },
};

export const FORM_RULES = {
  required: (message: string) => ({
    required: true,
    message,
  }),
};
