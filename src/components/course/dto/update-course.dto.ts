import {
    IsBoolean,
    IsMongoId,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class UpdateCourseDto {
    @IsString()
    @IsOptional()
    title?: string;
  
    @IsString()
    @IsOptional()
    description?: string;
  
    @IsMongoId()
    @IsOptional()
    languageId?: string;
  
    @IsString()
    @IsOptional()
    level?: string;
  
    @IsString()
    @IsOptional()
    thumbnail?: string;
  
    @IsNumber()
    @IsOptional()
    order?: number;
  
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
  }