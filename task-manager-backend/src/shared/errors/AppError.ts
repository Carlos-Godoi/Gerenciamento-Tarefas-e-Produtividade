import { object } from "zod";

/**
 * Classe base para todos os erros da aplicação.
 * Permite definir um status HTTP específico para o erro.
 */
class AppError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError'; // Nome customizado para identificação

        // Garante que a herança do objeto Error funcione corretamente
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

// Erros Específicos (para clareza)
export class UnauthorizedError extends AppError {
    constructor(message = 'Não autorizado. Credenciais inválidas.') {
        super(message, 401);
        this.name = 'UnauthorizedError';
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Recurso não encontrado.') {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

export default AppError;