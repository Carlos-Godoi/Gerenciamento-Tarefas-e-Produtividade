import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { Task, CreateTaskForm, UpdateTaskForm, ApiError } from '../types';

const API_URL = process.env.REACT_APP_API_URL;

export const useTaskApi = () => {
    const { token, logout } = useAuth();

    // Instância do Axios pré-configurada (Técnica Avançada)
    const api: AxiosInstance = axios.create({
        baseURL: `${API_URL}/ tasks`,
        headers: {
            Authorization: `Bearer ${token}`, // Envia o token em todas as requisições
        },
    });

    // Interceptor para lidar com 401 (Token Expirado)
    api.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            if (error.response && error.response.status === 401) {
                // Se o token for inválido/expirado, força o logout
                logout();
            }
        }
    );

    const handleError = (error: unknown): ApiError => {
        if (axios.isAxiosError(error) && error.response) {
            return {
                message: error.response.data.message || 'Erro de comunicação com o servidor.',
                status: error.response.status,
            };
        }
        return { message: 'Ocorreu um erro inesperado.', status: 500 };
    };

    // Método CRUD

    // Listagem (GET /api/tasks?status=...)
    const getTasks = async (filters?: { status?: string, priority?: string }): Promise<Task[]> => {
        try {
            const response = await api.get<Task[]>('/', { params: filters });
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    };

    // Criação (POST /api/tasks)
    const createTask = async (data: CreateTaskForm): Promise<Task> => {
        try {
            const response = await api.post<Task>('/', data);
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    };

    // Edição (PUT /api/tasks/:id)
    const updateTask = async (taskId: string, data: UpdateTaskForm): Promise<Task> => {
        try {
            const response = await api.put<Task>(`/${taskId}`, data);
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    };

    // Deleção (DELETE /api/tasks/:id)
    const deleteTask = async (taskId: string): Promise<void> => {
        try {
            await api.delete(`/${taskId}`);
        } catch (error) {
            throw handleError(error);
        }
    };

    return { getTasks, createTask, updateTask, deleteTask };
};
