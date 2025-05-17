import { ConfigException } from '../exceptions/config.exceptions';
import { configSchema } from './config.schema';
import { Config } from './config.type';

export const factory = (): Config => {
  const result = configSchema.safeParse({
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    // baseurl: process.env.BASE_URL,
    // mail: {
    //   from: process.env.MAIL_FROM,
    //   host: process.env.MAIL_HOST,
    //   port: process.env.MAIL_PORT,
    //   user: process.env.MAIL_USER,
    //   password: process.env.MAIL_PASS,
    //   domain: process.env.MAIL_DOMAIN,
    // },
    database: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      url: process.env.DB_URL,
      username: process.env.DB_USERNAME,
    },
    cognito: {
      userPoolId: process.env.COGNITO_USER_POOL_ID,
      clientId: process.env.COGNITO_CLIENT_ID,
    },
  });

  if (result.success) {
    return result.data;
  }

  throw new ConfigException(
    `invalid application configuration: ${result.error.message}`,
  );
};
