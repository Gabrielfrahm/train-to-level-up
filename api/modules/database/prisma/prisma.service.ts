import { Injectable, InjectionToken, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export const PRISMA_SERVICE: InjectionToken<PrismaService> =
  Symbol('PrismaService');

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
