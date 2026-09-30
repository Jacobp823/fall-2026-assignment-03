import { Router } from 'express';
import { getAllUsers, getUserById, createUser } from '../dal/users.js';
import type { Request, Response } from 'express';

const router = Router();

// TODO: Student implementation - Part 1: User Routes
// GET /users
router.get('/', async (req: Request, res: Response) => {
    const users = await getAllUsers();
    res.json(users);
});

// GET /users/:id
router.get('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const user = await getUserById(id);
    if (!user) {
        res.status(404).send('Not found');
        return;
    }
    res.json(user);
});

// POST /users
router.post('/', async (req: Request, res: Response) => {
    const user = await createUser(req.body);
    res.status(201).json(user);
});

export default router;
