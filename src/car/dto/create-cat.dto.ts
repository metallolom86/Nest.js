import { IsDefined, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarDto {
  @ApiProperty()
  @IsDefined()
  @IsArray()
  name: string;
}
