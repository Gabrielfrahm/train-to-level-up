export class NotFoundException extends Error {
  constructor(message: string) {
    const bodyError = {
      body: {
        message: message,
        shortMessage: message.toLowerCase().replace(/\s+/g, '_'),
      },
    };
    super(JSON.stringify(bodyError));
    this.name = 'NotFoundException';
  }
}
