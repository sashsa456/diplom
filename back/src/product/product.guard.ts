import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { ProductService } from "./product.service";

@Injectable()
export class ProductGuard implements CanActivate {
  constructor(private readonly productService: ProductService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request.user) {
      return false;
    }

    if (!request.user.isAdmin) {
      return true;
    }

    /* FIXME: Бдшка лишний раз нагружается, т.к делается два запроса - при проверки и при исполнении метода в сервисе */
    const product = await this.productService.findOne({
      where: {
        id: +request.params.id,
        user: {
          id: request.user.id
        }
      }
    });

    if (!product) {
      return false;
    }

    return true;
  }
}
