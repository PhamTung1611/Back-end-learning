import {
    IsArray,
    IsMongoId,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class UpdateRoleDto {
    @IsString()
    @IsOptional()
    name?: string;
  
    @IsString()
    @IsOptional()
    description?: string;
  
    @IsArray()
    @IsMongoId({ each: true })
    @IsOptional()
    permissions?: string[];
  }