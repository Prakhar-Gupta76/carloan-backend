import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  RESPONSE_MESSAGES,
  RESPONSE_STATUS,
} from '../common/constants/response.constants';
import { ApiResponseHelper } from '../common/helpers/api-response.helper';
import { AxiosHelper } from '../common/helpers/axios.helper';
import { GetQuotesDto } from './dto/get-quotes.dto';
import { QuotesApiResponse } from './types/quotes-api-response.type';

@Injectable()
export class QuotesService {
  constructor(private readonly axiosHelper: AxiosHelper) { }

  async getQuotes(getQuotesDto: GetQuotesDto) {
    const quotesApi = process.env.QUOTES_URL;

    const response = await this.axiosHelper.post<QuotesApiResponse>(
      `${quotesApi?.replace(/\/$/, '')}/api/v1/getQuotes`,
      {
        loan_amount: getQuotesDto.loan_amount,
        loan_tenure: getQuotesDto.loan_tenure * 12,
      },
    );

    if (
      response.status === RESPONSE_STATUS.ERROR ||
      !Array.isArray(response.data)
    ) {
      throw new InternalServerErrorException(response.error);
    }

    const quotesWithEmi = response.data.map((quote) => ({
      bank: quote.bank,
      interest_rate: quote.interest_rate,
      monthly_emi: this.calculateMonthlyEmi(
        getQuotesDto.loan_amount,
        quote.interest_rate,
        getQuotesDto.loan_tenure,
      ),
    }));

    return ApiResponseHelper.ok(
      RESPONSE_MESSAGES.BANK_LOAN_DETAILS_FETCHED_SUCCESSFULLY,
      quotesWithEmi,
    );
  }

  private calculateMonthlyEmi(
    loanAmount: number,
    annualInterestRate: number,
    loanTenure: number,
  ) {
    const monthlyInterestRate = annualInterestRate / 12 / 100;
    const tenureInMonths = loanTenure * 12;

    const multiplier = Math.pow(1 + monthlyInterestRate, tenureInMonths);
    const monthlyEmi =
      (loanAmount * monthlyInterestRate * multiplier) / (multiplier - 1);

    return Number(monthlyEmi.toFixed(2));
  }
}
