import {
    IsBoolean,
    IsMongoId,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class UpdateWordDto {
    @IsString()
    @IsOptional()
    term?: string;
  
    @IsString()
    @IsOptional()
    meaning?: string;
  
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
    @IsOptional()
    lessonId: string;
  
    @IsNumber()
    @IsOptional()
    order?: number;
  
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
  }