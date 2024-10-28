import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { hash } from "bcrypt";
import { Model } from "mongoose";
import { User } from "src/auth/entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { Archive } from "src/directories/entities/directory.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Archive.name) private archiveModel: Model<Archive>,
  ) {}

  async getEmployee(adminId: string, userId: string) {
    const admin = this.userModel.findOne({
      _id: adminId,
      role: "admin",
    });
    if (!admin) throw new UnauthorizedException("Usuario no autorizado");

    const user = await this.userModel.findById(userId).select("-password");
    if (!user) throw new BadRequestException("Usuario no encontrado");

    return user;
  }

  async getAllEmployees(adminId: string) {
    const admin = this.userModel.findOne({
      _id: adminId,
      role: "admin",
    });
    if (!admin) throw new UnauthorizedException("Usuario no autorizado");

    return await this.userModel.find({ role: "employee" }).select("-password");
  }

  async createAsAdmin(adminId: string, createUserDto: CreateUserDto) {
    const admin = this.userModel.findOne({
      _id: adminId,
      role: "admin",
    });
    if (!admin) throw new UnauthorizedException("Usuario no autorizado");

    const checkAlreadyExists = await this.userModel.findOne({
      username: createUserDto.username,
    });
    if (checkAlreadyExists) {
      throw new BadRequestException("El nombre de usuario ya está en uso");
    }

    const encryptedPassword = await this.encryptPassword(
      createUserDto.password,
    );

    const newUser = await this.userModel.create({
      ...createUserDto,
      password: encryptedPassword,
    });

    const userRootDirectory = await this.archiveModel.create({
      name: "Raíz",
      type: "directory",
      parent_directory: null,
      path: "/root",
      owner: newUser._id,
      in_trash: false,
    });

    const userSharedDirectory = await this.archiveModel.create({
      name: "Compartido",
      type: "directory",
      parent_directory: null,
      path: "/shared",
      owner: newUser._id,
      in_trash: false,
      shared: true,
    });

    await newUser.updateOne({ root_directory: userRootDirectory._id });
    await newUser.updateOne({ shared_directory: userSharedDirectory._id });

    return await this.userModel.findById(newUser._id).select("-password");
  }

  async updatePassword(userId: string, password: string) {
    const user = await this.findById(userId);
    if (!user) {
      return null;
    }
    const encryptedPassword = await this.encryptPassword(password);
    await this.userModel.findByIdAndUpdate(userId, {
      password: encryptedPassword,
    });
  }

  async findByUsername(username: string) {
    return await this.userModel
      .findOne({
        username,
      })
      .populate(["shared_directory", "root_directory"]);
  }

  async findById(id: string) {
    return await this.userModel.findById(id).populate("shared_directory");
  }

  private async encryptPassword(password: string) {
    return await hash(password, 10);
  }
}
