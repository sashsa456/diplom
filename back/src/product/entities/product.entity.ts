import { TimestampEntity } from "@/common";
import { ReviewEntity } from "@/review/entities/review.entity";
import { UserEntity } from "@/user/entities/user.entity";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  VirtualColumn
} from "typeorm";
import {
  Category,
  Color,
  CountryMade,
  Gender,
  Material,
  ProductStatus,
  Season,
  Size
} from "../product.types";

@Entity("products")
export class ProductEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    default: ""
  })
  description: string;

  @Column({
    nullable: true
  })
  image: string | null;

  @Column()
  price: number;

  @Column({
    type: "enum",
    enum: Category
  })
  category: Category;

  @Column({
    type: "enum",
    enum: Size
  })
  size: Size;

  @Column({
    type: "enum",
    enum: Color,
    array: true
  })
  colors: Color[];

  @Column({
    type: "enum",
    enum: Material
  })
  material: string;

  @Column({
    type: "enum",
    enum: Season
  })
  season: Season;

  @VirtualColumn({
    query: alias =>
      `SELECT AVG(rating) FROM reviews WHERE reviews."productId" = ${alias}.id`,
    type: "float",
    transformer: {
      from: value => Number(value || 0),
      to: value => value
    }
  })
  rating: number;

  @Column({
    type: "enum",
    enum: Gender
  })
  gender: Gender;

  @Column({
    type: "enum",
    enum: CountryMade
  })
  countryMade: CountryMade;

  /* 
    При создании товара необходимо указать, что товар принял админ
    Будет виден только админу
  */
  @Column({
    enum: ProductStatus,
    default: ProductStatus.Pending
  })
  status: ProductStatus;

  /* Relations */
  @ManyToOne(() => UserEntity, user => user.products, {
    nullable: false
  })
  user: UserEntity;

  @OneToMany(() => ReviewEntity, review => review.product, {
    eager: true
  })
  reviews: ReviewEntity[];
}
