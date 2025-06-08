import { ReviewEntity } from "@/review/entities/review.entity";
import { ReviewModule } from "@/review/review.module";
import { UserEntity } from "@/user/entities/user.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "./entities/product.entity";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, UserEntity, ReviewEntity]),
    ReviewModule
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
