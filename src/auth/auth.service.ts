import { Injectable, HttpStatus} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(login: string, password: string): Promise<any> {
    const user = await this.usersService.getUser(login);
    const message = 'Incorrect login or password';

    if (user) {
      const isPasswordValid = await this.usersService.comparePassword(password, user.password)
      if(isPasswordValid){

        return this.login(user);
      }
      return { status: HttpStatus.UNAUTHORIZED, message };
    }
    return { status: HttpStatus.UNAUTHORIZED, message };
  }

  async login(user: any) {
    const payload = { login: user.login, _id: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async addOneUser(login: string, pass: string): Promise<any> {
    const user = await this.usersService.getUser(login);
    if(user) {
      const message = 'Login already exist';

      return { status: HttpStatus.UNAUTHORIZED, message };
    }
    const newUser = await this.usersService.insertUser(login, pass);

    return this.login(newUser);
  }
}