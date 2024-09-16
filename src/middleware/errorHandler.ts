// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
    public statusCode: number;
    public status: string;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    console.log(err);
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};

