import { AppEntity } from "@/app/entities/app.entity";
import { CommentEntity } from "@/comment/entities/comment.entity";
import { FeedbackEntity } from "@/feedback/entities/feedback.entity";
import { ProductEntity } from "@/product/entities/product.entity";
import { ReviewEntity } from "@/review/entities/review.entity";
import { UserEntity } from "@/user/entities/user.entity";
import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

const DB_CONFIG_KEY = "database";

const dbConfig = registerAs(
  DB_CONFIG_KEY,
  (): DatabaseConfig => ({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT || 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [
      UserEntity,
      ProductEntity,
      ReviewEntity,
      FeedbackEntity,
      CommentEntity,
      AppEntity
    ],
    migrations: ["src/migrations/*.ts"],
    synchronize: true,
    logging: "all",
    cache: true
  })
);

export type DatabaseConfig = TypeOrmModuleOptions;
export default dbConfig;
