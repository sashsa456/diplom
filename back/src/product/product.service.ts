import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UpdateStatusDto } from "./dto/update-status.dto";
import { ProductEntity } from "./entities/product.entity";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>
  ) {}

  async create(createProductDto: CreateProductDto & { userId: number }) {
    const { userId, ...productDto } = createProductDto;

    return this.repo.save({
      ...productDto,
      user: { id: userId }
    });
  }

  async findAll(options: FindManyOptions<ProductEntity> = {}) {
    return this.repo.find(options);
  }

  async findOne(options: FindOneOptions<ProductEntity> = {}) {
    const product = await this.repo.findOne(options);

    if (!product) {
      throw new NotFoundException("Товар не найден");
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto & Partial<UpdateStatusDto>
  ) {
    const product = await this.findOne({
      where: {
        id
      }
    });

    await this.repo.update(product.id, updateProductDto);
    return {
      message: "Товар обновлен"
    };
  }

  async remove(id: number) {
    const product = await this.findOne({
      where: {
        id
      }
    });

    await this.repo.remove(product);
    return {
      message: "Товар удален"
    };
  }
}
