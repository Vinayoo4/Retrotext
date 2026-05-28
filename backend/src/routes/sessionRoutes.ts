import { Router } from 'express';
import { getSessions, createSession } from '../controllers/sessionController';

const router = Router();

router.get('/sessions', getSessions);
router.post('/sessions', createSession);

export default router;
