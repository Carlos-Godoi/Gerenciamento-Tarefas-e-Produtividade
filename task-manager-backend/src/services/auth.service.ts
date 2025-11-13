import User, { IUser } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { UnauthorizedError } from '../shared/errors/AppError';

const JWT_SECRET = process.env.JWT_SECRET as string;

class AuthService {
    // 1. Registro de Usuário
    async register(email: string, password: string): Promise<IUser> {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // Técnica Avançada: Lançar um erro customizado (adordaremos isso a seguir)
            throw new Error('O email já está cadastrado!');
        }

        // Hash de Senha: Garante que a senha não seja armazenada em texto puro
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({ email, passwordHash });
        await newUser.save();

        // Retorna o usuário(sem a senha)
        return newUser;
    }

    // 2. Login de Usuário
    async login(email: string, password: string): Promise<{token: string, userId: string }> {
        const user = await User.findOne({ email }) as (IUser & { _id: string | Types.ObjectId }) | null;

        if (!user) {
            throw new UnauthorizedError('Credenciais inválidas.'); // <-- Lança o erro 401
        }

        // Comparação do Hash: Verifica se a senha fornecida corresponde ao hash
        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            throw new UnauthorizedError('Credenciais inválidas.'); // <-- Lança o erro 401
        }

        // Geração do JWT: Cria o token que será enviado ao cliente
        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: '1d' } // Token expira em 1 dia
        ) ;

        return { token, userId: user._id.toString() };
    }
}

export default new AuthService();