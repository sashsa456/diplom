import { CommentGuard } from "@/comment/comment.guard";
import { CommentService } from "@/comment/comment.service";
import { CreateCommentDto } from "@/comment/dto/create-comment.dto";
import { UserMe } from "@/user/user-me.decorator";
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards
} from "@nestjs/common";

@Controller("reviews")
export class ReviewController {
  constructor(private readonly commentService: CommentService) {}

  // @Post()
  // create(@Body() createReviewDto: CreateReviewDto) {
  //   // return this.reviewService.create(createReviewDto);
  // }

  // @Get()
  // findAll() {
  //   return this.reviewService.findAll();
  // }

  // @Get(":id")
  // findOne(@Param("id") id: number) {
  //   return this.reviewService.findOne({
  //     where: { id }
  //   });
  // }

  // @Patch(":id")
  // update(@Param("id") id: number, @Body() updateReviewDto: UpdateReviewDto) {
  //   return this.reviewService.update(id, updateReviewDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: number) {
  //   return this.reviewService.remove(id);
  // }

  /* Comments */

  @Post(":id/comments")
  createComment(
    @Param("id") id: number,
    @UserMe("id") userId: number,
    @Body() createCommentDto: CreateCommentDto
  ) {
    return this.commentService.create({
      ...createCommentDto,
      reviewId: id,
      userId
    });
  }

  // @Patch(":id/comments/:commentId")
  // updateComment(
  //   @Param("id") id: number,
  //   @Param("commentId") commentId: number,
  //   @UserMe("id") userId: number,
  //   @Body() updateCommentDto: CreateCommentDto
  // ) {
  //   return this.commentService.update(commentId, {
  //     ...updateCommentDto,
  //     userId
  //   });
  // }

  @Delete(":id/comments/:commentId")
  @UseGuards(CommentGuard)
  removeComment(
    @Param("id") id: number,
    @Param("commentId") commentId: number
  ) {
    return this.commentService.remove(commentId);
  }
}
