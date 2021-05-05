import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { MAIL_QUEUE_NAME } from '../queue';
// import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as path from 'path';
import * as ejs from 'ejs';
import * as fs from 'fs';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ENotificationTemplates } from '../../utils/notification-templates.enum';
import { ConfirmationRegistrationDto } from '../dto/confirmation-registration.dto';

@Processor(MAIL_QUEUE_NAME)
export class MailProcessor {
  constructor(
    private readonly mailerService: MailerService,
    // @Inject(),
    private configService: ConfigService,
  ) {}

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(
        job.data,
      )}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    console.log(
      `Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(
        result,
      )}`,
    );
  }

  @OnQueueFailed()
  onError(job: Job, error: any) {
    console.log(
      `Failed job ${job.id} of type '${job.name}': ${error.message}`,
      error.stack,
    );
  }

  @Process(ENotificationTemplates.CONFIRMATION_REGISTRATION)
  async sendWelcomeHunterEmail(job: Job<ConfirmationRegistrationDto>): Promise<any> {
    // const web = this.configService.get('NEXTJS_FRONTEND');
    // const confirmationLink = `${web}/thanks?token=${job.data.token}`;
    const confirmationLink = 'test';
    const html = this.getTemplate(
      {
        file: `${ENotificationTemplates.CONFIRMATION_REGISTRATION}.html`,
      },
      {
        confirmationLink,
      },
    );
    try {
      const result = await this.mailerService.sendMail({
        to: job.data.email,
        subject: `Welcome to Nest project!`,
        html,
      });
      return result;
    } catch (error) {
      console.log(
        `Failed to send confirmation email to '${job.data.email}'`,
        error.stack,
      );
      throw error;
    }
  }

  // private getLangDir(lang?: ELanguage): ELanguage {
  //   const defaultLang = ELanguage.en;
  //   if (!lang) return defaultLang;
  //   // availableLanguages or another array of languages
  //   if (availableLanguages.includes(lang)) return lang;
  //   return defaultLang;
  // }

  private getTemplate(
    { file }: { file: string; },
    tmpOptions: any,
  ): string {
    const tmpDir = '/email-templates';
    // const langDir = this.getLangDir(lang);
    const template = path.join(process.cwd(), tmpDir, file);
    const tmp = fs.readFileSync(template, 'utf8');

    return ejs.render(tmp, tmpOptions);
  }
}