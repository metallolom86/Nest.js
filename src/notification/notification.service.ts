import { Inject, Injectable } from '@nestjs/common';
import {
  ENotificationChannels,
  INotificationParams,
} from './notification.types';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ENotificationTemplates } from '../utils/notification-templates.enum';
import { MAIL_QUEUE_NAME } from '../bull/queue';


@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue(MAIL_QUEUE_NAME) private mailQueue: Queue,
  ) {}

  async sendNotification<T>(
    { channels, template }: INotificationParams,
    payload: T,
  ) {
    if (channels.includes(ENotificationChannels.EMAIL)) {
      await this.sendEmail(template, payload);
    }
    // add other channels
  }

  private async sendEmail(template: ENotificationTemplates, payload: any) {
    try {
      await this.mailQueue.add(template, payload);
      return true;
    } catch (error) {
      console.log(
        `Error queueing '${template}' email to user ${payload.email}`,
      );
      return false;
    }
  }
}
