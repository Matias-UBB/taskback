import  { Request, Response, NextFunction } from "express";
import * as userService from "../service/authService";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { CreateUserDto, LoginUserDto } from "../dto/userDto";
import { AppError } from "../middleware/errorHandler";
import { generateAccesToken, verifyRefreshToken } from "../jwt/tokenService";



const register = async (req: Request, res : Response, next:NextFunction):Promise<void>=>{
    try {
        const userDto = plainToClass(CreateUserDto,req.body);
        const errors = await validate(userDto);
        if(errors.length>0){
            res.status(400).json({errors});
            return;
        }
        const newUser = await userService.createUser(userDto);
        res.status(201).json({message: "User created successfully", user: newUser});
    } catch (error) {
        next(error);

    }
};

const login = async (req: Request, res : Response, next: NextFunction):Promise<void>=>{
   

   
    try {
        const loginDto= plainToClass(LoginUserDto,req.body);
        const errors = await validate(loginDto);
        if(errors.length>0){
             res.status(400).json({errors});
             return;
        }

        const user = await userService.loginUser(loginDto);
        if(!user){
            res.status(401).json({message:"Invalid credentials"});
            return;
        }
        res.status(200).json({
            message:"Login successful",
            accessToken:user.accessToken,
            refreshToken:user.refreshToken,
            user:{email:user.email,name:user.name}
        });
    } catch (error) {
       return  next(error);
    }
};

const refreshToken = async (req: Request, res: Response, next: NextFunction):Promise<void>=>{
    const { refreshToken } = req.body;
    if(!refreshToken){
         return next(new AppError("Refresh token is required",400));
    };


    try {
        const payload= verifyRefreshToken(refreshToken);
        const newAccessToken = generateAccesToken({userId:payload.userId,email:payload.email});
        res.status(200).json({ accessToken: newAccessToken });
       
    } catch (error) {
        return next(new AppError("Invalid token",401));
    }
};

export {
    register,
    login,
    refreshToken
};

