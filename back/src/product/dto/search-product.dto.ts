import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";
import {
  Category,
  Color,
  CountryMade,
  Gender,
  Material,
  ProductStatus,
  Season,
  Size
} from "../product.types";

export class SearchProductDto {
  @IsString()
  @ApiProperty()
  query: string;

  @IsEnum(ProductStatus, {
    each: true
  })
  @ApiProperty({
    required: false
  })
  @IsOptional()
  status?: ProductStatus;

  @IsNumber()
  @Min(1)
  @ApiProperty({
    required: false
  })
  @IsOptional()
  price: number;

  @IsEnum(Category)
  @ApiProperty({
    required: false
  })
  @IsOptional()
  category: Category;

  @IsEnum(Size)
  @ApiProperty({
    required: false
  })
  @IsOptional()
  size: Size;

  @IsEnum(Color, {
    each: true
  })
  @ApiProperty({
    required: false
  })
  @IsOptional()
  colors: Color[];

  @IsEnum(Material, {
    each: true
  })
  @ApiProperty({
    required: false
  })
  @IsOptional()
  material: Material[];

  @IsEnum(Season, {
    each: true
  })
  @ApiProperty({
    required: false
  })
  @IsOptional()
  season: Season[];

  @IsEnum(Gender)
  @ApiProperty({
    required: false
  })
  @IsOptional()
  gender: Gender;

  @IsEnum(CountryMade, {
    each: true
  })
  @ApiProperty({
    required: false
  })
  @IsOptional()
  countryMade: CountryMade[];
}
