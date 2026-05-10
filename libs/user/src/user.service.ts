import { AppEnvService } from '@app/app-env/app-env.service';
import { RedlockService } from '@app/redlock/redlock.service';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from './user.meta';
import { UserDocument } from './user.schema';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectModel(UserDocument.name) private userModel: Model<UserDocument>,
    private readonly appEnvService: AppEnvService,
    private readonly redlockService: RedlockService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.redlockService.using('check-default-user', 10_000, async () => {
      await this.createDefaultUser();
      console.log('Successfully checked/created default system user.');
    });
  }

  private getValueFromConfig(key: string, min: number, max: number) {
    let value = this.appEnvService.get<string>(key);
    if (typeof value !== 'string') {
      throw new Error(`${key} must be a string`);
    }

    value = value.trim();
    if (value.length < min) {
      throw new Error(`${key} must be at least ${min} characters long`);
    }

    if (value.length > max) {
      throw new Error(`${key} must be at most ${max} characters long`);
    }

    return value;
  }

  private async createDefaultUser(): Promise<UserDocument | null> {
    const DEFAULT_USERNAME = this.getValueFromConfig(
      'USER_USERNAME_DEFAULT',
      USERNAME_MIN_LENGTH,
      USERNAME_MAX_LENGTH,
    );
    const DEFAULT_PASSWORD = this.getValueFromConfig(
      'USER_PASSWORD_DEFAULT',
      PASSWORD_MIN_LENGTH,
      PASSWORD_MAX_LENGTH,
    );

    const existingUser = await this.findOne(DEFAULT_USERNAME);

    if (existingUser) {
      return existingUser;
    }

    return this.create({
      username: DEFAULT_USERNAME,
      password: DEFAULT_PASSWORD,
    });
  }

  async findOne(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async create(userData: {
    username: string;
    password: string;
  }): Promise<UserDocument> {
    const { username, password } = userData;

    if (username.length < USERNAME_MIN_LENGTH) {
      throw new BadRequestException(
        `Username must be at least ${USERNAME_MIN_LENGTH} characters long`,
      );
    }
    if (username.length > USERNAME_MAX_LENGTH) {
      throw new BadRequestException(
        `Username must be at most ${USERNAME_MAX_LENGTH} characters long`,
      );
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      throw new BadRequestException(
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`,
      );
    }
    if (password.length > 255) {
      throw new BadRequestException(
        `Password must be at most 255 characters long`,
      );
    }

    // TODO: hash the password

    const newUser = new this.userModel(userData);
    return newUser.save();
  }
}
