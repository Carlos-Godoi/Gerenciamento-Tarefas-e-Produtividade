import mongoose from "mongoose";
import app from '../server'; // Importe a instância do Express (vamos ajustá-la)
import { Application } from "express";

export async function setupTestDB() {
    const MONGODB_URI_TEST = process.env.MONGODB_URI as string;

    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(MONGODB_URI_TEST);
    }

    // Limpa o banco de dados antes de cada teste do módulo
    beforeEach(async () => {
        // Limpeza completa do DB
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    });
}

// 💡 Técnica Avançada: Exporta a aplicação do Express para o Supertest
// Precisamos refatorar o server.ts para não chamar o listen() dentro dele.
export default app;