import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from './auth';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = verifyToken(token);

    if (decoded) {
        (req as any).userId = decoded.userId;
        next();
    } else {
        res.status(401).json({ error: "Unauthorized" });
    }
}