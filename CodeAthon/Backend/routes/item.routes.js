import { Router } from 'express';
import itemController from '../controllers/item.controller.js';
import requireAuth from '../middleware/auth.middleware.js';
import requireRole from '../middleware/role.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', itemController.getItems);
router.post('/', requireRole('OWNER', 'ADMIN'), itemController.createItem);
router.get('/:id', itemController.getItemById);
router.put('/:id', requireRole('OWNER', 'ADMIN'), itemController.updateItem);
router.delete('/:id', requireRole('OWNER', 'ADMIN'), itemController.deleteItem);

export default router;
