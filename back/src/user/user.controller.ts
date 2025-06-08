import { mimeTypeFilter } from "@/common";
import { imagePattern } from "@/common/utils/mimeTypeFilter";
import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { AdminGuard } from "./admin.guard";
import { UserEntity } from "./entities/user.entity";
import { UserMe } from "./user-me.decorator";
import { UserService } from "./user.service";

@ApiTags("users")
@ApiBearerAuth()
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  @Get()
  @UseGuards(new AdminGuard())
  findAll() {
    return this.userService.findAll();
  }

  // @Get(":id")
  // findOne(@Param("id", ParseIntPipe) id: number) {
  //   return this.userService.findOne({ id });
  // }

  // @Patch(":id")
  // update(
  //   @Param("id", ParseIntPipe) id: number,
  //   @Body() updateUserDto: UpdateUserDto
  // ) {
  //   return this.userService.update(id, updateUserDto);
  // }

  @Delete(":id")
  @UseGuards(new AdminGuard())
  remove(@Param("id", ParseIntPipe) id: number, @UserMe("id") userId: number) {
    if (id === userId) {
      throw new BadRequestException("Cannot delete yourself");
    }

    return this.userService.remove(id);
  }

  @Get("me")
  me(@UserMe() user: UserEntity) {
    return user;
  }

  @Post("me/avatar")
  @UseInterceptors(
    FileInterceptor("avatar", {
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
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        avatar: {
          type: "string",
          format: "binary"
        }
      }
    }
  })
  setAvatar(
    @UserMe("id") userId: number,
    @UploadedFile()
    avatar: Express.Multer.File
  ) {
    const avatarUrl = `/uploads/${avatar.filename}`;

    return this.userService.update(userId, {
      avatar: avatarUrl
    });
  }

  @Get("me/products")
  getProducts(@UserMe("id") userId: number) {
    return this.userService.findOne({
      where: {
        id: userId
      },
      select: {
        products: true
      },
      relations: {
        products: true
      }
    });
  }
}
