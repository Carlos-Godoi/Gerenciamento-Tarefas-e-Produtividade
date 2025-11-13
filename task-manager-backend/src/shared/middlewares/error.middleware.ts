import { Request, Response, NextFunction } from 'express';
import AppError from '../errors/AppError';
import { ZodError } from 'zod'; // Para capturar erros de validação Zod
import mongoose from 'mongoose';

export const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // 1. Erros customizados (AppError, UnauthorizedError, NotFoundError, etc.)
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    // 2. Erros de validação Zod (400 Bad Request)
    if (err instanceof ZodError) {
        // Retorna uma lista de problemas de validação
        return res.status(400).json({
            status: 'error',
            message: 'Erro de validação de dados.',
            errors: err.issues.map(issue => ({
                path: issue.path.join('.'),
                message: issue.message,
            })),
        });
    }

    // 3. Erros do Mongoose (Ex.: ID mal formatado, 400 Bad Request)
    if (err instanceof mongoose.Error.CastError && err.path === '_id') {
        return res.status(400).json({
            status: 'error',
            message: 'ID mal formatado (Cast Error).'
        });
    }

    // 4. Erros Desconhecidos/Internos (500 Internal Server Error)
    console.error('[ERRO INTERNO DO SERVIDOR]', err); // Loga o erro completo no console para debug

    return res.status(500).json({
        status: 'error',
        message: 'Erro interno do servidor.',
    });
};