import React, { useState, useEffect, useCallback } from 'react';
import { useTaskApi } from '../hooks/useTaskApi';
import { useAuth } from '../context/AuthContext';
import { Task, TaskStatus } from '../types';
import TaskFormModal from '../components/TaskFormModal'; // Componente de formulário


const TaskList: React.FC = () => {
  const { logout } = useAuth();
  const { getTasks, deleteTask, updateTask } = useTaskApi();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para modal de edição/criação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);

  // 💡 Funções de Recarregamento e Lógica de Negócio

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Exemplo de filtro (pode ser expandido com estado de filtro)
      const fetchedTasks = await getTasks({}); 
      setTasks(fetchedTasks);

      console.log('Tarefas recebidas:', fetchedTasks);

      

    } catch (e) {
      setError('Falha ao carregar tarefas. Você pode estar deslogado.');
    } finally {
      setIsLoading(false);
    }
  }, [getTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskAction = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };
  
  const handleCreateNew = () => {
    setTaskToEdit(undefined);
    setIsModalOpen(true);
  };

  const handleDelete = async (taskId: string) => {
    if (window.confirm('Tem certeza que deseja deletar esta tarefa?')) {
      try {
        await deleteTask(taskId);
        fetchTasks(); // Recarrega a lista
      } catch (e) {
        setError('Erro ao deletar tarefa.');
      }
    }
  };
  
  const handleToggleStatus = async (task: Task) => {
      const newStatus: TaskStatus = task.status === 'concluído' ? 'pendente' : 'concluído';
      try {
          await updateTask(task._id, { status: newStatus });
          fetchTasks(); 
      } catch (e) {
          setError('Erro ao atualizar status.');
      }
  }


  if (isLoading) return <div>Carregando tarefas...</div>;
  if (error) return <div>{error} <button onClick={logout}>Refazer Login</button></div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Minhas Tarefas</h1>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleCreateNew}>+ Nova Tarefa</button>
        <button onClick={logout} style={{ marginLeft: '10px' }}>Sair</button>
      </div>

      {tasks.length === 0 ? (
        <p>Você não tem nenhuma tarefa. Que tal criar uma?</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map(task => (
            <li key={task._id} style={{ 
                border: '1px solid #ccc', 
                padding: '10px', 
                marginBottom: '10px',
                opacity: task.status === 'concluído' ? 0.6 : 1
            }}>
              <h3>{task.title} ({task.priority})</h3>
              <p>{task.description}</p>
              <p>Vencimento: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
              <p>Status: **{task.status}**</p>
              
              <button onClick={() => handleToggleStatus(task)}>
                  {task.status === 'concluído' ? 'Marcar como Pendente' : 'Marcar como Concluída'}
              </button>
              <button onClick={() => handleTaskAction(task)} style={{ margin: '0 10px' }}>
                Editar
              </button>
              <button onClick={() => handleDelete(task._id)}>Deletar</button>
            </li>
          ))}
        </ul>
      )}

      {/* Modal de Criação/Edição */}
      {isModalOpen && (
        <TaskFormModal 
          task={taskToEdit} 
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchTasks} // Recarrega a lista após sucesso
        />
      )}
    </div>
  );
};

export default TaskList;