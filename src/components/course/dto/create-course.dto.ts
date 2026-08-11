import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @IsString()
    @IsOptional()
    description?: string;
  
    @IsString()
    @IsNotEmpty()
    languageCode: string;
  
    @IsString()
    @IsNotEmpty()
    level: string;
  
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