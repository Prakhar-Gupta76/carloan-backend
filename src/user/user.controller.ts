import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetUserDto } from './dto/get-user.dto';
import { SaveUserDto } from './dto/save-user.dto';
import { UserService } from './user.service';

@Controller('api/v1')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  getUser(@Body() getUserDto: GetUserDto) {
    return this.userService.getUser(getUserDto);
  }

  @Post('saveUser')
  saveUser(@Body() saveUserDto: SaveUserDto) {
    return this.userService.saveUser(saveUserDto);
  }
}
