import { createProject, findProjectById, findProjectByUser, updateProject, deleteProject } from '../service/projectService';
import { Project } from '../models/projectModel';
import { AppError } from '../middleware/errorHandler';

jest.mock('../models/projectModel');

describe('ProjectService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProject', () => {
    it('debería crear un proyecto correctamente', async () => {
        // Simulamos el comportamiento del método save del modelo Project.
        (Project.prototype.save as jest.Mock).mockResolvedValue({
            id: '123',
            name: 'Test Project',
            user: 'user1',
        });

        // Datos de entrada para la prueba, incluyendo el userId.
        const projectData = { name: 'Test Project', description: 'Test Description' };
        const userId = 'user1';

        // Llamamos a la función createProject con el projectData y userId.
        const newProject = await createProject(projectData, userId);

        // Verificamos que el nuevo proyecto tenga la propiedad name con el valor 'Test Project'.
        expect(newProject).toHaveProperty('name', 'Test Project');
        // Verificamos que se haya llamado al método save del modelo Project.
        expect(Project.prototype.save).toHaveBeenCalled();
    });
});


  describe('findProjectById', () => {
    it('debería encontrar un proyecto por ID', async () => {
      (Project.findById as jest.Mock).mockResolvedValue({ id: '123', name: 'Test Project' });

      const project = await findProjectById('123');

      expect(project).toHaveProperty('id', '123');
      expect(Project.findById).toHaveBeenCalledWith('123');
    });

    it('debería lanzar un error si el proyecto no se encuentra', async () => {
      (Project.findById as jest.Mock).mockResolvedValue(null);

      await expect(findProjectById('123')).rejects.toThrow('Project not found');
    });
  });

  describe('findProjectByUser', () => {
    it('debería encontrar proyectos por usuario', async () => {
      (Project.find as jest.Mock).mockResolvedValue([{ id: '123', name: 'Test Project', user: 'user1' }]);

      const projects = await findProjectByUser('user1');

      expect(projects).toHaveLength(1);
      expect(Project.find).toHaveBeenCalledWith({ user: 'user1' });
    });
  });

  describe('updateProject', () => {
    it('debería actualizar un proyecto correctamente', async () => {
      (Project.findByIdAndUpdate as jest.Mock).mockResolvedValue({ id: '123', name: 'Updated Project' });

      const projectData = { name: 'Updated Project' };
      const updatedProject = await updateProject('123', projectData);

      expect(updatedProject).toHaveProperty('name', 'Updated Project');
      expect(Project.findByIdAndUpdate).toHaveBeenCalledWith('123', projectData, { new: true });
    });

    it('debería lanzar un error si el proyecto no se encuentra', async () => {
      (Project.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      const projectData = { name: 'Updated Project' };

      await expect(updateProject('123', projectData)).rejects.toThrow('Error to update project');
    });
  });

  describe('deleteProject', () => {
    it('debería eliminar un proyecto correctamente', async () => {
      (Project.findByIdAndDelete as jest.Mock).mockResolvedValue({ id: '123', name: 'Deleted Project' });

      const deletedProject = await deleteProject('123');

      expect(deletedProject).toHaveProperty('name', 'Deleted Project');
      expect(Project.findByIdAndDelete).toHaveBeenCalledWith('123');
    });

    it('debería lanzar un error si el proyecto no se encuentra', async () => {
      (Project.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await expect(deleteProject('123')).rejects.toThrow('Error to delete project');
    });
  });
});
