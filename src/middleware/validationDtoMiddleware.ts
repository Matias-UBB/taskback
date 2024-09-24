import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export const validationMiddleware = (dtoClass: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dto = plainToClass(dtoClass, req.body);
        const errors = await validate(dto);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }
        next();
    };
};