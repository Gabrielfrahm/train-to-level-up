export class RepositoryException extends Error {
  constructor(message: string) {
    const bodyError = {
      body: {
        message: message,
        shortMessage: message.toLowerCase(),
      },
    };
    super(JSON.stringify(bodyError));
  }
}
