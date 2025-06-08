import { AdminGuard } from "@/user/admin.guard";
import { UserMe } from "@/user/user-me.decorator";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UpdateStatusDto } from "./dto/update-status.dto";
import { ProductGuard } from "./product.guard";
import { ProductService } from "./product.service";
import { ProductStatus } from "./product.types";

const productStatusMessages: Record<ProductStatus, string> = {
  [ProductStatus.Accepted]: "Товар принят",
  [ProductStatus.Rejected]: "Товар отклонен",
  [ProductStatus.Pending]: "Товар на модерации"
};

@Controller("products")
@ApiTags("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @UserMe("id") userId: number
  ) {
    return this.productService.create({
      ...createProductDto,
      userId
    });
  }

  @UseGuards(AdminGuard)
  @Get()
  findAll(@Query("status") status: ProductStatus) {
    return this.productService.findAll({
      where:
        status !== null
          ? {
              status
            }
          : {}
    });
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.productService.findOne({
      where: {
        id
      }
    });
  }

  // @Get("search")
  // search() {
  //   return this.productService.search();
  // }

  @Patch(":id")
  @UseGuards(ProductGuard)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(":id")
  @UseGuards(ProductGuard)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }

  @Post(":id/status")
  @UseGuards(AdminGuard)
  async status(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto
  ) {
    await this.productService.update(id, updateStatusDto);

    return {
      message: productStatusMessages[updateStatusDto.status]
    };
  }
}
