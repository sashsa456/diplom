import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString
} from "class-validator";
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

  @IsNumber()
  @ApiProperty({
    required: false
  })
  @IsOptional()
  rating: number;

  @IsEnum(ProductStatus, {
    each: true
  })
  @ApiProperty({
    required: false
  })
  @IsOptional()
  status?: ProductStatus[];

  @IsNumberString()
  @ApiProperty({
    required: false
  })
  @IsOptional()
  minPrice: number;

  @IsNumberString()
  @ApiProperty({
    required: false
  })
  @IsOptional()
  maxPrice: number;

  @IsEnum(Category, {
    each: true
  })
  @ApiProperty({
    required: false
  })
  @IsOptional()
  category: Category[];

  @IsEnum(Size, {
    each: true
  })
  @ApiProperty({
    required: false
  })
  @IsOptional()
  size: Size[];

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

  @IsEnum(Gender, {
    each: true
  })
  @ApiProperty({
    required: false
  })
  @IsOptional()
  gender: Gender[];

  @IsEnum(CountryMade, {
    each: true
  })
  @ApiProperty({
    required: false
  })
  @IsOptional()
  countryMade: CountryMade[];
}
