import { Request, Response, NextFunction } from 'express';
import { register, login } from '../controllers/authController';
import * as userService from '../service/authService';

jest.mock('../service/authService');

describe('AuthController', () => {

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

  describe('register', () => {
    it('debería registrar un usuario y devolver 201', async () => {
      req.body = { name: 'Test User', email: 'test@example.com', password: 'password123' };
      (userService.createUser as jest.Mock).mockResolvedValue(req.body);

      await register(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it('debería manejar errores de validación y devolver 400', async () => {
      req.body = { nombre: '', email: 'invalid-email', password: '' };
      await register(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.any(Object));
    });

    it('debería manejar errores del servicio y pasar al middleware de manejo de errores', async () => {
      req.body = { name: 'Test User', email: 'test@example.com', password: 'password123' };
      (userService.createUser as jest.Mock).mockRejectedValue(new Error('Service error'));

      await register(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();

    });
  });

  describe('login', () => {
    it('debería devolver un token si las credenciales son correctas y devolver 200', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      (userService.loginUser as jest.Mock).mockResolvedValue({ token: 'fake-jwt-token' });

      await login(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: 'fake-jwt-token' });
    });

    it('debería manejar errores de validación y devolver 400', async () => {
      req.body = { email: 'invalid-email', password: '' };
      await login(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.any(Object));
    });

    it('debería manejar errores del servicio y pasar al middleware de manejo de errores', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      (userService.loginUser as jest.Mock).mockRejectedValue(new Error('Service error'));

      await login(req as Request, res as Response, next);


     expect(next).toHaveBeenCalledWith(expect.any(Error));
     expect(res.status).not.toHaveBeenCalled();
     expect(res.json).not.toHaveBeenCalled();
    });
  });
});
