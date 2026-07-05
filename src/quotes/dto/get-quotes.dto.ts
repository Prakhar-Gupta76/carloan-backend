import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class GetQuotesDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  loan_amount: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  loan_tenure: number;
}
