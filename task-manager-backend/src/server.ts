import express, { type Application } from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI as string;

// Middlewares
app.use(express.json()); // Habilita o parsing do JSON no body da requisição

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Conexão com o MongoDB
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