import { Router } from 'express';
import TaskController from '../controllers/task.controller';
import { authMiddleware } from '../shared/middlewares/auth.middleware';

const router = Router();

// Todas as rotas usam authMiddleqware para garantir que o usuário esteja logado
router.use(authMiddleware);

// CRUD Completo
router.post('/', TaskController.create);
router.get('/', TaskController.getAll);
router.get('/:id', TaskController.getById);
router.put('/:id', TaskController.update);
router.delete('/:id', TaskController.delete);

export default router;

