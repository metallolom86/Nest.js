import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { bullFactory } from 'src/config/bull.factory';
import { MailModule } from './bull/mail/mail.module';
// import { WinstonModule } from 'nest-winston';
// import { winstonConfig } from './config/winston';
// import { CronModule } from './bull/cron/cron.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfig } from './config/mongoose.config';
// import { PushNotificationModule } from './bull/push-notification/push-notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: bullFactory,
    }),
    // WinstonModule.forRoot(winstonConfig),
    MongooseModule.forRootAsync(mongooseConfig),
    MailModule,
    // CronModule,
    // PushNotificationModule,
  ],
})
export class BullWorkerModule {}