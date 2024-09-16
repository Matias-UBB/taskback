import { NextFunction, Request, Response } from "express";
import * as taskService from "../service/taskService";
import { plainToClass } from "class-transformer";
import { CreateTaskDto, UpdateTaskDto } from "../dto/taskDto";
import { validate } from "class-validator";
import * as projectService from "../service/projectService";



const createTask = async (req: Request, res : Response, next:NextFunction):Promise<void>=>{
    const createTaskDto = plainToClass(CreateTaskDto,req.body);
    const errors = await validate(createTaskDto);
    if (errors.length > 0) {
        res.status(400).json(errors);
        return;
    }

    try {
        const task = await taskService.createTask(createTaskDto);

        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};

const getOneTask = async (req: Request, res : Response, next:NextFunction):Promise<void>=>{
    try {
        const task = await taskService.findTaskById(req.params.id);
        if(!task){
            res.status(404).json({message:"Task not found"});
            return
        }
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};

const getTasksByProject = async (req: Request, res : Response, next:NextFunction):Promise<void>=>{
    try {
        const tasks = await taskService.findTaskForProject(req.params.project);
        if(!tasks){
            res.status(404).json({message:"Tasks not found"});
            return
        }
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
};


const updateTask = async (req: Request, res : Response, next:NextFunction):Promise<void>=>{
    const updateTaskDto = plainToClass(UpdateTaskDto, req.body);
    try {
        const task = await taskService.updateTask(req.params.id,updateTaskDto);
        if(!task){
            res.status(404).json({message:"Task not found"});
            return
        }
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};


const deleteTask = async (req: Request, res : Response, next:NextFunction):Promise<void>=>{
    try {
        const task = await taskService.deleteTask(req.params.id);
        if(!task){
            res.status(404).json({message:"Task not found"});
            return
        }
        res.status(200).json({});
    } catch (error) {
        next(error);
    }
};


export {
    createTask,
    getOneTask,
    getTasksByProject,
    updateTask,
    deleteTask
};

