

import mongoose , {Document,Schema} from "mongoose";
import bcrypt from "bcryptjs";



export interface IUser extends Document {
    name : string;
    password : string;
    email : string;
    matchPassword: (candidatePassword:string)=>Promise<boolean>;

};

const userSchema = new Schema({
    name:{type:String,required:true},
    password:{type:String,required:true},
    email:{
        type:String,
        requiered: true,
        unique:true,
        match:[/.+\@.+\..+/ ,"Please enter a valid email"]
    },
});

userSchema.pre<IUser>("save", async function (next){
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password,salt);
    next();


});

userSchema.methods.matchPassword=async function(candidatePassword:string):Promise<boolean>{
    return await bcrypt.compare(candidatePassword,this.password);
}


export const User = mongoose.model<IUser>("User",userSchema);
