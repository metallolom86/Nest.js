import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export const mailerFactory = (config: ConfigService): MailerOptions => ({
  transport: {
    port: config.get<string>('SMTP_PORT'),
    host: config.get<string>('SMTP_HOST'),
    auth: {
      user: config.get<string>('SMTP_EMAIL'),
      pass: config.get<string>('SMTP_PASS'),
    },
  },
  defaults: {
    from: config.get('SMTP_EMAIL'),
  },
});
