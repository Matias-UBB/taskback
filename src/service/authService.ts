import { CreateUserDto, LoginUserDto } from "../dto/userDto";
import {User,IUser} from "../models/userModel";
import { AppError } from "../middleware/errorHandler";
import { generateAccesToken, generateRefreshToken } from "../jwt/tokenService";
import { TokenPayload } from "../jwt/tokenTypes";

const createUser = async (userData: CreateUserDto) : Promise<IUser>=>{
    const userExists= await User.findOne({email:userData.email});
    if(userExists){
        throw new AppError("User already exists",400);
    }
    const user = new User(userData);
    const userSaved = await user.save();
    if(!userSaved){
        throw new AppError("User not saved",500);
    }
    return userSaved;
};

const findUserByEmail = async (email: string): Promise<IUser | null> =>{
    const user = await User.findOne({email});
    if(!user){
        throw new AppError("User not found",404);
    }
    return user;
};
const findUserById = async (id:string):Promise<IUser|null>=>{
    const user= await User.findById(id);
    if(!user){
        throw new AppError("User not found",404);
    }
    return user;
};

const loginUser = async (loginData: LoginUserDto): Promise<{refreshToken:String, accessToken:String , email:string , name:string} | null> =>{
    const user = await User .findOne({email:loginData.email});
    if(!user){
        throw new AppError("Invalid credentials",404);
    }
    const isMatch = await user.matchPassword(loginData.password);
    if(!isMatch){
        throw new AppError("Invalid credentials",401);
    }

   const accessToken = generateAccesToken({email:user.email,userId:user.id});
   const refreshToken = generateRefreshToken({email:user.email,userId:user.id})
  return {accessToken, refreshToken , email:user.email, name:user.name};

};

export{
    createUser,
    findUserByEmail,
    findUserById,
    loginUser
};