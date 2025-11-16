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

// Tipos permitidos
export type TaskStatus = 'pendente' | 'em progresso' | 'concluído';
export type TaskPriority = 'baixa' | 'média' | 'alta';

// Tipagem da Tarefa (como vem do backend)
export interface Task {
    _id: string;
    userId: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string | null;
    createdAt: string;
    updatedAt: string;
}

// Tipagem para formulário de criação (sem o _id, userId, etc.)
export type CreateTaskForm = Omit<Task, '_id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type UpdateTaskForm = Partial<CreateTaskForm>;