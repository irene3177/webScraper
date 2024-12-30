function createError(message: string, statusCode: number): Error {
  const error = new Error(message);
  (error as any).statusCode = statusCode;
  return error;
}

export { createError };
