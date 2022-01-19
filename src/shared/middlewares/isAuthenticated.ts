import AppError from '@shared/errors/AppError';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';

export default function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new AppError('JWT Token does not exists');
  } else {
    // Bearer token
    const tokenJWT = authHeader.split(' ');
    const token = tokenJWT[1];
    if (!authConfig.jwt.secret) {
      throw new Error('JWT not configured.');
    }
    verify(token, authConfig.jwt.secret, (err, decoded) => {
      if (err) {
        throw new AppError(err.name + '-' + err.message, 400, err.stack);
      }
      console.log(decoded);
      const sub = decoded?.sub;
      console.log(sub);
      request.user = {
        id: sub,
      };
    });

    return next();
  }
}
