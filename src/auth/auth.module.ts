import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { CustomUserModule } from '../schemas/user.model';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller'
import { NotificationModule } from '../notification/notification.module';
import { JWTConfig } from '../config/jwt.config';

@Module({
  imports: [
    CustomUserModule,
    UsersModule,
    NotificationModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(JWTConfig),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, PassportModule, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}