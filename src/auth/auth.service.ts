import { Injectable, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { NotificationService } from '../notification/notification.service';
import {
  ENotificationChannels,
  INotificationParams,
} from '../notification/notification.types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, TUserDocument } from '../schemas/user.model';

import { ENotificationTemplates } from '../utils/notification-templates.enum';
import { ConfirmationRegistrationDto } from '../bull/dto/confirmation-registration.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private notificationService: NotificationService,
    @InjectModel(User.name) private userModel: Model<TUserDocument>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    const message = 'Incorrect email or password';
    if (user) {
      const isValidPassword = await user.validatePassword(password);
      if (isValidPassword) {
        return this.getToken(user);
      }
      return { status: HttpStatus.UNAUTHORIZED, message };
    }
    return { status: HttpStatus.UNAUTHORIZED, message };
  }

  async getToken(user: any) {
    const secret = '1234567test';
    const payload = { id: user.id };
    return {
      access_token: this.jwtService.sign(payload, { secret }),
    };
  }

  async addOneUser(email: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (user) {
      const message = 'email already exist';

      return { status: HttpStatus.UNAUTHORIZED, message };
    }
    const newUser = await this.usersService.insertUser(email, pass);

    const token = await this.getToken(newUser);
    const notificationParams: INotificationParams = {
      channels: [ENotificationChannels.EMAIL],
      template: ENotificationTemplates.CONFIRMATION_REGISTRATION,
    };
    const notificationPayload: ConfirmationRegistrationDto = {
      email: email,
      token: token.access_token,
    };
    this.notificationService.sendNotification(
      notificationParams,
      notificationPayload,
    );
    return token;
  }

  async getUser(email: string) {
    return await this.usersService.getUser(email);
  }
}
