import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async create(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { access_token, ...userInfo } =
      await this.authService.login(loginDto);
    return res.set('Authorization', `Bearer ${access_token}`).send(userInfo);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getProfileData(@Req() req) {
    return await this.authService.getProfileData(req.user.sub);
  }
}
