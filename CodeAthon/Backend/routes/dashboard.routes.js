import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller.js';
import requireAuth from '../middleware/auth.middleware.js';
import requireRole from '../middleware/role.middleware.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole('OWNER', 'ADMIN', 'STAFF'));

router.get('/summary', dashboardController.getSummary);
router.get('/sales', dashboardController.getSummary);
router.get('/tax', dashboardController.getSummary);

export default router;
