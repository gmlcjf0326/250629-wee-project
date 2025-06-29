import { Router } from 'express';
import { createContact, getContacts, getContactById, updateContactStatus } from '../controllers/contact.controller';

const router = Router();

// POST /api/contact - Create new contact/inquiry
router.post('/', createContact);

// GET /api/contact - Get all contacts (admin only - to be implemented)
router.get('/', getContacts);

// GET /api/contact/:id - Get contact by ID
router.get('/:id', getContactById);

// PATCH /api/contact/:id/status - Update contact status
router.patch('/:id/status', updateContactStatus);

export default router;