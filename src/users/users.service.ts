import { Model } from 'mongoose';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './user.models';
import { genSaltSync, hash } from 'bcryptjs';
import {
  USER_NOT_FOUND_ERROR,
  ALREADY_REGISTERED_ERROR,
} from './user.constants';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto) {
    const oldUser = await this.findUserEmail(createUserDto.email);
    if (oldUser) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }

    const salt = genSaltSync(10);
    const newUser = new this.userModel({
      name: createUserDto.name,
      email: createUserDto.email,
      password: await hash(createUserDto.password, salt),
    });
    return newUser.save();
  }

  findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return await this.userModel.findById(id).exec();
  }

  async findUserEmail(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const salt = genSaltSync(10);

    const existsUser = await this.userModel.findById(id).exec();

    if (existsUser) {
      const currentUser = await this.userModel.findByIdAndUpdate(
        id,
        {
          email: updateUserDto.email,
          name: updateUserDto.name,
          password: await hash(updateUserDto.password, salt),
        },
        {
          new: true,
        },
      );
      return currentUser;
    } else {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }
  }

  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndRemove(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }
    return deletedUser;
  }
}
