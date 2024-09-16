import { Request, Response, NextFunction } from 'express';
import { createProject, getOneProject, updateProject, deleteProject } from '../controllers/projectController';
import * as projectService from '../service/projectService';

jest.mock('../service/projectService');

describe('ProjectController', () => {
  
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

  describe('createProject', () => {
    it('debería crear un proyecto y devolver 201', async () => {
      req.body = { name: 'Test Project', description: 'Test Description', user: 'user1' };
      (projectService.createProject as jest.Mock).mockResolvedValue(req.body);

      await createProject(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });
  });

  describe('getOneProject', () => {
    it('debería devolver un proyecto si se encuentra', async () => {
      req.params = { id: '123' };
      (projectService.findProjectById as jest.Mock).mockResolvedValue({ id: '123', name: 'Test Project' });

      await getOneProject(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: '123', name: 'Test Project' });
    });

    it('debería devolver 404 si el proyecto no se encuentra', async () => {
      req.params = { id: '123' };
      (projectService.findProjectById as jest.Mock).mockResolvedValue(null);

      await getOneProject(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Project not found' });
    });
  });

  describe('updateProject', () => {
    it('debería actualizar un proyecto y devolver 200', async () => {
      req.params = { id: '123' };
      req.body = { name: 'Updated Project' };
      (projectService.updateProject as jest.Mock).mockResolvedValue(req.body);

      await updateProject(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it('debería devolver 404 si el proyecto no se encuentra para actualizar', async () => {
      req.params = { id: '123' };
      req.body = { name: 'Updated Project' };
      (projectService.updateProject as jest.Mock).mockResolvedValue(null);

      await updateProject(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Project not found' });
    });
  });

  describe('deleteProject', () => {
    it('debería eliminar un proyecto y devolver 200', async () => {
      req.params = { id: '123' };
      (projectService.deleteProject as jest.Mock).mockResolvedValue({ id: '123', name: 'Deleted Project' });

      await deleteProject(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({});
    });

    it('debería devolver 404 si el proyecto no se encuentra para eliminar', async () => {
      req.params = { id: '123' };
      (projectService.deleteProject as jest.Mock).mockResolvedValue(null);

      await deleteProject(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Project not found' });
    });
  });
});
