import { Router } from 'express';
import billController from '../controllers/bill.controller.js';
import requireAuth from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', billController.getBills);
router.post('/', billController.createBill);
router.get('/:id', billController.getBillById);
router.get('/:id/pdf', billController.downloadPdf);
router.get('/:id/download', billController.downloadPdf);
router.post('/:id/email', billController.emailBill);

export default router;
