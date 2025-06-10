import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { SearchProductDto } from "./dto/search-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UpdateStatusDto } from "./dto/update-status.dto";
import { ProductEntity } from "./entities/product.entity";
import { ProductStatus } from "./product.types";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>
  ) {}

  async search(searchProductDto: SearchProductDto) {
    const { query, colors, ...filters } = searchProductDto;

    // const makeQueryLike = (
    //   key: keyof ProductEntity,
    //   query: string,
    //   where: FindOptionsWhere<ProductEntity> = {}
    // ) =>
    //   query
    //     .trim()
    //     .split(" ")
    //     .map(q => ({
    //       [key]: ILike(`%${q}%`),
    //       ...where
    //     }));

    // const mapFilters = <E = ProductEntity, V = E[keyof E]>(
    //   key: keyof E,
    //   value: V | V[]
    // ) => {
    //   if (Array.isArray(value)) {
    //     return {
    //       [key]: In(value)
    //     };
    //   }

    //   return {
    //     [key]: value
    //   };
    // };

    // const filtersForQuery = Object.entries(filters).map(([key, value]) =>
    //   mapFilters<ProductEntity>(key as keyof ProductEntity, value)
    // );

    // const whereForTitle = makeQueryLike("title", query);
    // const whereForDescription = makeQueryLike("description", query);

    // return this.repo.find({
    //   where: [
    //     ...whereForTitle,
    //     ...whereForDescription,
    //     ...filtersForQuery,
    //     {
    //       ...(colors && { colors: In(colors) })
    //     }
    //   ]
    // });

    const keyString = "?KEY_STRING";
    const iLikePattern = query
      .trim()
      .split(" ")
      .join(`%' OR ${keyString} ILIKE '%`);

    const preferedColors = Array.isArray(colors) ? colors : [colors];

    const filtersEntries = Object.entries(filters);

    /* ${
            colors
              ? `
                  AND (array_to_string(colors) ILIKE '%${colors.join("','")}%');
                `
              : ""
          } */
    return this.repo.query(
      `
        SELECT id, title, description, image, price, category, size, colors, material, season, gender, "countryMade" FROM products
        WHERE
          status = '${ProductStatus.Accepted}'
          AND (
            title ILIKE '%${iLikePattern.replaceAll(keyString, "title")}%'
            OR description ILIKE '%${iLikePattern.replaceAll(keyString, "description")}%'
          )
            ${
              filtersEntries.length > 0
                ? `
                    AND (
                      ${filtersEntries
                        .map(([key, value]) => {
                          if (Array.isArray(value)) {
                            return `"${key}" IN ('${value.join("','")}')`;
                          }

                          return `"${key}" = '${value}'`;
                        })
                        .join(" AND ")}  
                    )
                  `
                : ""
            }
      `
    );
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
