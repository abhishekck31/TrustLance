import { Router } from 'express';
import { pinJobMetadata } from '../controllers/metadataController';

const router = Router();

router.post('/pin', pinJobMetadata);

export default router;