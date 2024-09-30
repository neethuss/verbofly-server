import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface CustomRequest extends Request {
  user?: string;
  token?: string;
}

interface DecodedToken {
  email: string;
}

const authenticationMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    console.log('Middleware started');
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log(token,'token backend')
    if (!token) {
      throw new Error('Authentication failed. Token missing.');
    }

    console.log('Token:', token);
    const accessSecret = process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string;
    if (!accessSecret) {
      throw new Error('JWT secret key is not set in environment variables.');
    }
    const decoded = jwt.verify(token, accessSecret) as DecodedToken;

    console.log('Decoded email:', decoded.email);
    req.user = decoded.email;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).send({ error: 'Token expired. Please refresh your token.' });
    } else if (error instanceof Error) {
      console.error('Error in authenticationMiddleware:', error.message);
      res.status(401).send({ error: 'Authentication failed.' });
    } else {
      console.error('Unknown error:', error);
      res.status(500).send({ error: 'An unexpected error occurred.' });
    }
  }
};

export default authenticationMiddleware;
