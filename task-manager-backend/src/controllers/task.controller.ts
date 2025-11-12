import { Request, Response } from 'express';
import TaskService from '../services/task.service';
import { createTaskSchema, updateTaskSchema } from '../shared/schemas/task.schema';
import { ITaskFilter } from '../services/task.service';
import { ZodError } from 'zod';


// Função utilitária para tratar e responder a erros comuns
const handleError = (res: Response, error: unknown): void => {
    if (error instanceof ZodError) {
        // Erro de validação de dados de entrada
        res.status(400).json({ 
            message: 'Erro de validação de dados.', 
            details: error.issues 
        });
    } else if (error instanceof Error) {
        let status = 500;
        
        // Define status 404 para recursos não encontrados
        if (error.message.includes('não encontrada')) {
            status = 404;
        } 
        // Define status 400 para erros de serviço genéricos/regras de negócio 
        // (excluindo os 404 já tratados)
        else if (status === 500) {
            status = 400; 
        }

        res.status(status).json({ message: error.message });
    } else {
        // Erro interno desconhecido
        console.error('Erro interno desconhecido:', error);
        res.status(500).json({ message: 'Erro interno desconhecido.' });
    }
};

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
            // Usa a função auxiliar para tratar ZodError e outros
            handleError(res, error);
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
            // Em listagens, é comum retornar 500 ou um 400 genérico se o filtro for inválido.
            // Aqui, mantemos o 500 para erros no serviço/banco, pois a validação de query params não foi usada.
            console.error('Erro em getAll:', error);
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
            // O `handleError` lida com 404 e outros erros do serviço
            handleError(res, error);
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
            // O `handleError` lida com ZodError, 404 e outros erros do serviço
            handleError(res, error);
        }
    }

    // Deleção (DELETE /api/tasks/:id)
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userId as string;
            const taskId = req.params.id;

            await TaskService.delete(userId, taskId);

            // 204 No Content é o padrão para sucesso na deleção
            res.status(204).send(); 
        } catch (error) {
            // O `handleError` lida com 404 e outros erros do serviço
            handleError(res, error);
        }
    }
}

export default new TaskController();