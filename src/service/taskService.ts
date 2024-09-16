import { CreateTaskDto, UpdateTaskDto } from "../dto/taskDto";
import { Task, ITasks } from "../models/taskModel";
import { AppError } from "../middleware/errorHandler";





const createTask =async (taskData:CreateTaskDto):Promise<ITasks>=>{
    const task = new Task(taskData);
    const taskExists = await Task.findOne({
        name:taskData.name
    });
    if(taskExists){
        throw new AppError("Task already exists",400);
    }
    const taskSaved = await task.save();

    if(!taskSaved){
        throw new AppError("Task not saved",500);
    }
    return taskSaved;
};

const findTaskById = async (id:string):Promise<ITasks|null>=>{
    const task = await Task.findById(id);
    if(!task){
        throw new AppError("Task not found",404);
    }
    return task;
};

const findTaskForProject = async (project : string): Promise<ITasks[]|null>=>{
    const tasks = await Task.find({
        project
    });
    if(!tasks){
        throw new AppError("Tasks not found",404);
    }
    return tasks;
    
};

const updateTask = async (id:string,taskData:UpdateTaskDto):Promise<ITasks|null>=>{
    const taskUpdated = await Task.findByIdAndUpdate
    (id,taskData,{new:true});
    if(!taskUpdated){
        throw new AppError("Error to update task",404);
    }
    return taskUpdated;

};

const deleteTask = async (id:string):Promise<ITasks|null>=>{
    const task = await Task.findByIdAndDelete(id);
    if(!task){
        throw new AppError("Error to delete task",404);
    }
    return task;
};

const totalTask = async (projectId: string): Promise<number> => {
    return await Task.find({ project: projectId }).countDocuments();
};

export  {
    createTask,
    findTaskById,
    findTaskForProject,
    updateTask,
    deleteTask,
    totalTask
};