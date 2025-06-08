import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("app")
export class AppEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  contactEmail: string;

  @Column()
  contactPhone: string;
}
