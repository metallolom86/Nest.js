import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IViewMotor } from 'src/schemas/motor.model';
import { JwtAuthGuard } from 'src/utils/guards/jwt.guard';
import { CreateMotorDto } from './dto/create-motor.dto';
import { UpdateMotorDto } from './dto/update-motor.dto';
import { MotorService } from './motor.service';

@Controller('motor')
export class MotorController {
  constructor(private readonly motorService: MotorService) {}

  @Get('/')
  async getAllCars(): Promise<IViewMotor[]> {
    return await this.motorService.getMotors();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  createCar(
    @Body() createMotorDto: CreateMotorDto,
  ): Promise<{ motor: IViewMotor }> {
    return this.motorService.createMotor(createMotorDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateCar(
    @Param('id') id: string,
    @Body() updateMotorDto: UpdateMotorDto,
  ): Promise<{ motor: IViewMotor }> {
    return this.motorService.updateMotor(id, updateMotorDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteCar(@Param('id') id: string): Promise<{ message: string }> {
    return this.motorService.deleteMotor(id);
  }

  @Get('/:id')
  async getCar(@Param('id') id: string): Promise<{ motor: IViewMotor }> {
    return await this.motorService.getMotor(id);
  }
}
