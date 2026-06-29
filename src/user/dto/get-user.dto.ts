import { IsString, Matches } from 'class-validator';

export class GetUserDto {
  @IsString()
  @Matches(/^\d{10}$/, {
    message: 'mobile_number must be a 10 digit number',
  })
  mobile_number: string;
}
