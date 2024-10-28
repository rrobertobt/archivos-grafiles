import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Post()
  createAsAdmin(@Req() req, @Body() createUserDto: CreateUserDto) {
    return this.usersService.createAsAdmin(req.user.sub, createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get("employees")
  getAllEmployees(@Req() req) {
    return this.usersService.getAllEmployees(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get("employees/:id")
  getEmployee(@Req() req, @Param("id") id: string) {
    return this.usersService.getEmployee(req.user.sub, id);
  }
}
