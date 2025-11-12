import { Request, Response } from 'express';
import TaskService from '../services/task.service';
import { createTaskSchema, updateTaskSchema } from '../shared/schemas/task.schema';
import { ITaskFilter } from '../services/task.service';

class TaskController {

    // Criação de Tarefa (POST /api/tasks)
    async create(req: Request, res: Response): Promise<void> {
        try {
            // O userId vem do JWT, injetado pelo authMiddleware
            const userId = req.userId as string;

            const taskData = createTaskSchema.parse(req.body);

            const task = await TaskService.create(userId, taskData);
            res.status(201).json(task);
        } catch (error) {
            res.status(400).json({ message: 'Erro ao criar tarefa.', details: error });
        }
    }

    // Listagem de Tarefas com filtros (GET /api/tasks?status=...)
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userId as string;

            // Filtros extraídos da Query String
            const filters: ITaskFilter = {
                status: req.query.status as ITaskFilter['status'],
                priority: req.query.priority as ITaskFilter['priority'],
                title: req.query.title as string,
            };

            const tasks = await TaskService.getAll(userId, filters);
            res.status(200).json(tasks);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar tarefas.' });
        }
    }

    // Busca por ID (GET /api/tasks/:id)
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userId as string;
            const taskId = req.params.id;

            const task = await TaskService.getById(userId, taskId);
            res.status(200).json(task);
        } catch (error) {
            const status = error instanceof Error && error.message.includes('não encontrada') ? 404 : 401;
            res.status(status).json({ message: error.message });
        }
    }

    // Atualização (PUT /api/tasks/:id)
    async update(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userId as string;
            const taskId = req.params.id;

            // Validação do corpo de atualização
            const taskData = updateTaskSchema.parse(req.body);

            const updateTask = await TaskService.update(userId, taskId, taskData);
            res.status(200).json(updateTask);
        } catch (error) {
            const status = error instanceof Error && error.message.includes('não encontrada') ? 404 : 400;
            res.status(status).json({ message: error.message });
        }
    }

    // Deleção (DELETE /api/tasks/:id)
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userId as string;
            const taskId = req.params.id;

            await TaskService.delete(userId, taskId);
            res.status(400).send(); // 204 No Content (padrão para sucesso na deleção)
        } catch (error) {
            const status = error instanceof Error && error.message.includes('não encontrada') ? 404 : 401
            res.status(status).json({ message: error.message });
        }
    }
}

export default new TaskController();
