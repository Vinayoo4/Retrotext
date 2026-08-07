import { Router } from 'express';
import { getCatalogue, createCatalogueItem, updateCatalogueItem, deleteCatalogueItem } from '../controllers/catalogueController';

const router = Router();

router.get('/catalogue', getCatalogue);
router.post('/catalogue', createCatalogueItem);
router.put('/catalogue/:id', updateCatalogueItem);
router.delete('/catalogue/:id', deleteCatalogueItem);

export default router;
