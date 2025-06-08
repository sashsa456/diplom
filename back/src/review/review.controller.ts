import { Controller } from "@nestjs/common";
import { ReviewService } from "./review.service";

@Controller("reviews")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

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
}
