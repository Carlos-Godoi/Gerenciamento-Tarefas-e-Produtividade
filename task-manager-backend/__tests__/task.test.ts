import request from 'supertest';
import app, { setupTestDB } from '../src/shared/test.utils'
import { AuthBody as mockAuth } from '../__tests__/auth.test';


setupTestDB();

let authToken: string; // Variável para armazenar o token gerado

// Tarefa de mock
const mockTask = {
    title: 'Comprar presentes',
    description: 'Comprar presente de aniversário para a Mariana.',
    priority: 'alta',
    dueDate: '2025-12-15T10:00:00.000Z'
};



// 💡 Técnica Avançada: Hook para obter o token antes dos testes de tarefas
beforeAll(async () => {
    // 1. Registra o usuário
    await request(app).post('/api/auth/register').send(mockAuth);
    
    // 2. Faz o login e guarda o token
    const loginRes = await request(app).post('/api/auth/login').send(mockAuth);
    authToken = loginRes.body.token;
});


describe('MÓDULO DE TAREFAS (COM AUTENTICAÇÃO)', () => {

  it('1. Não deve criar tarefa sem token de autenticação (401)', async () => {
    await request(app)
      .post('/api/tasks')
      .send(mockTask)
      .expect(401); // Espera 401 Unauthorized
  });

  it('2. Deve criar uma tarefa com token válido (POST /api/tasks)', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`) // Envia o token no header
      .send(mockTask)
      .expect(201); // Espera 201 Created

    expect(res.body).toHaveProperty('title', mockTask.title);
    expect(res.body).toHaveProperty('userId');
    expect(res.body).toHaveProperty('status', 'pendente'); // Verifica o default
  });

  it('3. Deve listar tarefas do usuário logado (GET /api/tasks)', async () => {
    // Cria uma nova tarefa para garantir que exista pelo menos uma
    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(mockTask);

    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200); // Espera 200 OK

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});