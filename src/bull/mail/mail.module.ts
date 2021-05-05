import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mailerFactory } from 'src/config/mailer.factory';
import { MailProcessor } from './mail.processor';
import { BullModule } from '@nestjs/bull';
import { MAIL_QUEUE_NAME } from '../queue';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: mailerFactory,
    }),
    BullModule.registerQueue({ name: MAIL_QUEUE_NAME }),
  ],
  providers: [MailProcessor],
})
export class MailModule {}