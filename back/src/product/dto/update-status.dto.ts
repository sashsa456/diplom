import { IsEnum } from "class-validator";
import { ProductStatus } from "../product.types";

export class UpdateStatusDto {
  @IsEnum(ProductStatus)
  status: ProductStatus;
}
