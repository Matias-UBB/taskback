import { Request, Response, NextFunction } from "express";
import * as projectService from "../service/projectService";
import { plainToClass } from "class-transformer";
import { CreateProjectDto, UpdateProjectDto } from "../dto/projectDto";
import { validate } from "class-validator";



const createProject = async (req: Request, res : Response, next: NextFunction):Promise<void>=>{
    try {
        const dto = plainToClass(CreateProjectDto, req.body);
        const project = await projectService.createProject(dto, req.body.user.userId);
        res.status(201).json(project);
        return;
    } catch (error) {
        next(error);
    }
};


const getOneProject = async (req: Request, res : Response, next: NextFunction):Promise<void>=>{
    try {
        const project = await projectService.findProjectById(req.params.id);
        if(!project){
            res.status(404).json({message:"Project not found"});
            return;
        }
        res.status(200).json(project);
        return;
    } catch (error) {
        next(error);
    }
};

const getProjectsByUser = async (req: Request, res : Response, next:NextFunction):Promise<void>=>{
    try {

        const projects = await projectService.findProjectByUser(req.body.user.userId);
        if(!projects){
            res.status(404).json({message:"Projects not found"});
            return
        }
        res.status(200).json(projects);
        return;
    } catch (error) {
        next(error);
    }
};

const updateProject = async (req: Request, res : Response, next:NextFunction):Promise<void>=>{
   
    try {
        const dto = plainToClass(UpdateProjectDto,req.body);
        const project = await projectService.updateProject(req.params.id,dto);
        if(!project){
            res.status(404).json({message:"Project not found"});
            return
        }
        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
};

const deleteProject = async (req: Request, res : Response, next:NextFunction):Promise<void>=>{
    try {

        //validate user
        const project = await projectService.deleteProject(req.params.id, req.body.user.userId);
        if(!project){
            res.status(404).json({message:"Project not found"});
            return
        }
        res.status(200).json({});
    } catch (error) {
        next(error);
    }
};

export {
    createProject,
    getOneProject,
    getProjectsByUser,
    updateProject,
    deleteProject
};


