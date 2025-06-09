import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { CommentEntity } from "./entities/comment.entity";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>
  ) {}

  create(createCommentDto: CreateCommentDto) {
    const { userId, reviewId, ...commentDto } = createCommentDto;

    return this.commentRepository.save({
      ...commentDto,
      user: { id: userId },
      review: { id: reviewId }
    });
  }

  findAll(options: FindManyOptions<CommentEntity> = {}) {
    return this.commentRepository.find(options);
  }

  async findOne(options: FindOneOptions<CommentEntity> = {}) {
    const comment = await this.commentRepository.findOne(options);

    if (!comment) {
      throw new NotFoundException("Комментарий не найден");
    }

    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const { userId, reviewId, ...commentDto } = updateCommentDto;

    const comment = await this.findOne({
      where: {
        id,
        user: { id: userId },
        review: { id: reviewId }
      }
    });

    await this.commentRepository.update(comment.id, commentDto);
    return {
      message: "Комментарий обновлен"
    };
  }

  async remove(id: number) {
    const comment = await this.findOne({ where: { id } });

    await this.commentRepository.remove(comment);
    return {
      message: "Комментарий удален"
    };
  }
}
