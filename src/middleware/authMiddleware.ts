import { Request, Response, NextFunction } from "express";
import { TokenPayload } from "../jwt/tokenTypes";
import { verifyToken } from "../jwt/tokenService";
import { AppError } from "./errorHandler";

export const authMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const token = req.header("Authorization")?.replace("Bearer ","");
    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }
    try {
        const payload = verifyToken(token) as TokenPayload;
        req.body.user = payload;
        next();
    } catch (error) {
        next(new AppError("Unauthorized",401));
    }

};