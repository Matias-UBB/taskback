import { createTask, findTaskById, findTaskForProject, updateTask, deleteTask } from '../service/taskService';
import { Task } from '../models/taskModel';

jest.mock('../models/taskModel');

describe('TaskService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('debería crear una tarea correctamente', async () => {
      (Task.prototype.save as jest.Mock).mockResolvedValue({ id: '123', name: 'Test Task', project: '507f191e810c19729de860ea' });

      const taskData = { name: 'Test Task', description: 'Test Description', project: '507f191e810c19729de860ea' };
      const newTask = await createTask(taskData);

      expect(newTask).toHaveProperty('name', 'Test Task');
      expect(Task.prototype.save).toHaveBeenCalled();
    });
  });

  describe('findTaskById', () => {
    it('debería encontrar una tarea por ID', async () => {
      (Task.findById as jest.Mock).mockResolvedValue({ id: '123', name: 'Test Task' });

      const task = await findTaskById('123');

      expect(task).toHaveProperty('id', '123');
      expect(Task.findById).toHaveBeenCalledWith('123');
    });

    it('debería lanzar un error si la tarea no se encuentra', async () => {
      (Task.findById as jest.Mock).mockResolvedValue(null);

      await expect(findTaskById('123')).rejects.toThrow('Task not found');
    });
  });

  describe('findTasksForProject', () => {
    it('debería encontrar tareas por proyecto', async () => {
      (Task.find as jest.Mock).mockResolvedValue([{ id: '123', name: 'Test Task', project: 'proj1' }]);

      const tasks = await findTaskForProject('proj1');

      expect(tasks).toHaveLength(1);
      expect(Task.find).toHaveBeenCalledWith({ project: 'proj1' });
    });
  });

  describe('updateTask', () => {
    it('debería actualizar una tarea correctamente', async () => {
      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue({ id: '123', name: 'Updated Task' });

      const taskData = { name: 'Updated Task' };
      const updatedTask = await updateTask('123', taskData);

      expect(updatedTask).toHaveProperty('name', 'Updated Task');
      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith('123', taskData, { new: true });
    });

    it('debería lanzar un error si la tarea no se encuentra', async () => {
      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      const taskData = { name: 'Updated Task' };

      await expect(updateTask('123', taskData)).rejects.toThrow('Error to update task');
    });
  });

  describe('deleteTask', () => {
    it('debería eliminar una tarea correctamente', async () => {
      (Task.findByIdAndDelete as jest.Mock).mockResolvedValue({ id: '123', name: 'Deleted Task' });

      const deletedTask = await deleteTask('123');

      expect(deletedTask).toHaveProperty('name', 'Deleted Task');
      expect(Task.findByIdAndDelete).toHaveBeenCalledWith('123');
    });

    it('debería lanzar un error si la tarea no se encuentra', async () => {
      (Task.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await expect(deleteTask('123')).rejects.toThrow('Error to delete task');
    });
  });
});
