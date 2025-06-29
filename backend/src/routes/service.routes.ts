import { Router } from 'express';
import { getServices, getServiceById, createService, updateService, deleteService } from '../controllers/service.controller';

const router = Router();

// GET /api/services - Get all services
router.get('/', getServices);

// GET /api/services/:id - Get service by ID
router.get('/:id', getServiceById);

// POST /api/services - Create new service (admin only - to be implemented)
router.post('/', createService);

// PUT /api/services/:id - Update service
router.put('/:id', updateService);

// DELETE /api/services/:id - Delete service
router.delete('/:id', deleteService);

export default router;