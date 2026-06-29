import { Injectable } from '@nestjs/common';
import { ApiResponseHelper } from '../common/helpers/api-response.helper';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  generateOTP(generateOtpDto: GenerateOtpDto) {
    return ApiResponseHelper.ok('OTP generated successfully.', []);
  }

  verifyOTP(verifyOtpDto: VerifyOtpDto) {
    return ApiResponseHelper.ok('OTP verified successfully.', [
      { status: 'verified' },
    ]);
  }
}
