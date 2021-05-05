import { Controller, Get, Request, Post, UseGuards, Body, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { ApiTags,  ApiOperation, ApiResponse } from '@nestjs/swagger'
import { emailDto, JWT_Token, ProfileDto } from './auth.dto'
import {
  GetUser,
  TReturnedUserType,
} from '../utils/decorators/get-user.decorator';
import { UserDocument, IViewUser } from '../users/user.model';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ description: "email to system" })
  @ApiResponse({
    description: "Log in success ",
    type: JWT_Token,
    status: HttpStatus.OK,
  })
  @ApiResponse({
    description: "Incorrect email or password",
    status: HttpStatus.UNAUTHORIZED,
  })
  async email(
    @Body() category: emailDto,
    @Body('email') email: string,
    @Body('password') password: string
  ) { 
    return this.authService.validateUser(email, password);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // @ApiOperation({ description: "Validation JWT_TOKEN" })
  // @ApiResponse({
  //   description: "Log in success ",
  //   type: ProfileDto,
  //   status: HttpStatus.OK,
  // })
  // @ApiResponse({
  //   description: "Wrong credentials",
  //   status: HttpStatus.UNAUTHORIZED,
  // })
  // getProfile(@Body() category: emailDto, @Request() req) {
  //   return req.user;
  // }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ description: "Validation JWT_TOKEN" })
  @ApiResponse({
    description: "Log in success ",
    type: ProfileDto,
    status: HttpStatus.OK,
  })
  @ApiResponse({
    description: "Wrong credentials",
    status: HttpStatus.UNAUTHORIZED,
  })
  // me(@GetUser() user: TReturnedUserType): IViewUser {
  //   return user.view();
  // }
    getProfile(@Request() req) {
    return req.user;
  }
  
  @Post('register')
  @ApiOperation({ description: "Sign up" })
  @ApiResponse({
    description: "Sign up success",
    type: JWT_Token,
    status: HttpStatus.OK,
  })
  @ApiResponse({
    description: "email already exist",
    status: HttpStatus.UNAUTHORIZED,
  })
  async register(   
    @Body() category: emailDto,
    @Body('email') email: string,
    @Body('password') password: string
  ){
    return await this.authService.addOneUser(email, password)
  }
}
