import { Request, Response, NextFunction } from 'express';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // TODO: Student implementation - Part 1: Authentication Middleware
  // Store the authenticated userId on res.locals.userId
  const userId = req.header('X-User-Id');

  if (userId === undefined || !Number.isFinite(Number(userId))) {
    res.status(401).send('Unauthorized');
    return;
  }

  res.locals.userId = Number(userId);
  next();
}

export default authMiddleware;
