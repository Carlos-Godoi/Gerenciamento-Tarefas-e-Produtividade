import express, { type Application } from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import { errorMiddleware } from './shared/middlewares/error.middleware';
import cors from 'cors';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI as string;

// Middlewares
app.use(cors());
app.use(express.json()); // Habilita o parsing do JSON no body da requisição


// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorMiddleware);

// Exportação para testes
export default app;

// Conexão com o DB e o app.listen() só rodam se o arquivo for o ponto de entrada (execução normal, não teste)
if (require.main === module) {
mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('Conectado ao MongoDB!');
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
})
.catch(err => {
    console.error('Erro de conexão com o MongoDB:', err);
    process.exit(1);
});
}

