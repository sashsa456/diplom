import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Between,
  FindManyOptions,
  FindOneOptions,
  ILike,
  In,
  Repository
} from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { SearchProductDto } from "./dto/search-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UpdateStatusDto } from "./dto/update-status.dto";
import { ProductEntity } from "./entities/product.entity";
import { Material, ProductStatus } from "./product.types";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>
  ) {}

  async search(searchProductDto: SearchProductDto) {
    const {
      query,
      colors,
      minPrice,
      maxPrice,
      rating,
      status = ProductStatus.Accepted,
      ...filters
    } = searchProductDto;

    console.log(searchProductDto);

    const queryBuilder = this.repo.createQueryBuilder("product");

    // Базовые условия
    if (status) {
      queryBuilder.andWhere({ status });
    } else {
      queryBuilder.andWhere({ status: ProductStatus.Accepted });
    }

    // Текстовый поиск
    if (query) {
      const searchTerms = query.trim().split(" ");
      const searchConditions = searchTerms.map(term => ({
        title: ILike(`%${term}%`),
        description: ILike(`%${term}%`)
      }));

      queryBuilder.andWhere(searchConditions);
    }

    // Ценовой диапазон
    if (minPrice !== undefined || maxPrice !== undefined) {
      queryBuilder.andWhere({
        price: Between(minPrice || 0, maxPrice || Number.MAX_SAFE_INTEGER)
      });
    }

    // Фильтр по цветам
    if (colors && colors.length > 0) {
      queryBuilder.andWhere("product.colors && ARRAY[:...colors]", { colors });
    }

    // Фильтр по рейтингу (если есть виртуальное поле)
    if (rating !== undefined) {
      queryBuilder.andWhere(
        `(SELECT AVG(r.rating) FROM reviews r WHERE r."productId" = product.id) >= :rating`,
        { rating }
      );
    }

    // Остальные фильтры
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          queryBuilder.andWhere({ [key]: In(value as Material[]) });
          // value.forEach((item) => {
          //   queryBuilder.orWhere({ [key]: item });
          // });
        } else {
          queryBuilder.andWhere({ [key]: value });
        }
      }
    });

    return queryBuilder.getMany();
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
