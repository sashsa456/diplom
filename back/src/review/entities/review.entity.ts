import { TimestampEntity } from "@/common";
import { ProductEntity } from "@/product/entities/product.entity";
import { UserEntity } from "@/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("reviews")
export class ReviewEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  rating: number;

  @ManyToOne(() => ProductEntity, product => product.reviews, {
    createForeignKeyConstraints: false
  })
  product: ProductEntity;

  @ManyToOne(() => UserEntity, user => user.reviews, {
    eager: true
  })
  user: UserEntity;
}
