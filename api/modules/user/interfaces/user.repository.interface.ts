import { Either } from '@shared/either';
import { UserEntity } from '../entities/user.entity';

export interface UserRepositoryInterface {
  create(user: UserEntity): Promise<Either<Error, UserEntity>>;
  findByEmail(email: string): Promise<Either<Error, UserEntity>>;
  findById(id: string): Promise<Either<Error, UserEntity>>;
  delete(id: string): Promise<Either<Error, void>>;
}
