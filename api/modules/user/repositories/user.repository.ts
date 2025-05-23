import { Inject, Injectable, InjectionToken } from '@nestjs/common';
import { UserRepositoryInterface } from '../interfaces/user.repository.interface';
import { Either, left, right } from '@shared/either';
import { UserEntity } from '../entities/user.entity';
import {
  PRISMA_SERVICE,
  PrismaService,
} from '@modules/database/prisma/prisma.service';

import { BadRequestException } from '@shared/exceptions/bad-request.exception';
import { NotFoundException } from '@shared/exceptions/not-found.exception';

export const USER_REPOSITORY_USER_REPOSITORY: InjectionToken<UserRepositoryInterface> =
  Symbol('UserRepository');

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @Inject(PRISMA_SERVICE)
    private readonly prismaService: PrismaService,
  ) {}

  async create(user: UserEntity): Promise<Either<Error, UserEntity>> {
    try {
      const checkEmail = await this.prismaService.user.findUnique({
        where: {
          email: user.getEmail(),
        },
      });

      if (checkEmail) {
        return left(
          new BadRequestException(
            `User Already existing with e-mail: ${user.getEmail()}`,
          ),
        );
      }

      const createUser = await this.prismaService.user.create({
        data: {
          id: user.getId(),
          email: user.getEmail(),
          name: user.getName(),
          createdAt: user.getCreatedAt(),
          updatedAt: user.getUpdatedAt(),
          deletedAt: user.getDeletedAt(),
        },
      });

      return right(
        UserEntity.CreateFrom({
          ...createUser,
        }),
      );
    } catch (e) {
      return left(e);
    }
  }

  async findByEmail(email: string): Promise<Either<Error, UserEntity>> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        return left(new NotFoundException(`User Not Found E-mail: ${email}`));
      }

      return right(
        UserEntity.CreateFrom({
          ...user,
        }),
      );
    } catch (e) {
      return left(e);
    }
  }

  async findById(id: string): Promise<Either<Error, UserEntity>> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!user) {
        return left(new NotFoundException(`User Not Found for this id: ${id}`));
      }

      return right(
        UserEntity.CreateFrom({
          ...user,
        }),
      );
    } catch (e) {
      return left(e);
    }
  }

  async delete(id: string): Promise<Either<Error, void>> {
    try {
      const checkUser = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });

      if (!checkUser) {
        return left(new NotFoundException(`User Not Found id: ${id}`));
      }

      return null;
    } catch (e) {
      return left(e);
    }
  }
}
