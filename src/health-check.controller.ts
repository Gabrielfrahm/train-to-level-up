import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HealthCheckController {
  @Get()
  async healthCheck(): Promise<string> {
    return 'check';
  }
}
