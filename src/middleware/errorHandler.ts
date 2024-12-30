import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { constants } from 'http2';

const errorHandler: ErrorRequestHandler = (err, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const message = statusCode === constants.HTTP_STATUS_INTERNAL_SERVER_ERROR ? 'An error occurred on the server' : err.message;

  res.status(statusCode).json({ message });
};

export default errorHandler;