import { Controller, Get, Logger } from '@nestjs/common';

@Controller('/')
export class HealthCheckController {
  constructor(private readonly logger: Logger) {}
  @Get()
  async healthCheck(): Promise<any> {
    this.logger.log('Health check endpoint called');
    return {
      ...process.env,
    };
  }
}
