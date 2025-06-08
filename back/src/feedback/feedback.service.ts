import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { FeedbackEntity } from "./entities/feedback.entity";

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly repo: Repository<FeedbackEntity>
  ) {}

  create(createFeedbackDto: CreateFeedbackDto) {
    return this.repo.save(createFeedbackDto);
  }

  async findAll(options: FindManyOptions<FeedbackEntity> = {}) {
    return this.repo.find(options);
  }

  async findOne(options: FindOneOptions<FeedbackEntity> = {}) {
    const feedback = await this.repo.findOne(options);

    if (!feedback) {
      throw new NotFoundException("Фидбек не найден");
    }

    return feedback;
  }

  async remove(id: number) {
    await this.findOne({ where: { id } });
    await this.repo.delete(id);

    return {
      message: "Фидбек удален"
    };
  }
}
