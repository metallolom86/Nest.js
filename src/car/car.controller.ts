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
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/utils/guards/jwt.guard';
import { GetUser } from 'src/utils/decorators/get-user.decorator';
import { CarService } from './car.service';
import { TUserDocument } from 'src/schemas/user.model';
import { CreateCarDto } from './dto/create-cat.dto';
import { IViewCar } from 'src/schemas/car.model';
import { UpdateCarDto } from './dto/update-car.dto';

@ApiTags('car')
@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get('/')
  async getAllCars() {
    return await this.carService.getCars();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  createCar(
    @Body() createCarDto: CreateCarDto,
    @GetUser() user: TUserDocument,
  ): Promise<{ car: IViewCar }> {
    return this.carService.createCar(user, createCarDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateCar(
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto,
  ): Promise<{ car: IViewCar }> {
    return this.carService.updateCar(id, updateCarDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteCar(
    @Param('id') id: string,
    @GetUser() user: TUserDocument,
  ): Promise<{ message: string }> {
    return this.carService.deleteCar(id, user);
  }

  @Get('/:id')
  async getCar(@Param('id') id: string): Promise<{ car: IViewCar }> {
    return await this.carService.getCar(id);
  }
}
