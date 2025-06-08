import { Public } from "@/auth/is-public.decorator";
import { AdminGuard } from "@/user/admin.guard";
import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { UpdateAppDto } from "./dtos/update-app.dto";

@Controller("/app")
@ApiTags("app")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getApp() {
    return this.appService.getApp();
  }

  @Patch()
  @UseGuards(AdminGuard)
  update(@Body() updateAppDto: UpdateAppDto) {
    return this.appService.update(updateAppDto);
  }
}
