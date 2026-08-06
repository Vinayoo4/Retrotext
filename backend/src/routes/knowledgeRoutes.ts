import { Router } from 'express';
import { ingestKnowledge, getKnowledgeBase, searchKnowledge } from '../knowledge/knowledgeController';

const router = Router();

router.get('/knowledge', getKnowledgeBase);
router.get('/knowledge/search', searchKnowledge);
router.post('/knowledge/ingest', ingestKnowledge);

export default router;
