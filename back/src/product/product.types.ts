export enum Color {
  Red = "Красный",
  Green = "Зеленый",
  Blue = "Синий",
  Yellow = "Желтый",
  Black = "Черный",
  White = "Белый"
}

export enum Category {
  Outerwear = "Верхняя одежда",
  Underwear = "Нижнее белье",
  Sleepwear = "Одежда для сна",
  Hats = "Головные уборы",
  SocksTights = "Носки",
  Shoes = "Обувь",
  NewbornClothing = "Одежда для новорожденных",
  SpecialOccasion = "Одежда для особых случаев"
}

export enum Season {
  Winter = "Зима",
  Summer = "Лето",
  DemiSeason = "Демисезон"
}

export enum Gender {
  Boys = "Мужское",
  Girls = "Женское",
  Unisex = "Унисекс"
}

export enum Material {
  Cotton = "Хлопок",
  Wool = "Шерсть",
  Polyester = "Полиэстер",
  Denim = "Джинса",
  Synthetic = "Синтетика"
}

export enum CountryMade {
  Russia = "Россия",
  China = "Китай",
  USA = "США"
}

export enum Size {
  // Младенцы (0–2 года)
  Size50 = "50 см (1-2 мес)",
  Size56 = "56 см (3 мес)",
  Size62 = "62 см (3-6 мес)",
  Size68 = "68 см (6-9 мес)",
  Size74 = "74 см (9-12 мес)",
  Size80 = "80 см (1-1.5 года)",
  Size86 = "86 см (1.5-2 года)",
  Size92 = "92 см (2 года)",

  // Дети (2–10 лет)
  Size98 = "98 см (2-3 года)",
  Size104 = "104 см (3-4 года)",
  Size110 = "110 см (4-5 лет)",
  Size116 = "116 см (5-6 лет)",
  Size122 = "122 см (6-7 лет)",
  Size128 = "128 см (7-8 лет)",
  Size134 = "134 см (8-9 лет)",
  Size140 = "140 см (9-10 лет)",

  // Подростки (10–17 лет)
  Size146 = "146 см (10-11 лет)",
  Size152 = "152 см (11-12 лет)",
  Size158 = "158 см (12-13 лет)",
  Size164 = "164 см (13-14 лет)",
  Size170 = "170 см (14-15 лет)",
  Size176 = "176 см (15-16 лет)",
  Size182 = "182 см (16-17 лет)",
  Size188 = "188 см (17+ лет)"
}

export enum ProductStatus {
  Pending = "pending",
  Accepted = "accepted",
  Rejected = "rejected"
}
