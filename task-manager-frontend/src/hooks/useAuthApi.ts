// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError} from 'axios';
import { AuthForm, LoginResponse, ApiError } from '../types';

const API_URL = process.env.REACT_APP_API_URL;

export const useAuthApi = () => {

    // Função auxiliar para tratar erros da API
    const handleError = (error: unknown): ApiError => {
        if (axios.isAxiosError(error) && error.response) {
            return {
                message: error.response.data.message || 'Erro de comunicação com o servidor.',
                status: error.response.status,
            };
        }
        return { message: 'Ocorreu um erro inesperado.', status: 500 };
    };

    const register = async (data: AuthForm): Promise<void> => {
        try {
            await axios.post(`${API_URL}/auth/register`, data);
        } catch (error) {
            throw handleError(error);
        }
    };

    const login = async (data: AuthForm): Promise<LoginResponse> => {
        try {
            const response = await axios.post<LoginResponse>(`${API_URL}/suth/login`, data);
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    };

    return { register, login };
}

