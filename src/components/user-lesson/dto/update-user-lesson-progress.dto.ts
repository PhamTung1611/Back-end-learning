import {
    IsNumber,
    Max,
    Min,
  } from 'class-validator';
  
  export class UpdateUserLessonProgressDto {
    @IsNumber()
    @Min(0)
    @Max(100)
    progress: number;
  }