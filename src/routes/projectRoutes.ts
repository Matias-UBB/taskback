import express from 'express';
const router = express.Router();

import * as projectController from '../controllers/projectController';
import { authMiddleware } from '../middleware/authMiddleware';

router.post('/create', authMiddleware, projectController.createProject);
router.get('/get/:id', authMiddleware, projectController.getOneProject);
router.get('/getByUser', authMiddleware, projectController.getProjectsByUser);
router.put('/update/:id', authMiddleware, projectController.updateProject);
router.delete('/delete/:id', authMiddleware, projectController.deleteProject);

export default router;
