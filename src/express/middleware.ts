import type { NextFunction, Request, Response } from 'express';
import logger from '../logger';

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session.user) return next();
  res.redirect('/login');
}

export function notFound(req: Request, res: Response, next: NextFunction): void {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export function errorHandler(error: any, req: Request, res: Response, next: NextFunction): void {
  // TODO: Report error
  logger.error(JSON.stringify({
    status: error.status,
    message: error.message,
    stack: error.stack,
    errors: error.errors,
  }));

  res.render('error.html', { error: error });
}