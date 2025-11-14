import request from 'supertest';
import app, { clearDatabase, connectTestDB } from '../src/shared/test.utils'; 
import { authPayload, taskPayload as mockTask } from '../src/shared/mock-data/mock-data';

let authToken: string; // Variável para armazenar o token gerado

// Configurações Globais
beforeAll(async () => {
    // Conecta ao DB antes de todos os testes
    await connectTestDB();
    
    // ✅ CORREÇÃO 2: Usa 'authPayload' (o nome correto do objeto importado)
    // 1. Registra o usuário
    await request(app).post('/api/auth/register').send(authPayload);
    
    // 2. Faz o login e guarda o token
    const loginRes = await request(app).post('/api/auth/login').send(authPayload);
    authToken = loginRes.body.token;
});

// Garante que o DB seja limpo antes de cada teste no módulo (necessário para testes de CRUD)
describe('MÓDULO DE TAREFAS (COM AUTENTICAÇÃO)', () => {
    
    // ✅ CORREÇÃO de Hooks Aninhados (Adicionado o hook aqui)
    beforeEach(async () => {
        await clearDatabase();
    });

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
        // ❌ Ajuste a asserção 'pendente' se o seu backend usa outro default (ex: 'TODO')
        expect(res.body).toHaveProperty('status', 'pendente'); 
    });

    it('3. Deve listar tarefas do usuário logado (GET /api/tasks)', async () => {
        // Cria uma nova tarefa (garante que o beforeEach limpa, e este teste cria o necessário)
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
        expect(res.body[0]).toHaveProperty('title', mockTask.title);
    });

    // TESTE DE LIMPEZA: Garante que os hooks estão funcionando
    it('4. Deve listar APENAS uma tarefa (Verificação de Limpeza)', async () => {
        // Cria uma ÚNICA tarefa neste teste
        await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${authToken}`)
            .send(mockTask);

        const res = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        // Se a limpeza funcionou, deve haver apenas 1 tarefa
        expect(res.body.length).toBe(1); 
    });
});