import {
    IsNotEmpty,
    IsString,
  } from 'class-validator';
  
  export class GoogleLoginDto {
    @IsString()
    @IsNotEmpty()
    credential: string;//google bắn về 1 cái credential, mình sẽ dùng credential này để verify với google
  }