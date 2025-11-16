import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthApi } from '../hooks/useAuthApi';
import { AuthSchema, AuthForm, ApiError } from '../types';

const Register: React.FC = () => {
  const navigate = useNavigate();
  // 💡 DIFERENÇA 1: Usamos a função 'register' da API
  const { register: apiRegister } = useAuthApi(); 
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reutilizamos o mesmo schema AuthSchema para validar email e senha
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthForm>({
    resolver: zodResolver(AuthSchema),
  });

  const onSubmit = async (data: AuthForm) => {
    setError(null);
    setSuccessMessage(null);
    
    try {
      // 💡 DIFERENÇA 2: Chamada ao endpoint de registro (POST /api/auth/register)
      await apiRegister(data); 
      
      setSuccessMessage('Usuário cadastrado com sucesso! Faça login.');
      
      // 💡 DIFERENÇA 3: Redireciona para a página de Login após o sucesso
      setTimeout(() => {
        navigate('/login'); 
      }, 2000); 

    } catch (e) {
      const apiError = e as ApiError;
      // Exibe o erro de validação (ex: "O email já está cadastrado.") vindo do Backend (400)
      setError(apiError.message); 
    }
  };

  return (
    <div>
      <h2>Criar uma nova conta</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email:</label>
          <input type="email" {...register('email')} />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>
        <div>
          <label>Senha:</label>
          <input type="password" {...register('password')} />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>
        
        {/* Mensagens de feedback */}
        {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green', fontWeight: 'bold' }}>{successMessage}</p>}
        
        <button type="submit" disabled={isSubmitting || !!successMessage}>
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
      <p>Já tem conta? <Link to="/login">Faça Login</Link></p>
    </div>
  );
};

export default Register;