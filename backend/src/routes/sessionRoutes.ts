import { Router } from 'express';
import { getSessions, createSession } from '../controllers/sessionController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Protect session routes with JWT middleware
router.get('/sessions', requireAuth, getSessions);
router.post('/sessions', requireAuth, createSession);

export default router;
