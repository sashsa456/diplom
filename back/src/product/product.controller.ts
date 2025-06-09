import { Public } from "@/auth/is-public.decorator";
import { mimeTypeFilter } from "@/common";
import { imagePattern } from "@/common/utils/mimeTypeFilter";
import { CreateReviewDto } from "@/review/dto/create-review.dto";
import { UpdateReviewDto } from "@/review/dto/update-review.dto";
import { ReviewService } from "@/review/review.service";
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
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { CreateProductDto } from "./dto/create-product.dto";
import { SearchProductDto } from "./dto/search-product.dto";
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
  constructor(
    private readonly productService: ProductService,
    private readonly reviewService: ReviewService
  ) {}

  @Public()
  @Get("/search")
  search(@Query() searchProductDto: SearchProductDto) {
    return this.productService.search(searchProductDto);
  }

  @UseInterceptors(
    FileInterceptor("image", {
      fileFilter: mimeTypeFilter(imagePattern),
      limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
      },
      preservePath: true,
      storage: diskStorage({
        destination: join(__dirname, "..", "..", "uploads"),
        filename: (_req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

          const ext = extname(file.originalname);
          const filename = `${file.originalname.replace(ext, "")}-${uniqueSuffix}${ext}`;

          cb(null, filename);
        }
      })
    })
  )
  @Post()
  @ApiConsumes("multipart/form-data")
  create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
    @UserMe("id") userId: number
  ) {
    return this.productService.create({
      ...createProductDto,
      imageName: image.filename,
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
    @UploadedFile("image") image: Express.Multer.File,
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

  /* Reviews */

  @Get(":id/reviews")
  async findReviews(@Param("id", ParseIntPipe) productId: number) {
    return this.reviewService.findAll({
      where: {
        product: {
          id: productId
        }
      }
    });
  }

  @Post(":id/reviews")
  async createReview(
    @Param("id", ParseIntPipe) productId: number,
    @UserMe("id") userId: number,
    @Body() createReviewDto: CreateReviewDto
  ) {
    createReviewDto.productId = productId;
    createReviewDto.userId = userId;
    return this.reviewService.create(createReviewDto);
  }

  @Patch(":id/reviews/:reviewId")
  @UseGuards(ProductGuard)
  async updateReview(
    @Param("id", ParseIntPipe) productId: number,
    @UserMe("id") userId: number,
    @Param("reviewId", ParseIntPipe) reviewId: number,
    @Body() createReviewDto: UpdateReviewDto
  ) {
    return this.reviewService.update(
      {
        id: reviewId,
        product: { id: productId },
        user: { id: userId }
      },
      createReviewDto
    );
  }

  @Delete(":id/reviews/:reviewId")
  @UseGuards(ProductGuard)
  async removeReview(
    @Param("id", ParseIntPipe) productId: number,
    @UserMe("id") userId: number,
    @Param("reviewId", ParseIntPipe) reviewId: number
  ) {
    return this.reviewService.remove({
      id: reviewId,
      product: { id: productId },
      user: { id: userId }
    });
  }
}
