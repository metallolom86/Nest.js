import { Module } from '@nestjs/common';
import { CustomCarModule } from 'src/schemas/car.model';
import { CarController } from './car.controller';
import { CarService } from './car.service';

@Module({
  controllers: [CarController],
  providers: [CarService],
  imports: [CustomCarModule]
})
export class CarModule {}
