import { TimestampEntity } from "@/common";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("feedbacks")
export class FeedbackEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  topic: string;

  @Column()
  email: string;

  @Column()
  text: string;
}
