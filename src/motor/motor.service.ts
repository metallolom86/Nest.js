import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, TCarDocument } from 'src/schemas/car.model';
import { IViewMotor, Motor, TMotorDocument } from 'src/schemas/motor.model';
import { CreateMotorDto } from './dto/create-motor.dto';
import { UpdateMotorDto } from './dto/update-motor.dto';

@Injectable()
export class MotorService {
  constructor(
    @InjectModel(Motor.name)
    private readonly motorModel: Model<TMotorDocument>,
    @InjectModel(Car.name)
    private readonly carModel: Model<TCarDocument>,
  ) {}

  async getMotors(): Promise<IViewMotor[]> {
    const motors = await this.motorModel.find().populate('cars');
    return motors.map(e => e.view());
  }

  private async updateCars(cars: string[], motorId: string) {
    const motors = await this.carModel.find({ cars: cars });
    await this.carModel.updateMany(
      { _id: { $in: cars } },
      { $push: { motors: motors.map(el => el._id) } },
      { new: true, useFindAndModify: false },
    );

    await this.carModel.updateMany(
      { _id: { $nin: cars } },
      { $pull: { motors: motorId } },
      { new: true, useFindAndModify: false },
    );
  }

  private async getMotorById(id: string): Promise<TMotorDocument> {
    const motor = await this.motorModel.findById(id).populate('cars');
    if (!motor) throw new NotFoundException();
    return motor;
  }

  async createMotor(
    createMotorDto: CreateMotorDto,
  ): Promise<{ motor: IViewMotor }> {
    const newMotor = await new this.motorModel({
      ...createMotorDto,
    }).save();

    if(newMotor.cars?.length) {
      await this.carModel.updateMany(
        { _id: { $in: createMotorDto.cars } },
        { $push: { motors: newMotor.id } },
        { new: true, useFindAndModify: false },
      );
    }

    return { motor: newMotor.view() };
  }

  async updateMotor(
    id: string,
    updateMotorDto: UpdateMotorDto,
  ): Promise<{ motor: IViewMotor }> {
    const motor = await this.getMotorById(id);
    const updatedMotor = await Object.assign(motor, updateMotorDto).save();
    await this.updateCars(updatedMotor.cars, motor.id);
    return { motor: updatedMotor.view() };
  }

  async deleteMotor(id: string): Promise<{ message: string }> {
    const motor = await this.getMotorById(id);
    await motor.remove();

    await this.carModel.updateMany(
      {},
      { $pull: { motors: id } },
      { new: true, useFindAndModify: false },
    );
    return { message: 'Motor deleted' };
  }

  async getMotor(id: string): Promise<{ motor: IViewMotor }> {
    const motor = await this.getMotorById(id);
    return { motor: motor.view() };
  }
}
