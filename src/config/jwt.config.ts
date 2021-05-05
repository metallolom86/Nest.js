import { ConfigService } from '@nestjs/config';

const jtwFactory = (config: ConfigService) => ({
  secret: config.get<string>('JWT_SECRET'),
  signOptions: { expiresIn: '7d' },
});

export const JWTConfig = {
  inject: [ConfigService],
  useFactory: jtwFactory,
};
