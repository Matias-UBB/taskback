import express from 'express';
const router = express.Router();

import * as taskController from '../controllers/taskController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validationMiddleware } from '../middleware/validationDtoMiddleware';
import { CreateTaskDto, UpdateTaskDto } from '../dto/taskDto';

router.post('/create', authMiddleware,validationMiddleware(CreateTaskDto) ,taskController.createTask);
router.get('/get/:id', authMiddleware, taskController.getOneTask);
router.get('/getByProject/:project', authMiddleware, taskController.getTasksByProject);
router.put('/update/:id', authMiddleware,validationMiddleware(UpdateTaskDto) , taskController.updateTask);
router.delete('/delete/:id', authMiddleware, taskController.deleteTask);

export default router;
