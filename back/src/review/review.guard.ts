import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { ReviewService } from "./review.service";

@Injectable()
export class ReviewGuard implements CanActivate {
  constructor(private readonly reviewService: ReviewService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request.user) {
      return false;
    }

    if (!request.user.isAdmin) {
      return true;
    }

    const review = await this.reviewService.findOne({
      where: {
        id: +request.params.reviewId,
        user: {
          id: request.user.id
        },
        product: {
          id: +request.params.id
        }
      }
    });

    if (!review) {
      return false;
    }

    return true;
  }
}
