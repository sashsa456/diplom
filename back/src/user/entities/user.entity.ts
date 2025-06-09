import { CommentEntity } from "@/comment/entities/comment.entity";
import { TimestampEntity } from "@/common";
import { ProductEntity } from "@/product/entities/product.entity";
import { ReviewEntity } from "@/review/entities/review.entity";
import { Exclude } from "class-transformer";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class UserEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({
    unique: true
  })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    nullable: true,
    type: String
  })
  @Exclude()
  refreshToken?: string | null;

  @Column({
    default: false
  })
  isAdmin: boolean;

  @Column({
    default: true
  })
  isActive: boolean;

  @Column({
    nullable: true
  })
  avatar?: string | null;

  /* Relations */
  @OneToMany(() => ProductEntity, product => product.user)
  products: ProductEntity[];

  @OneToMany(() => ReviewEntity, review => review.user)
  reviews: ReviewEntity[];

  @OneToMany(() => CommentEntity, comment => comment.user)
  comments: CommentEntity[];
}
