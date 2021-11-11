import { IsDefined, IsString, IsOptional } from 'class-validator';

export class CreateMotorDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsOptional()
  cars: [] | string[];
}
