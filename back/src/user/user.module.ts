import { CommentEntity } from "@/comment/entities/comment.entity";
import { ProductEntity } from "@/product/entities/product.entity";
import { ReviewEntity } from "@/review/entities/review.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ProductEntity,
      ReviewEntity,
      CommentEntity
    ])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
