import { ConfigService } from '@nestjs/config';

export const bullFactory = (config: ConfigService) => ({
  redis: {
    host: config.get('REDIS_HOST'),
    port: +config.get('REDIS_PORT'),
  },
});
