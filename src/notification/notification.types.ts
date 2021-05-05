import { ENotificationTemplates } from '../utils/notification-templates.enum';

export enum ENotificationChannels {
  EMAIL = 'EMAIL',
}

export interface INotificationParams {
  channels: ENotificationChannels[];
  template?: ENotificationTemplates;
}
