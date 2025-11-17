import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Páginas
import Login from './pages/Login';
import Register from './pages/Register';
import TaskList from '../src/pages/TaskList'; // Será criado na próxima etapa

// 💡 Componente de Rota Protegida (Técnica Avançada)
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isLoggedIn } = useAuth();
  
  // Se não estiver logado, redireciona para a página de login
  return isLoggedIn ? element : <Navigate to="/login" replace />; 
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/tasks" replace />} /> {/* Redireciona a raiz */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rotas Protegidas */}
          <Route 
            path="/tasks" 
            element={<ProtectedRoute element={<TaskList />} />} 
          />
          {/* Adicionar /tasks/:id/edit, etc. aqui */}

          <Route path="*" element={<h2>404 - Página não encontrada</h2>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;