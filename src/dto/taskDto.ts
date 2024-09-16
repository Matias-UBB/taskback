
import { IsOptional, IsString, IsEnum, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsString()
    description!: string;

    @IsNotEmpty()
    @IsMongoId()
    project!: typeof import("mongoose").Schema.Types.ObjectId;

    @IsEnum(["pending","inprogress", "completed","canceled","active"])
    status!: string;
    
}



export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(["pending", "inprogress", "completed", "canceled"])
    status?: string;
}