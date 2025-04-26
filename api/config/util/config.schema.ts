import { z } from 'zod';

export const environmentSchema = z.enum(['test', 'development', 'production']);

export const DatabaseSchema = z.object({
  host: z.string(),
  database: z.string(),
  password: z.string(),
  port: z.coerce.number(),
  url: z.string().startsWith('postgresql://'),
  username: z.string(),
});

// export const MailSchema = z.object({
//   from: z.string(),
//   host: z.string(),
//   port: z.coerce.number(),
//   user: z.string(),
//   password: z.string(),
//   domain: z.string(),
// });

export const configSchema = z.object({
  env: environmentSchema,
  port: z.coerce.number(),
  // baseurl: z.string(),
  // mail: MailSchema,
  database: DatabaseSchema,
});
