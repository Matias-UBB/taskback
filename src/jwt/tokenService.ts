import jwt , {JwtPayload} from 'jsonwebtoken';
import { TokenPayload } from './tokenTypes';

// Generate a token
const generateAccesToken=(payload:TokenPayload):string=>{
    return jwt.sign(payload,process.env.JWT_SECRET as string,{
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION as string || '15m',
    })
};

const generateRefreshToken=(payload:TokenPayload):string=>{
    return jwt.sign(payload,process.env.JWT_REFRESH_SECRET as string,{
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION as string || '7d',
    })
};

// Verify a token
const verifyAccessToken=(token:string):JwtPayload=>{
    return jwt.verify(token,process.env.JWT_SECRET as string) as JwtPayload;
};

const verifyRefreshToken=(token:string):JwtPayload=>{
    return jwt.verify(token,process.env.JWT_REFRESH_SECRET as string) as JwtPayload;
};

export{
    generateAccesToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};


