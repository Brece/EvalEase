import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { IUser } from '../models/user.model';

export interface ICustomJwtRequest extends Request {
  user?: IUser | any;
}

/**
 * Authenticate a JWT for protected routes
 */
export const authenticateJWT = (
  req: ICustomJwtRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies?.app_token; // Get the token from cookies

  if (!token) {
    throw new Error('Unauthorized. No token provided');
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'mysecret');
    const user = (payload as jwt.JwtPayload).user;

    req.user = user; // Attach decoded payload to request
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'Unknown error in JWT guard' });
    }
  }
};
