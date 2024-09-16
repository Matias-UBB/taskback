import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';


export class CreateProjectDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

};

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsEnum(['active', 'finished', 'canceled'])
  status?: string;
}




