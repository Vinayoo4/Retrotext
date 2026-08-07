import { Router } from 'express';
import { getParties, createParty, updateParty, deleteParty } from '../controllers/partiesController';

const router = Router();

router.get('/parties', getParties);
router.post('/parties', createParty);
router.put('/parties/:id', updateParty);
router.delete('/parties/:id', deleteParty);

export default router;
