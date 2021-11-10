import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TUserDocument } from '../schemas/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<TUserDocument>,
  ) {}

  async getUser(email: string) {
    const user = await this.userModel
      .findOne({ email })
      .populate(['product', 'cars'])
      .lean()
      .exec();
    return user;
  }

  async insertUser(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
    });
    const result = await newUser.save();
    return result as TUserDocument;
  }

  async comparePassword(attempt: string, password: string): Promise<boolean> {
    return await bcrypt.compare(attempt, password);
  }

}
