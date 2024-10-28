import { Injectable, UnauthorizedException } from "@nestjs/common";
import { compare } from "bcrypt";
import { UsersService } from "src/users/users.service";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { UpdatePasswordDto } from "./dto/update-password.dto";

@Injectable()
export class AuthService {
  async updatePassword(userId: string, passwordDto: UpdatePasswordDto) {
    const { password } = passwordDto;
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException("Usuario inexistente o inválido");
    }
    await this.usersService.updatePassword(userId, password);
  }
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.usersService.findByUsername(username);
    if (
      !user ||
      !(await this.validateUserCredentials(password, user.password))
    ) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const payload = { username: user.username, sub: user.id };
    const token = await this.jwtService.signAsync(payload);

    const returnUser = user.toObject();
    delete returnUser.password;
    return {
      access_token: token,
      ...returnUser,
    };
  }

  async getProfileData(userId: string) {
    const user = await this.usersService.findById(userId);
    const returnUser = user.toObject();
    delete returnUser.password;
    return returnUser;
  }

  private async validateUserCredentials(
    enteredPassword: string,
    hashedPassword: string,
  ) {
    return await compare(enteredPassword, hashedPassword);
  }
}
