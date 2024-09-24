import { CreateProjectDto, UpdateProjectDto } from "../dto/projectDto";
import {Project , IProject} from "../models/projectModel";
import { AppError } from "../middleware/errorHandler";



const createProject = async (projectData: CreateProjectDto , userId: string ): Promise<IProject> =>{
    const project = new Project({...projectData,user:userId});
    const projectSaved = await project.save();
    if(!projectSaved){
        throw new AppError("Project not saved",500);
    }

    return projectSaved;
};

const findProjectById = async (id : string ): Promise<IProject|null> =>{
    const project = await Project.findById(id);
    if(!project){
        throw new AppError("Project not found",404);
    }
    return project;
};


const findProjectByUser = async (user: String): Promise <IProject[]|null>=> {
    const projects = await Project.find({
        user
    });
    if(!projects){
        throw new AppError("Projects not found",404);
    }
    return projects;
};

const updateProject = async (id: string, projectData: UpdateProjectDto):Promise<IProject|null>=>{
    const project = await Project.findByIdAndUpdate(id,projectData,{new:true});
    if(!project){
        throw new AppError("Error to update project",404);
    }
    return project;
};

const deleteProject = async (id: string, userId:string): Promise<IProject|null>=>{

    const project = await Project.findByIdAndDelete(id);
    if(!project){
        throw new AppError("Error to delete project",404);
    }

    if(project.user.toString() !== userId){
        throw new AppError("You are not allowed to delete this project",401);
    }
    return project;
};

export {
    createProject,
    findProjectById,
    findProjectByUser,
    updateProject,
    deleteProject
};
