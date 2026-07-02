import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class SaveUserDto {
  @IsString()
  @Matches(/^\d{10}$/, {
    message: 'mobile_number must be a 10 digit number',
  })
  mobile_number: string;

  @IsOptional()
  @IsString()
  @Matches(/[A-Za-z]/, {
    message: 'name must contain at least one alphabet letter',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{5}\d{4}[A-Z]$/, {
    message: 'pan must be like ABCDE1234F',
  })
  pan?: string;

  @IsOptional()
  @IsString()
  permanent_address?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salary?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(22)
  @Max(60)
  age?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(4)
  current_company_duration?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  loan_amount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  loan_tenure?: number;
}
