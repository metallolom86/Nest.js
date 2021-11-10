import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TCarDocument, Car, IViewCar } from 'src/schemas/car.model';
import { TUserDocument } from 'src/schemas/user.model';
import { CreateCarDto } from './dto/create-cat.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarService {
  constructor(
    @InjectModel(Car.name)
    private readonly carModel: Model<TCarDocument>,
  ) {}

  async getCars() {
    const cars = await this.carModel.find().populate('owner');
    return cars.map(e => e.view());
  }

  private async getCarById(id: string): Promise<TCarDocument> {
    const car = await this.carModel.findById(id).populate('owner');
    if (!car) throw new NotFoundException();
    return car;
  }

  async createCar(
    user: TUserDocument,
    createCarDto: CreateCarDto,
  ): Promise<{ car: IViewCar }> {
    const newCar = await new this.carModel({
      ...createCarDto,
      owner: user,
    }).save();

    user.cars = [...user.cars, newCar.id];
    user.save();

    return { car: newCar.view() };
  }

  async updateCar(
    id: string,
    updateCarDto: UpdateCarDto,
  ): Promise<{ car: IViewCar }> {
    const car = await this.getCarById(id);
    const updatedCar = await Object.assign(car, updateCarDto).save();
    return { car: updatedCar.view() };
  }

  async deleteCar(
    id: string,
    user: TUserDocument,
  ): Promise<{ message: string }> {
    const car = await this.getCarById(id);
    await car.remove();

    user.cars = user.cars.filter(car => car !== id);
    user.save();
    return { message: 'Car removed' };
  }

  async getCar(id: string): Promise<{ car: IViewCar }> {
    const car = await this.getCarById(id);
    return { car: car.view() };
  }
}
