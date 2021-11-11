import { IsDefined, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  brand: string;
}
