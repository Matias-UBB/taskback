import { Request, Response, NextFunction } from 'express';
import { createTask, getOneTask, updateTask, deleteTask } from '../controllers/taskController';
import * as taskService from '../service/taskService';

jest.mock('../service/taskService');

describe('TaskController', () => {

  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('debería crear una tarea y devolver 201', async () => {
      req.body = { name: 'Test Task', description: 'Test Description', project: '507f191e810c19729de860ea' };
      (taskService.createTask as jest.Mock).mockResolvedValue(req.body);

      await createTask(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });
  });

  describe('getOneTask', () => {
    it('debería devolver una tarea si se encuentra', async () => {
      req.params = { id: '123' };
      (taskService.findTaskById as jest.Mock).mockResolvedValue({ id: '123', name: 'Test Task' });

      await getOneTask(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: '123', name: 'Test Task' });
    });

    it('debería devolver 404 si la tarea no se encuentra', async () => {
      req.params = { id: '123' };
      (taskService.findTaskById as jest.Mock).mockResolvedValue(null);

      await getOneTask(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
  });

  describe('updateTask', () => {
    it('debería actualizar una tarea y devolver 200', async () => {
      req.params = { id: '123' };
      req.body = { name: 'Updated Task' };
      (taskService.updateTask as jest.Mock).mockResolvedValue(req.body);

      await updateTask(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it('debería devolver 404 si la tarea no se encuentra para actualizar', async () => {
      req.params = { id: '123' };
      req.body = { name: 'Updated Task' };
      (taskService.updateTask as jest.Mock).mockResolvedValue(null);

      await updateTask(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
  });

  describe('deleteTask', () => {
    it('debería eliminar una tarea y devolver 200', async () => {
      req.params = { id: '123' };
      (taskService.deleteTask as jest.Mock).mockResolvedValue({ id: '123', name: 'Deleted Task' });

      await deleteTask(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({});
    });

    it('debería devolver 404 si la tarea no se encuentra para eliminar', async () => {
      req.params = { id: '123' };
      (taskService.deleteTask as jest.Mock).mockResolvedValue(null);

      await deleteTask(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
  });
});
