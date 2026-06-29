import { Type } from 'class-transformer';
import { IsInt, IsString, Matches, Max, Min } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @Matches(/^\d{10}$/, {
    message: 'mobile_number must be a 10 digit number',
  })
  mobile_number: string;

  @Type(() => Number)
  @IsInt()
  @Min(1000)
  @Max(9999)
  otp: number;
}
