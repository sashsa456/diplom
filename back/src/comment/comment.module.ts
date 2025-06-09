import { ReviewEntity } from "@/review/entities/review.entity";
import { UserEntity } from "@/user/entities/user.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentService } from "./comment.service";
import { CommentEntity } from "./entities/comment.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, ReviewEntity, UserEntity])
  ],
  providers: [CommentService],
  exports: [CommentService]
})
export class CommentModule {}
