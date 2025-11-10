import { z } from 'zod';

// Schema de validação usando Zod
export const authSchema = z.object({
    email: z.string().email('Formato de e-mail inválido.'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

export type AuthBody = z.infer<typeof authSchema>; // Tipagem para uso no Controller
