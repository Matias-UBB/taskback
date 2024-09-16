import mongoose, {Document, Schema} from "mongoose";


export interface ITasks extends Document{
    name: string;
    description: string;
    project: mongoose.Schema.Types.ObjectId;
    date: Date;
    status: string;
};

const taskSchema = new Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    project:{type:mongoose.Types.ObjectId, ref:'Project',required:true},
    date:{type:Date,default:Date.now(),required:true},
    status:{type:String,default:"active",enum:["pending","inprogress", "completed","canceled","active"]},

});

const updateTaskCount = async function (doc: any) {
    if (doc) {
        await mongoose.model("Project").updateOne({ _id: doc.project }, { $inc: { tasks: -1 } });
    }
};




//despues de guardar una tarea, se actualiza el numero de tareas en el proyecto
taskSchema.post("save", async function () {
    await this.model("Project").updateOne({ _id: this.project }, { $inc: { tasks: 1 } });
});

// Aplicar el middleware a los métodos relevantes
taskSchema.post("findOneAndDelete", updateTaskCount);
taskSchema.post("deleteOne", updateTaskCount);
taskSchema.post("deleteMany", async function (docs) {
    if (docs.deletedCount) {
        await mongoose.model("Project").updateOne({ _id: docs[0]?.project }, { $inc: { tasks: -docs.deletedCount } });
    }
});


export const Task = mongoose.model<ITasks>("Task",taskSchema);
