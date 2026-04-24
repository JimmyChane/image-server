import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PASSWORD_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from './user.meta';
import { UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(UserDocument.name) private userModel: Model<UserDocument>) {}

  async findOne(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async create(userData: { username: string; password: string }): Promise<UserDocument> {
    const { username, password } = userData;

    if (username.length < USERNAME_MIN_LENGTH) {
      throw new BadRequestException(`Username must be at least ${USERNAME_MIN_LENGTH} characters long`);
    }
    if (username.length > USERNAME_MAX_LENGTH) {
      throw new BadRequestException(`Username must be at most ${USERNAME_MAX_LENGTH} characters long`);
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      throw new BadRequestException(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`);
    }
    if (password.length > 255) {
      throw new BadRequestException(`Password must be at most 255 characters long`);
    }

    // TODO: hash the password

    const newUser = new this.userModel(userData);
    return newUser.save();
  }
}
