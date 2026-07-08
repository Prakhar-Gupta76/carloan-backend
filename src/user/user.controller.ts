import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { GetUserDto } from './dto/get-user.dto';
import { SaveDrivingLicenseDto } from './dto/save-driving-license.dto';
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

  @Post('saveDrivingLicense')
  @UseInterceptors(
    FileInterceptor('driving_license_file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  saveDrivingLicense(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    saveDrivingLicenseDto: SaveDrivingLicenseDto,
    @UploadedFile() drivingLicenseFile?: Express.Multer.File,
  ) {
    return this.userService.saveDrivingLicense(
      saveDrivingLicenseDto,
      drivingLicenseFile,
    );
  }
}
