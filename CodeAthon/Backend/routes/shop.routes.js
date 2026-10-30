import { Router } from 'express';
import shopController from '../controllers/shop.controller.js';
import requireAuth from '../middleware/auth.middleware.js';
import requireRole from '../middleware/role.middleware.js';

const router = Router();

// Retrieve current shop profile
router.get('/', requireAuth, shopController.getShop);

// Update shop profile (OWNER only)
router.put('/', requireAuth, requireRole('OWNER'), shopController.updateShop);

export default router;
