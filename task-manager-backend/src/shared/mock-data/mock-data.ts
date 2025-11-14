// mock-data.ts

/**
 * UTILS: Função para obter a data de amanhã formatada em ISO.
 * Garante que o `dueDate` para novas tarefas seja sempre no futuro.
 */
const getTomorrowISOString = (): string => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Adiciona um dia
    return tomorrow.toISOString();
};

// Dados de Autenticação (Payload)
// (Mantidos inalterados, pois não dependem do Task Model)
export const authPayload = {
    email: 'teste.usuario@mock.com', 
    password: 'senhaSegura123',
    name: 'Usuario Mock'
};

// Dados de Autenticação para login com credenciais inválidas
export const invalidAuthPayload = {
    email: 'teste.usuario@mock.com',
    password: 'senhaIncorreta'
};

// Dados de Tarefa (Payload)
export const taskPayload = {
    title: 'Finalizar Correção de Erros',
    description: 'Implementar as correções de hook aninhado e payload de registro.',
    // CORREÇÃO: Status e Priority alterados para Português conforme o Schema
    status: 'pendente', // Valores válidos: 'pendente', 'em progresso', 'concluído'
    priority: 'alta', // Valores válidos: 'baixa', 'média', 'alta'
    dueDate: getTomorrowISOString() 
};

// Dados de Tarefa para atualização (Patch/Put)
export const updateTaskPayload = {
    title: 'Correção Concluída',
    // CORREÇÃO: Status e Priority alterados para Português conforme o Schema
    status: 'concluído', 
    priority: 'média',
};