import mongoose from 'mongoose';
import app from '../server'; // Importe a instância do Express (vamos ajustá-la)


// Função que apenas conecta ou garante a conexão
export async function connectTestDB() {
    const MONGODB_URI_TEST = process.env.MONGODB_URI as string;

    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(MONGODB_URI_TEST);
        console.log("Conectado ao MongoDB de teste.");
    }
}

// Função que apenas contém a lógica de limpeza do DB
export async function clearDatabase() {

    if (mongoose.connection.readyState === 1) { // Verifica se está conectado
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    }    
}

// 💡 Técnica Avançada: Exporta a aplicação do Express para o Supertest
// Precisamos refatorar o server.ts para não chamar o listen() dentro dele.
export default app;