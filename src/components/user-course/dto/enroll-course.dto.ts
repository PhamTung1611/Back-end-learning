import {
    IsMongoId,
  } from 'class-validator';
  
  export class EnrollCourseDto {
    @IsMongoId()
    courseId: string;
  }