import { Request, Response, NextFunction } from 'express';
import NotFoundError from '../errors/notFoundError';

const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Page not found'));
};

export default notFoundHandler;