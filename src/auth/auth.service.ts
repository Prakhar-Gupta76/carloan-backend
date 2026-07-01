import {
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  OTP_VERIFICATION_STATUS,
  RESPONSE_MESSAGES,
} from '../common/constants/response.constants';
import { ApiResponseHelper } from '../common/helpers/api-response.helper';
import { AxiosHelper } from '../common/helpers/axios.helper';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Otp } from './schemas/otp.schema';
import { GenerateOtpResponse } from './types/generate-otp-response.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly axiosHelper: AxiosHelper,
    @InjectModel(Otp.name) private readonly otpModel: Model<Otp>,
  ) { }

  async generateOTP(generateOtpDto: GenerateOtpDto) {
    const verificationUrl = process.env.VERIFICATION_URL;

    const response = await this.axiosHelper.post<GenerateOtpResponse>(
      `${verificationUrl?.replace(/\/$/, '')}/api/v1/generateOTP`,
      {
        mobile_number: generateOtpDto.mobile_number,
      },
    );

    if (response.error || typeof response.otp !== 'number') {
      throw new InternalServerErrorException(
        ApiResponseHelper.error(
          RESPONSE_MESSAGES.OTP_GENERATED_FAILED,
          response.error ?? response,
        ),
      );
    }

    await this.otpModel.create({
      mobile_number: generateOtpDto.mobile_number,
      otp: response.otp,
      created_at: new Date(),
    });

    return ApiResponseHelper.ok(RESPONSE_MESSAGES.OTP_GENERATED_SUCCESSFULLY, [
      { otp: response.otp },
    ]);
  }

  async verifyOTP(verifyOtpDto: VerifyOtpDto) {
    const latestOtpRecord = await this.otpModel
      .findOne({ mobile_number: verifyOtpDto.mobile_number })
      .sort({ created_at: -1 })
      .exec();

    const isValidOtp = latestOtpRecord?.otp === verifyOtpDto.otp;

    return ApiResponseHelper.ok(
      isValidOtp ? RESPONSE_MESSAGES.VALID_OTP : RESPONSE_MESSAGES.INVALID_OTP,
      [{
        status: isValidOtp
          ? OTP_VERIFICATION_STATUS.VALID
          : OTP_VERIFICATION_STATUS.INVALID,
      }],
    );
  }
}
