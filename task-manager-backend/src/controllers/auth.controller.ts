import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { authSchema, AuthBody } from '../shared/schemas/auth.schema';

class AuthController {
    async register(req: Request, res: Response): Promise<void> {
        try {
            // 1. Validação com ZOD
            const { email, password } = authSchema.parse(req.body);

            // 2. Chamada ao Serviço (Lógica de Negócio)
            const user = await authService.register(email, password);

            res.status(201).json({
                message: 'Usuário registrado com sucesso.',
                userId: user._id
            });
        } catch (error) {
            // Trata erros de validação (Zod) e de negócio (Service)
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Erro interno do servidor,' });
            }
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            // 1. Validação com ZOD
            const { email, password } = authSchema.parse(req.body);

            // 2. Chamada ao Service (Lógica de Negócio)
            const { token, userId } = await authService.login(email, password);

            // 3. Resposta de Sucesso
            res.status(200).json({ token, userId });

        } catch (error) {
            // Trata erros de credenciais inválidas (Service)
            if (error instanceof Error && error.message.includes('inválidas')) {
                res.status(401).json({ message: error.message }); // Não autorizado (Unauthorized)
            } else if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Erro interno do servidor.' });
            }
        }
    }
}

export default new AuthController();