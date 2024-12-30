import { createError } from './errorUtils';

describe('createError', () => {
  it('should create an error with the correct message and status code', () => {
    const message = 'Something went wrong';
    const statusCode = 400;

    const error = createError(message, statusCode);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(message);
    // TypeScript does not recognize added properties, hence type assertion
    expect((error as any).statusCode).toBe(statusCode);
  });

  it('should set the status code correctly', () => {
    const error = createError('Another error', 404);

    expect((error as any).statusCode).toBe(404);
  });
});
