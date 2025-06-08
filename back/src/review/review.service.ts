import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository
} from "typeorm";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { ReviewEntity } from "./entities/review.entity";

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly repo: Repository<ReviewEntity>
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const { userId, productId, ...reviewDto } = createReviewDto;

    return this.repo.save({
      ...reviewDto,
      user: { id: userId },
      product: { id: productId }
    });
  }

  async findAll(options: FindManyOptions<ReviewEntity> = {}) {
    return this.repo.find(options);
  }

  async findOne(options: FindOneOptions<ReviewEntity> = {}) {
    const review = await this.repo.findOne(options);

    if (!review) {
      throw new NotFoundException("Отзыв не найден");
    }

    return review;
  }

  async update(
    where: FindOptionsWhere<ReviewEntity> = {},
    updateReviewDto: UpdateReviewDto
  ) {
    const review = await this.findOne({
      where
    });

    await this.repo.update(review.id, updateReviewDto);
    return {
      message: "Отзыв обновлен"
    };
  }

  async remove(where: FindOptionsWhere<ReviewEntity> = {}) {
    const review = await this.findOne({
      where
    });

    await this.repo.remove(review);
    return {
      message: "Отзыв удален"
    };
  }
}
