import { NestFactory } from '@nestjs/core';
import { BullWorkerModule } from './bull.module';
import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(BullWorkerModule);
  const configService = app.get(ConfigService);
  mongoose.set('debug', configService.get('NODE_ENV') === 'development');
  // start app without listen
  app.init();
}
bootstrap();
