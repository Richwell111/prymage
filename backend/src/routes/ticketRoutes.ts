import { Router } from 'express';
import { createTicket, getTickets, updateStatus, addNote } from '../controllers/ticketController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

// Public: Create a ticket
router.post('/', createTicket);

// Protected: Admin/Staff only
router.get('/', protect, adminOnly, getTickets);
router.patch('/:id/status', protect, adminOnly, updateStatus);
router.post('/:id/notes', protect, adminOnly, addNote);

export default router;
