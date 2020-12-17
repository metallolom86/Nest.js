import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async getUser(login: string) {
    const user = await this.userModel.findOne({login}).lean().exec();
    return user
  }

  async insertUser(login: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      login,
      password: hashedPassword,
    });
    const result = await newUser.save();
    return result as User;
  }

  async comparePassword(attempt: string, password: string): Promise<boolean> {
    return await bcrypt.compare(attempt, password);
  }
}