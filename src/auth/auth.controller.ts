import { Controller, Get, Request, Post, UseGuards, Body, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { ApiTags,  ApiOperation, ApiResponse } from '@nestjs/swagger'
import { LoginDto, JWT_Token, ProfileDto } from './auth.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ description: "Login to system" })
  @ApiResponse({
    description: "Log in success ",
    type: JWT_Token,
    status: HttpStatus.OK,
  })
  @ApiResponse({
    description: "Incorrect login or password",
    status: HttpStatus.UNAUTHORIZED,
  })
  async login(
    @Body() category: LoginDto,
    @Body('login') login: string,
    @Body('password') password: string
  ) {
    return this.authService.validateUser(login, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
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
  getProfile(@Body() category: LoginDto, @Request() req) {
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
    description: "Login already exist",
    status: HttpStatus.UNAUTHORIZED,
  })
  async register(   
    @Body() category: LoginDto,
    @Body('login') login: string,
    @Body('password') password: string
  ){
    return await this.authService.addOneUser(login, password)
  }
}
