import {
    IsBoolean,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class CreateWordDto {
    @IsString()
    @IsNotEmpty()
    term: string;
  
    @IsString()
    @IsNotEmpty()
    meaning: string;
  
    @IsString()
    @IsOptional()
    pronunciation?: string;
  
    @IsString()
    @IsOptional()
    pronunciationType?: string;
  
    @IsString()
    @IsOptional()
    partOfSpeech?: string;
  
    @IsString()
    @IsOptional()
    example?: string;
  
    @IsString()
    @IsOptional()
    exampleMeaning?: string;
  
    @IsString()
    @IsOptional()
    audioUrl?: string;
  
    @IsString()
    @IsOptional()
    imageUrl?: string;
  
    @IsMongoId()
    lessonId: string;
  
    @IsNumber()
    @IsOptional()
    order?: number;
  
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
  }