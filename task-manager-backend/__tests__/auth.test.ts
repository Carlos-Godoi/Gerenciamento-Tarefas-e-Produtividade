import request from 'supertest';
import app, { clearDatabase, connectTestDB } from '../src/shared/test.utils';
import { AuthBody as mockAuth} from '../src/shared/schemas/auth.schema';


// Conecta ao BD antes de todos os testes
beforeAll(async () => {
    await connectTestDB();
});

// Dados de Mock para teste (Arquivo criado separadamente)
const mockAuth = {
    email: 'teste@email.com',
    password: 'senhaSegura123'
};

describe('MÓDULO DE AUTENTICAÇÃO (JWT)', () => {

    beforeEach(async () => {
        await clearDatabase(); // Chama apenas a lógica de limpeza
    });
    
    it('1. Deve registrar um novo usuário com sucesso (POST /api/auth/register)', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(mockAuth)
            .expect(201); // Espera o status 201 Created

        expect(res.body).toHaveProperty('userId');
        expect(res.body).toHaveProperty('message', 'Usuário registrado com sucesso.');
    });

    it('2. Não deve registrar um usuário com email já existente (POST /api/auth/register)', async () => {
        // Primeiro, registra
        await request(app).post('/api/auth/register').send(mockAuth);

        // Segundo, tenta registrar novamente
        const res = await request(app)
            .post('/api/auth/register')
            .send(mockAuth)
            .expect(400); // Espera o status 400 Bad Request

        expect(res.body).toHaveProperty('message', 'O email já está cadastrado!');
    });

    it('3. Deve fazer login e retornar um token JWT (POST /api/auth/login)', async () => {
        // Garante que o usuário existe antes de tentar o login
        await request(app).post('/api/auth/register').send(mockAuth);

        const res = await request(app)
        .post('/api/auth/login')
        .send(mockAuth)
        .expect(200); // Espera o status 200 OK

        expect(res.body).toHaveProperty('token');
        expect(typeof res.body.token).toBe('string');
        expect(res.body).toHaveProperty('userId');
    });

    it('4. Não deve fazer login com senha incorreta (POST /api/auth/login)', async () => {
        await request(app).post('/api/auth/register').send(mockAuth);

        const res = await request(app)
        .post('/api/auth/login')
        .send({ email: mockAuth.email, password: 'senhaErrada' })
        .expect(401); // Espera o status 401 Unauthorized

        expect(res.body).toHaveProperty('message', 'Credenciais inválidas.');
    });
});

