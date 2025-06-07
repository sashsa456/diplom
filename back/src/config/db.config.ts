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
    entities: [UserEntity],
    migrations: ["src/migrations/*.ts"],
    synchronize: true,
    logging: "all"
  })
);

export type DatabaseConfig = TypeOrmModuleOptions;
export default dbConfig;
