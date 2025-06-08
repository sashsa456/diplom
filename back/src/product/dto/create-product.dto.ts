import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsString, Length, Min } from "class-validator";
import {
  Category,
  Color,
  CountryMade,
  Gender,
  Material,
  Season,
  Size
} from "../product.types";

export class CreateProductDto {
  @IsString()
  @Length(3, 64)
  @ApiProperty()
  title: string;

  // @IsString()
  // @ApiProperty()
  // image: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsNumber()
  @Min(1)
  @ApiProperty()
  price: number;

  @IsEnum(Category)
  @ApiProperty()
  category: Category;

  @IsEnum(Size)
  @ApiProperty()
  size: Size;

  @IsEnum(Color, {
    each: true
  })
  @ApiProperty()
  colors: Color[];

  @IsEnum(Material)
  @ApiProperty()
  material: string;

  @IsEnum(Season)
  @ApiProperty()
  season: Season;

  @IsEnum(Gender)
  @ApiProperty()
  gender: Gender;

  @IsEnum(CountryMade)
  @ApiProperty()
  countryMade: CountryMade;
}
