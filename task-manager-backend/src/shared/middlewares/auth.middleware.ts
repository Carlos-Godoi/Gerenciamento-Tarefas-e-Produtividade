import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

// Declaração para estender o objeto Request do Express (Técnica TypeScript Avançado)
declare global {
    namespace Express {
        interface Request {
            userId?: string; // Adicionamos 'userId' opcional ao Request
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 1. Verifica e Decodifica o Token
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        // 2. Anexa o userId na requisição para uso em Controllers e Services (ESSENCIAL)
        req.userId = decoded.userId;

        next(); // Permite que a requisição siga para o Controller
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};