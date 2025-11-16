import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthApi } from '../hooks/useAuthApi';
import { useAuth } from '../context/AuthContext';
import { AuthSchema, AuthForm, ApiError } from '../types';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login: apiLogin } = useAuthApi();
    const { login: contextLogin } = useAuth();
    const [error, setError] = useState<string | null>(null);

    // Configuração do React Hook Form com zod
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthForm>({
        resolver: zodResolver(AuthSchema),
    });

    const onSubmit = async (data: AuthForm) => {
        setError(null);
        try {
            const loginData = await apiLogin(data);
            contextLogin(loginData); // Atualiza o contexto e o localStorege
            navigate('/tasks'); // Redireciona para a página de tarefas
        } catch (e) {
            const apiError = e as ApiError;
            setError(apiError.message);
        }
    };

    return (
        <div>
            <h2>Acessar o Gerenciamento de Tarefas</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Email:</label>
                    <input type="email" {...register('email')} />
                    {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
                </div>
                <div>
                    <label>Senha:</label>
                    <input type="password" {...register('password')} />
                    {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
                </div>

                {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

                <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Aguarde...' : 'Login'}
                </button>
            </form>
            <p>Ainda não tem conta? <Link to="/register">Cadastre-se</Link></p>
        </div>
    );
};

export default Login;