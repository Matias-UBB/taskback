import { Request, Response, NextFunction } from "express";
import * as userService from "../service/authService";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { CreateUserDto, LoginUserDto } from "../dto/userDto";
import { AppError } from "../middleware/errorHandler";



const register = async (req: Request, res : Response, next:NextFunction):Promise<void>=>{
    try {
        const userDto = plainToClass(CreateUserDto,req.body);
        const errors = await validate(userDto);
        if(errors.length>0){
            res.status(400).json({errors});
            return;
        }
        const newUser = await userService.createUser(userDto);
        res.status(201).json({});
    } catch (error) {
        next(error);

    }
};

const login = async (req: Request, res : Response, next: NextFunction):Promise<void>=>{
    const loginDto= plainToClass(LoginUserDto,req.body);
    const errors = await validate(loginDto);
    if(errors.length>0){
        res.status(400).json({errors});
        return;
    }

    console.log("login");
    try {
        const user = await userService.loginUser(loginDto);
        if(!user){
            res.status(401).json({message:"Invalid credentials"});
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export {
    register,
    login
};

