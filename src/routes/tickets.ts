import { Router, Request, Response } from 'express';
import { getAllTickets, getTicketById, createTicket, updateTicketStatus } from '../dal/tickets.js';
import { authMiddleware } from '../middleware/auth.js';
const router = Router();

// TODO: Student implementation - Part 1: Ticket Routes
// GET /tickets
router.get('/', async (req: Request, res: Response) => {
    const limit = req.query.limit !== undefined ? Number(req.query.limit) : undefined;
    
    const offset = req.query.offset !== undefined ? Number(req.query.offset) : undefined;

    const status = req.query.status !== undefined ? String(req.query.status) : undefined;

    const tickets = await getAllTickets({ limit, offset, status });
    res.json(tickets);
});
// GET /tickets/:id
router.get('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const ticket = await getTicketById(id);
    if (ticket) {
        res.json(ticket);
    } else {
        res.status(404).json({ message: 'Ticket not found' });
    }
});


// POST /tickets
router.post('/', authMiddleware, async (req: Request, res: Response) => {
    const { title, description } = req.body;
    if (typeof title !== 'string' || typeof description !== 'string') {
        res.status(400).json({ message: 'Bad Request' });
        return;
    }
    const ticket = await createTicket({ title, description, creator_id: res.locals.userId });
    res.status(201).json(ticket);
    }
);

// PATCH /tickets/:id/status
router.patch('/:id/status', authMiddleware, async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (typeof status !== 'string') {
        res.status(400).json({ message: 'Bad Request' });
        return;
    }
    const ticket = await updateTicketStatus(id, status);
    if (ticket) {
        res.status(200).json(ticket);
    } else {
        res.status(404).json({ message: 'Not found' });
    }
});


// TODO: Student implementation - Part 2: Time Log Routes
// POST /tickets/:id/time
// GET /tickets/:id/time

export default router;
