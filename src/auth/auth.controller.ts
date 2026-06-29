import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('api/v1')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('generateOTP')
  generateOTP(@Body() generateOtpDto: GenerateOtpDto) {
    return this.authService.generateOTP(generateOtpDto);
  }

  @Get('verifyOTP')
  verifyOTP(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOTP(verifyOtpDto);
  }
}
