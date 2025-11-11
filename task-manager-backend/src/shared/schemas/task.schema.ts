import { z } from 'zod';
import { TaskStatus, TaskPriority, } from '../../models/task.models';

// Definição dos tipos para validação Zod
const statusEnum: [TaskStatus, ...TaskStatus[]] = ['pendente', 'em progresso', 'concluído'];
const priorityEnum: [TaskPriority, ...TaskPriority[]] = ['baixa', 'média', 'alta'];

// Schema de Criação (todos os campos necessários)
export const createTaskSchema = z.object({
    title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres.'),
    description: z.string().optional(),
    status: z.enum(statusEnum).optional(),
    priority: z.enum(priorityEnum).optional(),
    // O dueDate deve ser uma string de data válida (ex.: YYYY-MM-DD)
    dueDate: z.string().datetime().optional().nullable(),
});

// Schema de Atualização (todos os campos são opcionais)
export const updateTaskSchema = z.object({
    title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres.'),
    description: z.string().optional(),
    status: z.enum(statusEnum).optional(),
    priority: z.enum(priorityEnum).optional(),
    dueDate: z.string().datetime().optional().nullable(),
}). refine(data => Object.keys(data).length > 0, {
    message: "Pelo menos um campo deve ser fornecido para atualização.",
});

// Tipagens para o Controller
export type createTaskSchema = z.infer<typeof createTaskSchema>;
export type updateTaskSchema = z.infer<typeof updateTaskSchema>;