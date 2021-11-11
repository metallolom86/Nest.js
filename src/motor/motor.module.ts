import { Module } from '@nestjs/common';
import { MotorService } from './motor.service';
import { MotorController } from './motor.controller';
import { CustomMotorModule } from 'src/schemas/motor.model';
import { CustomCarModule } from 'src/schemas/car.model';

@Module({
  providers: [MotorService],
  controllers: [MotorController],
  imports: [CustomMotorModule, CustomCarModule]
})
export class MotorModule {}
