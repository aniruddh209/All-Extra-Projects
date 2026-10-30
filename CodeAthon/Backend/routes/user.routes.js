import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import requireAuth from '../middleware/auth.middleware.js';
import requireRole from '../middleware/role.middleware.js';

const router = Router();

// Only OWNER can manage users
router.use(requireAuth);
router.use(requireRole('OWNER'));

router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.patch('/:id/status', userController.toggleStatus);
router.delete('/:id', userController.deleteUser);

export default router;
