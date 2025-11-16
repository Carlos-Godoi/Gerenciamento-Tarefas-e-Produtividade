import React, { useState, createContext, useContext, useEffect, ReactNode} from 'react';
import { LoginResponse, UserState } from '../types';

// 1. Definição do Context (Estado inicial e funções)
interface AuthContextType extends UserState {
    login: (data: LoginResponse) => void;
    logout: () => void;
}

const initialContext: AuthContextType = {
    token: null,
    userId: null,
    isLoggedIn: false,
    login: () => {},
    logout: () => {},
};

const AuthContext = createContext<AuthContextType>(initialContext);

// 2. Provedor de Context (Onde a lógica de persistência reside)
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [UserState, setUserState] = useState<UserState>({
        token: null,
        userId: null,
        isLoggedIn: false,
    });

    // Efeito de Persistência (Carrega o estado do localStorage)
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (token && userId) {
            setUserState({ token, userId, isLoggedIn: true });
        }
    }, []);

    const login = (data: LoginResponse) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        setUserState({ token: data.token, userId: data.userId, isLoggedIn: true });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setUserState({ token: null, userId: null, isLoggedIn: false });
    };

    return (
        <AuthContext.Provider value={{ ...UserState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Hook Customizado para uso fácil
export const useAuth = () => useContext(AuthContext);