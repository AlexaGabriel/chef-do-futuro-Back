import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

const SALT_ROUNDS = 10;
const JWT_SECRET: string = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN!;

export class AuthService {
  /**
   * Gera hash da senha usando bcrypt
   */
  static async hashPassword(senha: string): Promise<string> {
    return bcrypt.hash(senha, SALT_ROUNDS);
  }

  /**
   * Compara senha em texto plano com hash
   */
  static async comparePassword(senha: string, hash: string): Promise<boolean> {
    return bcrypt.compare(senha, hash);
  }

  /**
   * Gera token JWT
   */
  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as any,
    });
  }

  /**
   * Verifica e decodifica token JWT
   */
  static verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Extrai token do header Authorization
   */
  static extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader) return null;

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }
}
