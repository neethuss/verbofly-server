import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const accessSecret = process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string;
const refreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET_KEY as string;

class JwtUtils {
  static generateAccessToken(payload: object): string {
    return jwt.sign(payload, accessSecret, { expiresIn: '1h' });
  }

  static generateRefreshToken(payload: object): string {
    return jwt.sign(payload, refreshSecret, { expiresIn: '7d' });
  }

  static verifyToken(token: string, isRefreshToken = false): string | JwtPayload {
    const secret = isRefreshToken ? refreshSecret : accessSecret;
    return jwt.verify(token, secret);
  }
}

export default JwtUtils;