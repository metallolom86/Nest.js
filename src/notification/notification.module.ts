import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { BullModule } from '@nestjs/bull';
import { MAIL_QUEUE_NAME } from '../bull/queue';
// import { PinpointService } from 'src/utils/AWS/pinpoint';

@Module({
  imports: [
    BullModule.registerQueue({ name: MAIL_QUEUE_NAME }),
    // BullModule.registerQueue({ name: PUSH_QUEUE_NAME }),
  ],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
