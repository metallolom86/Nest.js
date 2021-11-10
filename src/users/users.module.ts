import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CustomUserModule } from '../schemas/user.model';
import { JwtModule } from '@nestjs/jwt';
import { JWTConfig } from '../config/jwt.config';
import { CustomProductModule } from 'src/schemas/product.model';

@Module({
  imports: [CustomUserModule, CustomProductModule, JwtModule.registerAsync(JWTConfig)],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      .forRoutes({ path: 'users', method: RequestMethod.GET });
  }
}
