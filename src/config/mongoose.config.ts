import { ConfigModule, ConfigService } from '@nestjs/config';

const mongooseFactory = (config: ConfigService) => {
  const uri = config.get<string>('DATABASE');
  return {
    uri,
    useNewUrlParser: true,
    useCreateIndex: true,
  };
};

export const mongooseConfig = {
  inject: [ConfigService],
  imports: [ConfigModule],
  useFactory: mongooseFactory,
};
