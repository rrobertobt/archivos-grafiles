import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Get,
  UseGuards,
  Put,
  Patch,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "./auth.guard";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async create(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { access_token, ...userInfo } =
      await this.authService.login(loginDto);
    return res.set("Authorization", `Bearer ${access_token}`).send(userInfo);
  }

  @UseGuards(AuthGuard)
  @Get("me")
  async getProfileData(@Req() req) {
    return await this.authService.getProfileData(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch("password")
  async updatePassword(@Req() req, @Body() passwordDto: UpdatePasswordDto) {
    return await this.authService.updatePassword(req.user.sub, passwordDto);
  }
}
