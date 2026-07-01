import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { GetUserDto } from './dto/get-user.dto';
import { SaveUserDto } from './dto/save-user.dto';
import { UserService } from './user.service';

@Controller('api/v1')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('user')
  getUser(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    getUserDto: GetUserDto,
  ) {
    return this.userService.getUser(getUserDto);
  }

  @Post('saveUser')
  saveUser(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    saveUserDto: SaveUserDto,
  ) {
    return this.userService.saveUser(saveUserDto);
  }
}
