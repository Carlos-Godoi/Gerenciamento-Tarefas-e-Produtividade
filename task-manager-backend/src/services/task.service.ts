 import { FilterQuery, Types } from 'mongoose';
 import Task, { ITask, TaskPriority, TaskStatus } from '../models/task.models';
 import { CreateTaskBody, UpdateTaskBody  } from '../shared/schemas/task.schema';

 interface ITaskFilter {
    status?: TaskStatus;
    priority?: TaskPriority;
    title?: string;
    // Mais filtros avançados podem ser adicionados aqui
 }

 class TaskService {

    // 1. CRIAÇÃO
    async create(userId: string, taskData: CreateTaskBody): Promise<ITask> {
        const newTask = new Task({
            ...taskData,
            userId: new Types.ObjectId(userId), // Associa a tarefa ao userId
        });
        await newTask.save();
        return newTask;
    }

    // 2. LISTAGEM E FILTROS (Avançado)
    async getAll(userId: string, filters:ITaskFilter): Promise<ITask[]> {
        
        // Cria a query do MongoDB dinamicamente
        const query: FilterQuery<ITask> = { userId: new Types.ObjectId(userId) }; // Filtro de Propriedade (Obrigatório)

        if (filters.status) {
            query.status = filters.status;
        }
        if (filters.priority) {
            query.priority = filters.priority;
        }
        if (filters.title) {
            // Busca case-insensitive pelo título (Expressão Regular)
            query.title = { $regex: new RegExp(filters.title, 'i') };
        }

        // Retorna todas as tarefas que pertencem ao usuário e correspondem aos filtros
        const tasks = await Task.find(query).sort({ dueDate: 1, priority: -1 }); // Ordena por data e prioridade

        return tasks;
    }

    // 3. BUSCA POR ID
    async getById(userId: string, taskId: string): Promise<ITask> {

        // Busca o _id E o userId para garantir propriedade
        const task = await Task.findOne({
            _id: taskId,
            userId: new Types.ObjectId(userId),
        });

        if (!task) {
            throw new Error('Tarefa não encontrada ou acesso não autorizado.'); // 404/401
        }

        return task;
    }

    // 4. ATUALIZAÇÃO
    async update(userId: string, taskId: string, taskData: UpdateTaskBody): Promise<ITask> {
        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId, userId: new Types.ObjectId(userId) }, // Busca com filtro de propriedade
            { $set: taskData }, // Usa $set para atualizar apena os campos fornecidos
            { new: true } 
        );

        if (!updatedTask) {
            throw new Error('Tarefa não encontrada ou acesso não autorizado.');
        }

        return updatedTask
    }

    // 5. DELETE
    async delete(userId: string, taskId: string): Promise<ITask> {

        // Deleta o _id E o userId para garantir propriedade
        const deleteTask = await Task.findByIdAndDelete({
            _id: taskId,
            userId: new Types.ObjectId(userId),  
        });

        if (!deleteTask) {
            throw new Error('Tarefa não encontrada ou acesso não autorizado.');
        }

        return deleteTask;
    }
 }

 export default new TaskService();
