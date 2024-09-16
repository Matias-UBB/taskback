import jwt , {JwtPayload} from 'jsonwebtoken';
import { TokenPayload } from './tokenTypes';


const generateToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRES_IN as string,
    });
};

const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
};

export { generateToken, verifyToken };
