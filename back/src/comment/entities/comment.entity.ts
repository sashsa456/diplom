import { ReviewEntity } from "@/review/entities/review.entity";
import { UserEntity } from "@/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("comments")
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @ManyToOne(() => UserEntity, user => user.comments, {
    eager: true
  })
  user: UserEntity;

  @ManyToOne(() => ReviewEntity, review => review.comments)
  review: ReviewEntity;
}
