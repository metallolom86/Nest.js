import { ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from 'class-validator';


export class ProductBodyDto {
  @ApiProperty()
  @IsNotEmpty()
  public title: string;

  @ApiProperty()
  @IsNotEmpty()
  public description: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public price: number;
}

export class ProductDto extends ProductBodyDto {
  @ApiProperty()
  public _id: string;
}