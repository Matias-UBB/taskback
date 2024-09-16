import mongoose, {Document,Schema} from "mongoose";


export interface IProject extends Document {
    name : string;
    description : string;
    user : mongoose.Schema.Types.ObjectId;
    date : Date;
    status : string;
    tasks : Number;
};

const projectSchema = new Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    user:{type:mongoose.Schema.Types.ObjectId, required:true},
    date:{type:Date, default:Date.now()},
    status:{type:String,default:"active",enum:["active","finished","canceled"]},
    tasks:{type:Number,default:0}
});

export const Project = mongoose.model<IProject>("Project",projectSchema);