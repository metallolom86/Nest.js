import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './middleware/middleware';
import { ConfigModule } from '@nestjs/config';
import { mongooseConfig } from './config/mongoose.config';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ProductsModule,
    MongooseModule.forRootAsync(mongooseConfig),
     AuthModule, 
     UsersModule,
     ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    NotificationModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}