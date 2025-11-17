import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTaskApi } from '../hooks/useTaskApi';
import { Task, TaskStatus, TaskPriority, CreateTaskForm } from '../types';

// 💡 Schema de Validação para o formulário (deve bater com o backend)
const taskFormSchema = z.object({
  title: z.string().min(3, 'Título é obrigatório.'),
  description: z.string().optional(),
  status: z.enum(['pendente', 'em progresso', 'concluído']).default('pendente'),
  priority: z.enum(['baixa', 'média', 'alta']).default('média'),
  // Garante que a data seja string ou null (para input[type=date])
  dueDate: z.string().optional().nullable().transform(e => e === "" ? null : e),
});

type TaskFormInputs = z.infer<typeof taskFormSchema>;

interface TaskFormModalProps {
  task?: Task; // Tarefa para edição (opcional)
  onClose: () => void;
  onSuccess: () => void;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ task, onClose, onSuccess }) => {
  const { createTask, updateTask } = useTaskApi();
  const isEditing = !!task;

  const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm<TaskFormInputs>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
        // Formata a data para o input HTML (YYYY-MM-DD)
        title: task?.title || '',
        description: task?.description || '',
        status: task?.status || 'pendente',
        priority: task?.priority || 'média',
        dueDate: task?.dueDate ? task.dueDate.substring(0, 10) : '',
    }
  });

  const onSubmit = async (data: TaskFormInputs) => {
    // 💡 Lógica Condicional: Criação ou Edição
    try {
      // Ajusta a data para o formato aceito pelo backend (string)
      const dataToSend = {
          ...data,
          dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null
      } as CreateTaskForm;

      if (isEditing && task) {
        // EDIÇÃO
        await updateTask(task._id, dataToSend);
      } else {
        // CRIAÇÃO
        await createTask(dataToSend);
      }
      
      onSuccess(); // Notifica o componente pai para recarregar a lista
      onClose();   // Fecha o modal

    } catch (e) {
      alert('Falha na operação: ' + (e as any).message);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', minWidth: '400px' }}>
        <h2>{isEditing ? 'Editar Tarefa' : 'Criar Nova Tarefa'}</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          
          <label>Título:</label>
          <input type="text" {...register('title')} />
          {/* ... Adicione mensagens de erro do react-hook-form se necessário */}

          <label>Descrição:</label>
          <textarea {...register('description')} />

          <label>Prioridade:</label>
          <select {...register('priority')}>
            <option value="baixa">Baixa</option>
            <option value="média">Média</option>
            <option value="alta">Alta</option>
          </select>
          
          {isEditing && (
            <>
              <label>Status:</label>
              <select {...register('status')}>
                <option value="pendente">Pendente</option>
                <option value="em progresso">Em Progresso</option>
                <option value="concluído">Concluída</option>
              </select>
            </>
          )}

          <label>Data de Vencimento:</label>
          <input type="date" {...register('dueDate')} />

          <div style={{ marginTop: '20px' }}>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : (isEditing ? 'Salvar Edição' : 'Criar')}
            </button>
            <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;