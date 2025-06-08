import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ILike,
  In,
  Repository
} from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { SearchProductDto } from "./dto/search-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UpdateStatusDto } from "./dto/update-status.dto";
import { ProductEntity } from "./entities/product.entity";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>
  ) {}

  async search(searchProductDto: SearchProductDto) {
    const { query, colors, ...filters } = searchProductDto;

    const makeQueryLike = (
      key: keyof ProductEntity,
      query: string,
      where: FindOptionsWhere<ProductEntity> = {}
    ) =>
      query
        .trim()
        .split(" ")
        .map(q => ({
          [key]: ILike(`%${q}%`),
          ...where
        }));

    const defaultFilters = {
      ...filters,
      ...(colors && { colors: In(colors) })
    };

    const whereForTitle = makeQueryLike("title", query, defaultFilters);
    const whereForDescription = makeQueryLike(
      "description",
      query,
      defaultFilters
    );

    return this.repo.find({
      where: [
        ...whereForTitle,
        ...whereForDescription,
        {
          ...defaultFilters
        }
      ]
    });
  }

  async create(createProductDto: CreateProductDto) {
    const { userId, imageName, ...productDto } = createProductDto;

    return this.repo.save({
      ...productDto,
      image: "/uploads/" + imageName,
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
