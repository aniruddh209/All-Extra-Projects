import { Router } from 'express';
import partyController from '../controllers/party.controller.js';
import requireAuth from '../middleware/auth.middleware.js';
import requireRole from '../middleware/role.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', partyController.getParties);
router.post('/', partyController.createParty);
router.get('/:id', partyController.getPartyById);
router.put('/:id', requireRole('OWNER', 'ADMIN'), partyController.updateParty);
router.delete('/:id', requireRole('OWNER', 'ADMIN'), partyController.deleteParty);
router.get('/:id/bills', partyController.getPartyBills);

export default router;
