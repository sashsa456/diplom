import { UserModule } from "@/user/user.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [UserModule, JwtModule, ConfigModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
