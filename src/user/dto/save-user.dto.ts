import { IsString, Matches } from 'class-validator';

export class SaveUserDto {
  @IsString()
  @Matches(/^\d{10}$/, {
    message: 'mobile_number must be a 10 digit number',
  })
  mobile_number: string;

  @IsString()
  @Matches(/[A-Za-z]/, {
    message: 'name must contain at least one alphabet letter',
  })
  name: string;
}
