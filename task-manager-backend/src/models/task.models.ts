import mongoose, { Schema, Document, Types } from 'mongoose';
import { title } from 'process';
import { required } from 'zod/mini';

// Tipos permitidos para Status e Prioridade
export type TaskStatus = 'pendente' | 'em progresso' | 'concluído';
export type TaskPriority = 'baixa' | 'média' | 'alta';

// 1. Interface TypeScript para tipagem forte
export interface ITask extends Document {
    userId: Types.ObjectId; // Referência ao ID do usuário (do MongoDB)
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// 2. Schema do Mongoose
const TaskSchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Referência ao Model 'User'
        required: true
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
        type: String,
        enum: ['pendente', 'em progresso', 'concluído'],
        default: 'pendente'
    },
    priority: {
        type: String,
        enum: ['baixa', 'média', 'alta'],
        default: 'média'
    },
    dueDate: { type: Date, default: null },
}, {
    timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

export default mongoose.model<ITask>('Task', TaskSchema);