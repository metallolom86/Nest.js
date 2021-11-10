import { PartialType } from '@nestjs/swagger';
import { CreateCarDto } from './create-cat.dto';

export class UpdateCarDto extends PartialType(CreateCarDto) {}
