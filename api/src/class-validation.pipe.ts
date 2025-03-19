import { InvalidDtoError, Output } from '@shared/exceptions/dto.exception';
import { Injectable, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors: ValidationError[]) =>
        this.createException(errors),
    });
  }

  createException(errors: ValidationError[]): InvalidDtoError {
    // Transforma os ValidationError em Output
    const formattedErrors: Output = errors.map((err) => ({
      property: err.property,
      constraints: err.constraints,
    }));

    // Retorna uma nova instância de InvalidDtoError com os erros formatados
    return new InvalidDtoError(formattedErrors);
  }
}
