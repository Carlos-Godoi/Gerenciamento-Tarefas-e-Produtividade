import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Carrega variáveis de ambiente, garantindo que o JWT_SECRET esteja disponível
dotenv.config({ path: '.env.test' });

// Configuração para garantir que a conexão com o DB seja fechada após todos os teste
afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
    }
});