import { Request, Response, NextFunction } from "express";
import { TokenPayload } from "../jwt/tokenTypes";
import { verifyAccessToken } from "../jwt/tokenService";
import { AppError } from "./errorHandler";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    
    // Verifica si hay un token en los headers
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('Authorization token missing or malformed', 401));
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        // Verifica la validez del token
        const payload = verifyAccessToken(token) as TokenPayload;
        
        // Asigna la información del usuario al request
        req.body.user = payload;

        // Continúa hacia la siguiente función del middleware o ruta
        next();

    } catch (error) {
        if (error instanceof Error) {
            // Verificamos si es un error de expiración del token
            if (error.name === 'TokenExpiredError') {
                return next(new AppError('Access token expired. Please refresh your token.', 401));
            }
            // Si no es un error de expiración, manejamos otro tipo de error
            return next(new AppError('Token verification failed', 401));
        }

        // En caso de que el error no sea de tipo Error (caso muy raro), devolvemos un error genérico
        return next(new AppError('An unknown error occurred during token verification', 500));
    }
};