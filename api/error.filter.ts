import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { InvalidDtoError } from './shared/exceptions/dto.exception';

import { BadRequestException } from '@shared/exceptions/bad-request.exception';
import { UnauthorizedException } from '@shared/exceptions/unauthorized.exception';
import { ForbiddenException } from '@shared/exceptions/forbidden.exception';
import { NotFoundException } from '@shared/exceptions/not-found.exception';

@Catch()
export class EitherExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly loggerService: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const { httpAdapter } = this.httpAdapterHost;

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // Handle specific exception types
    if (exception instanceof InvalidDtoError) {
      httpStatus = HttpStatus.BAD_REQUEST;
      message = JSON.parse(exception.message).body;
    } else if (exception instanceof BadRequestException) {
      httpStatus = HttpStatus.BAD_REQUEST;
      message = JSON.parse(exception.message).body;
    } else if (exception instanceof UnauthorizedException) {
      httpStatus = HttpStatus.UNAUTHORIZED;
      message = JSON.parse(exception.message).body;
    } else if (exception instanceof ForbiddenException) {
      httpStatus = HttpStatus.FORBIDDEN;
      message = JSON.parse(exception.message).body;
    } else if (exception instanceof NotFoundException) {
      httpStatus = HttpStatus.NOT_FOUND;
      message = JSON.parse(exception.message).body;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
      message,
    };

    // Log the error
    this.loggerService.error(
      `${exception instanceof Error ? exception.message : exception}`,
      exception instanceof Error ? exception.stack : '',
    );

    // Send the response
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
