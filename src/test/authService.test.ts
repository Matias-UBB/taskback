import { createUser, loginUser } from '../service/authService';
import { User } from '../models/userModel';

jest.mock('../models/userModel');  // Mock del modelo de usuario

describe('AuthService', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();  // Limpiar mocks antes de cada prueba
  });

  describe('createUser', () => {
    it('debería crear un usuario correctamente', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);  // Simula que el usuario no existe
      (User.prototype.save as jest.Mock).mockResolvedValue({ id: '123', email: 'test@example.com' });  // Simula que el usuario se guarda correctamente

      const userData = { name: 'Test User', email: 'test@example.com', password: 'password123' };
      const newUser = await createUser(userData);

      expect(newUser).toHaveProperty('email', 'test@example.com');
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(User.prototype.save).toHaveBeenCalled();
    });

    it('debería lanzar un error si el usuario ya existe', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ id: '123', email: 'test@example.com' });  // Simula que el usuario ya existe

      const userData = { name: 'Test User', email: 'test@example.com', password: 'password123' };

      await expect(createUser(userData)).rejects.toThrow('User already exists');
    });
  });

  describe('loginUser', () => {
    it('debería devolver un token si las credenciales son correctas', async () => {
      const mockUser = { 
        id: '123', 
        email: 'test@example.com', 
        matchPassword: jest.fn().mockResolvedValue(true)  // Simula que la contraseña es correcta
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const loginData = { email: 'test@example.com', password: 'password123' };
      const result = await loginUser(loginData);

      expect(result).toHaveProperty('token');
      expect(mockUser.matchPassword).toHaveBeenCalledWith('password123');
    });

    it('debería lanzar un error si las credenciales son incorrectas', async () => {
      const mockUser = { 
        id: '123', 
        email: 'test@example.com', 
        matchPassword: jest.fn().mockResolvedValue(false)  // Simula que la contraseña es incorrecta
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const loginData = { email: 'test@example.com', password: 'wrongpassword' };

      await expect(loginUser(loginData)).rejects.toThrow('Invalid credentials');
    });
  });
});
