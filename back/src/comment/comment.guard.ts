import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { CommentService } from "./comment.service";

@Injectable()
export class CommentGuard implements CanActivate {
  constructor(private readonly commentService: CommentService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request.user) {
      return false;
    }

    if (request.user.isAdmin) {
      return true;
    }

    const comment = await this.commentService.findOne({
      where: {
        id: +request.params.commentId,
        user: {
          id: request.user.id
        },
        review: {
          id: +request.params.id
        }
      }
    });

    if (!comment) {
      return false;
    }

    return true;
  }
}
