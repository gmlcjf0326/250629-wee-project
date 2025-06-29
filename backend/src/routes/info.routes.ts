import { Router } from 'express';
import { getProjectInfo, updateProjectInfo } from '../controllers/info.controller';

const router = Router();

// GET /api/info - Get project information
router.get('/', getProjectInfo);

// PUT /api/info - Update project information (admin only - to be implemented)
router.put('/', updateProjectInfo);

export default router;