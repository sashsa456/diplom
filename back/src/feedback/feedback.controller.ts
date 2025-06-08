import { Public } from "@/auth/is-public.decorator";
import { AdminGuard } from "@/user/admin.guard";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { FeedbackService } from "./feedback.service";

@ApiTags("feedbacks")
@Controller("feedbacks")
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Public()
  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  @UseGuards(AdminGuard)
  findAll() {
    return this.feedbackService.findAll();
  }

  @Delete(":id")
  @UseGuards(AdminGuard)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.feedbackService.remove(id);
  }
}
