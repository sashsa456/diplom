import { AuthGuard } from "@/auth/auth.guard";
import { AuthModule } from "@/auth/auth.module";
import dbConfig from "@/config/db.config";
import { validateEnv } from "@/config/env.config";
import jwtConfig from "@/config/jwt.config";
import tokenConfig from "@/config/token.config";
import { ProductModule } from "@/product/product.module";
import { UserModule } from "@/user/user.module";
import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [dbConfig, jwtConfig, tokenConfig],
      envFilePath: [
        ".env",
        ".env.local",
        `.env.${process.env.NODE_ENV}`,
        `.env.${process.env.NODE_ENV}.local`
      ],
      validate: validateEnv
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get("database") as TypeOrmModuleOptions,
      inject: [ConfigService]
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get("jwt") as JwtModuleOptions,
      inject: [ConfigService]
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "..", "static"),
      serveRoot: "/api/static"
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "..", "uploads"),
      serveRoot: "/api/uploads"
    }),
    UserModule,
    AuthModule,
    ProductModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
  ]
})
export class AppModule {}
