import { Router } from 'express';
import { getMissions, startMission, getMissionStatus } from '../missions/missionController';

const router = Router();

router.get('/missions', getMissions);
router.post('/missions', startMission);
router.get('/missions/:id', getMissionStatus);

export default router;
