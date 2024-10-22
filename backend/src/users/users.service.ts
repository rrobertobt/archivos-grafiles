import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Model } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async updatePassword(userId: string, password: string) {
    const user = await this.findById(userId);
    if (!user) {
      return null;
    }
    const encryptedPassword = await this.encryptPassword(password);
    console.log('encryptedPassword', encryptedPassword);
    await this.userModel.findByIdAndUpdate(userId, {
      password: encryptedPassword,
    })
  }

  async findByUsername(username: string) {
    return await this.userModel.findOne({
      username,
    });
  }

  async findById(id: string) {
    return await this.userModel.findById(id);
  }

  private async encryptPassword(password: string) {
    return await hash(password, 10);
  }
}
