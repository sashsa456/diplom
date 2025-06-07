import { TimestampEntity } from "@/common";
import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
    nullable: true
  })
  avatar?: string | null;

  /* Relations */
}
