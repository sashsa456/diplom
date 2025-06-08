import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdateAppDto } from "./dtos/update-app.dto";
import { AppEntity } from "./entities/app.entity";

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(AppEntity) private readonly repo: Repository<AppEntity>
  ) {}

  getApp() {
    return this.repo.findOne({ where: { id: 1 } });
  }

  async update(updateAppDto: UpdateAppDto) {
    await this.repo.update(1, updateAppDto);
    return {
      message: "Информация обновлена"
    };
  }

  seed() {
    return this.repo.save({
      name: "Seeded Name",
      contactEmail: "seeded_email@example.com",
      contactPhone: "+1234567890"
    });
  }
}
