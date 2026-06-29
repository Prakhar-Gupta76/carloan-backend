import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiResponseHelper } from '../common/helpers/api-response.helper';
import { GetUserDto } from './dto/get-user.dto';
import { SaveUserDto } from './dto/save-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  getUser(getUserDto: GetUserDto) {
    void getUserDto;
    void this.userModel;
    return ApiResponseHelper.ok('User fetched successfully.', [
      { is_new_user: true },
    ]);
  }

  saveUser(saveUserDto: SaveUserDto) {
    void saveUserDto;
    void this.userModel;
    return ApiResponseHelper.ok('User saved successfully.', []);
  }
}
