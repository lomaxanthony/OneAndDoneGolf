import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// hash password
export async function hashPassword(password:string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

// compare password
export async function comparePassword(password:string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

// Create JWT Token
export function createToken(userId: number): string {
    return jwt.sign({ userId }, JWT_SECRET, {expiresIn: '7d' });
}

// Verify JWT Token
export function verifyToken(token: string): { userId: number } | null {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: number };
    } catch {
        return null;
    }
}