export type Output = {
  property: string;
  constraints: {
    [type: string]: string;
  };
}[];

export class InvalidDtoError extends Error {
  constructor(message?: Output) {
    const bodyError = {
      body: {
        message: message || 'Invalid Field',
        shortMessage: 'invalidField',
      },
    };
    super(JSON.stringify(bodyError));
    this.name = 'InvalidDtoError';
  }
}
