import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleLoginDto } from './dto/google-login.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) // trả về res header cho client nhưng vẫn trả về body
    response: Response,
  ) {
    const result = await this.authService.login(dto);
    //tạo 1 cookie tên refresh rồi gán giá trị result.refreshToken vào cookie đó
    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true, //Không cho javascript front đọc cookie này

      secure: process.env.NODE_ENV === 'production',

      sameSite: 'lax', // tránh cross-site

      maxAge: 7 * 24 * 60 * 60 * 1000, //time cookie
    });

    return {
      message: result.message,
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userId = (request.user as { id: string }).id;

    const refreshToken = request.cookies?.refreshToken as string | undefined;

    const result = await this.authService.logout(userId, refreshToken);

    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return result;
  }

  @Post('refresh')
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies?.refreshToken;

    return this.authService.refreshToken(refreshToken);
  }

  @Post('google')
  async googleLogin(
    @Body()
    dto: GoogleLoginDto,

    @Res({
      passthrough: true,
    })
    response: Response,
  ) {
    const result = await this.authService.googleLogin(dto.credential);

    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,

      secure: process.env.NODE_ENV === 'production',

      sameSite: 'lax',

      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: result.message,

      accessToken: result.accessToken,

      user: result.user,
    };
  }
}
