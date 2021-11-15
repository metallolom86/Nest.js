import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TCarDocument, Car, IViewCar } from 'src/schemas/car.model';
import { Motor, TMotorDocument } from 'src/schemas/motor.model';
import { TUserDocument } from 'src/schemas/user.model';
import { CreateCarDto } from './dto/create-cat.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarService {
  constructor(
    @InjectModel(Car.name)
    private readonly carModel: Model<TCarDocument>,
    @InjectModel(Motor.name)
    private readonly motorModel: Model<TMotorDocument>,
  ) {}

  async getCars() {
    const cars = await this.carModel
      .find()
      .populate('owner', '-password')
      .populate('motors');
    return cars.map(e => e.view());
  }

  private async getCarById(id: string): Promise<TCarDocument> {
    const car = await this.carModel.findById(id).populate('owner');
    if (!car) throw new NotFoundException();
    return car;
  }

  private async updateMotors(motors: string[], carId: string) {
    const cars = await this.carModel.find({ motors: motors });
    await this.motorModel.updateMany(
      { _id: { $in: motors } },
      { $set: { cars: cars.map(el => el._id) } },
      { new: true, useFindAndModify: false },
    );

    await this.carModel.updateMany(
      { _id: { $nin: motors } },
      { $pull: { cars: carId } },
      { new: true, useFindAndModify: false },
    );
  }

  async createCar(
    user: TUserDocument,
    createCarDto: CreateCarDto,
  ): Promise<{ car: IViewCar }> {
    const newCar = await new this.carModel({
      ...createCarDto,
      owner: user,
    }).save();


    if(newCar.motors?.length) {
      await this.motorModel.updateMany(
        { _id: { $in: newCar.motors } },
        { $push: { cars: newCar.id } },
        { new: true, useFindAndModify: false },
      );
    }

    user.cars = [...user.cars, newCar.id];
    await user.save();

    return { car: newCar.view() };
  }

  async updateCar(
    id: string,
    updateCarDto: UpdateCarDto,
  ): Promise<{ car: IViewCar }> {
    const car = await this.getCarById(id);
    const updatedCar = await Object.assign(car, updateCarDto).save();
    await this.updateMotors(updatedCar.motors, car.id);
    return { car: updatedCar.view() };
  }

  async deleteCar(
    id: string,
    user: TUserDocument,
  ): Promise<{ message: string }> {
    const car = await this.getCarById(id);
    await car.remove();

    await this.motorModel.updateMany(
      {},
      { $pull: { cars: id } },
      { new: true, useFindAndModify: false },
    );

    user.cars = user.cars.filter(car => car !== id);
    user.save();
    return { message: 'Car removed' };
  }

  async getCar(id: string): Promise<{ car: IViewCar }> {
    const car = await this.getCarById(id);
    return { car: car.view() };
  }
}
