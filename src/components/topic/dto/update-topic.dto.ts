import {
    IsBoolean,
    IsMongoId,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class UpdateTopicDto {
    @IsString()
    @IsOptional()
    title?: string;
  
    @IsString()
    @IsOptional()
    description?: string;
  
    @IsMongoId()
    @IsOptional()
    courseId?: string;
  
    @IsNumber()
    @IsOptional()
    order?: number;
  
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
  }