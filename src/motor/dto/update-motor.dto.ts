import { PartialType } from '@nestjs/swagger';
import { CreateMotorDto } from './create-motor.dto';

export class UpdateMotorDto extends PartialType(CreateMotorDto) {}
