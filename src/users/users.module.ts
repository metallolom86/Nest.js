import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { CustomUserModule } from './user.model';
import { JwtModule } from '@nestjs/jwt';
import { JWTConfig } from '../config/jwt.config';

@Module({
  imports: [
    CustomUserModule,
    JwtModule.registerAsync(JWTConfig),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}