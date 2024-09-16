import express from 'express';
const router = express.Router();

import * as taskController from '../controllers/taskController';
import { authMiddleware } from '../middleware/authMiddleware';

router.post('/create', authMiddleware, taskController.createTask);
router.get('/get/:id', authMiddleware, taskController.getOneTask);
router.get('/getByProject/:project', authMiddleware, taskController.getTasksByProject);
router.put('/update/:id', authMiddleware, taskController.updateTask);
router.delete('/delete/:id', authMiddleware, taskController.deleteTask);

export default router;
