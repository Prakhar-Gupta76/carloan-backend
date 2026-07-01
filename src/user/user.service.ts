import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RESPONSE_MESSAGES } from '../common/constants/response.constants';
import { ApiResponseHelper } from '../common/helpers/api-response.helper';
import { GetUserDto } from './dto/get-user.dto';
import { SaveUserDto } from './dto/save-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }

  async getUser(getUserDto: GetUserDto) {
    const user = await this.userModel
      .findOne({ mobile_number: getUserDto.mobile_number })
      .exec();

    if (!user) {
      return ApiResponseHelper.ok(RESPONSE_MESSAGES.USER_NOT_FOUND, []);
    }

    return ApiResponseHelper.ok(
      RESPONSE_MESSAGES.USER_DETAILS_FETCHED_SUCCESSFULLY,
      [user],
    );
  }

  async saveUser(saveUserDto: SaveUserDto) {
    await this.userModel.create({
      mobile_number: saveUserDto.mobile_number,
      name: saveUserDto.name,
    });

    return ApiResponseHelper.ok(RESPONSE_MESSAGES.USER_RECORD_CREATED, []);
  }
}
