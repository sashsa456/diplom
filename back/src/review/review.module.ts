import { ProductEntity } from "@/product/entities/product.entity";
import { UserEntity } from "@/user/entities/user.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReviewEntity } from "./entities/review.entity";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity, ProductEntity, UserEntity])
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService]
})
export class ReviewModule {}
