import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('api/v1')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('generateOTP')
  generateOTP(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    generateOtpDto: GenerateOtpDto,
  ) {
    return this.authService.generateOTP(generateOtpDto);
  }

  @Post('verifyOTP')
  verifyOTP(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    verifyOtpDto: VerifyOtpDto,
  ) {
    return this.authService.verifyOTP(verifyOtpDto);
  }
}
