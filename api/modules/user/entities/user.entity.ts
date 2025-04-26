import { BaseEntity, BaseEntityProps } from '@shared/base.entity';
import { randomUUID } from 'crypto';

export interface UserEntityProps extends BaseEntityProps {
  name: string;
  email: string;
  updatedAt: Date;
  deletedAt?: Date;
}

export class UserEntity extends BaseEntity {
  private name: UserEntityProps['name'];
  private email: UserEntityProps['email'];
  private updatedAt: UserEntityProps['updatedAt'];
  private deletedAt: UserEntityProps['deletedAt'];

  protected constructor(data: UserEntityProps) {
    super(data);
    this.name = data.name;
    this.email = data.email;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
  }

  static CreateNew(
    data: Omit<UserEntityProps, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
    id = randomUUID(),
  ): UserEntity {
    return new UserEntity({
      id: id,
      name: data.name,
      email: data.email,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }

  static CreateFrom(data: UserEntityProps): UserEntity {
    return new UserEntity({
      id: data.id,
      name: data.name,
      email: data.email,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  public serialize(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getDeletedAt(): Date {
    return this.deletedAt;
  }

  updateName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }
}
