import {
    IsBoolean,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class CreateTopicDto {
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @IsString()
    @IsOptional()
    description?: string;
  
    @IsMongoId()
    courseId: string;
  
    @IsNumber()
    @IsOptional()
    order?: number;
  
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
  }