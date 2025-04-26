import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { Logger } from '@nestjs/common';
import { CustomValidationPipe } from './class-validation.pipe';

import { EitherExceptionFilter } from './error.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  // middleware para logar as rotas chamadas
  app.use((req, res, next) => {
    res.on('finish', () => {
      Logger.log(`${req.method} ${req.originalUrl}`, 'RouteCalled');
    });
    next();
  });

  app.useLogger(new Logger());

  app.useGlobalPipes(new CustomValidationPipe());

  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(
    new EitherExceptionFilter(httpAdapterHost, new Logger()),
  );

  await app.listen(process.env.PORT);
}
bootstrap();
