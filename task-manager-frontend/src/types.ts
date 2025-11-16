import { z } from 'zod';

export const AuthSchema = z.object({
    email: z.string().email('Formato de email inválido.'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

export type AuthForm = z.infer<typeof AuthSchema>;

// Tipo de resposta da API de Login
export interface LoginResponse {
    token: string;
    userId: string;
}

// Interface de erro customizado
export interface ApiError {
    message: string;
    status?: number; // Código HTTP
}

// Tipagem para o estado do usuário (simplificado)
export interface UserState {
    token: string | null;
    userId: string | null;
    isLoggedIn: boolean;
}