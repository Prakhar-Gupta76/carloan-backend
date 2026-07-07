import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosError } from 'axios';
import { Model } from 'mongoose';
import {
  RESPONSE_MESSAGES,
  RESPONSE_STATUS,
} from '../common/constants/response.constants';
import { ApiResponseHelper } from '../common/helpers/api-response.helper';
import { AxiosHelper } from '../common/helpers/axios.helper';
import { User } from '../user/schemas/user.schema';
import {
  INSPECTION_RESPONSE_STATUS,
  VERIFICATION_CONSENT,
  VERIFICATION_DATA_TYPES,
  VERIFICATION_ENDPOINTS,
  VERIFICATION_FAILURES,
} from './constants/verification.constants';
import { VerifyDetailsDto } from './dto/verify-details.dto';
import {
  AccountAggregatorResponseData,
  EpfoPfCredit,
  EpfoResponseData,
  InspectionApiResponse,
} from './types/inspection-api-response.type';

@Injectable()
export class VerificationService {
  constructor(
    private readonly axiosHelper: AxiosHelper,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) { }

  async verifyDetails(verifyDetailsDto: VerifyDetailsDto) {
    const user = await this.userModel
      .findOne({ mobile_number: verifyDetailsDto.mobile_number })
      .exec();

    if (!user?.pan) {
      return ApiResponseHelper.ok(
        RESPONSE_MESSAGES.CHECKS_FAILED,
        [VERIFICATION_FAILURES.DATA_NOT_FOUND],
      );
    }

    const dateRange = this.getSixMonthDateRange();

    const [
      salaryVerificationResponse,
      employmentCheckResponse,
      creditScoreResponse,
      existingEmiResponse,
    ] = await Promise.all([
      this.callInspectionApi(
        process.env.AA_URL,
        VERIFICATION_ENDPOINTS.SALARY_VERIFICATION,
        this.createConsentPayload(
          user.mobile_number,
          user.pan,
          [VERIFICATION_DATA_TYPES.BANK_STATEMENT],
          dateRange,
        ),
      ),
      this.callInspectionApi(
        process.env.EPFO_URL,
        VERIFICATION_ENDPOINTS.EMPLOYMENT_CHECK,
        this.createConsentPayload(
          user.mobile_number,
          user.pan,
          [VERIFICATION_DATA_TYPES.EMPLOYMENT_HISTORY],
          dateRange,
        ),
      ),
      this.callInspectionApi(
        process.env.CB_URL,
        VERIFICATION_ENDPOINTS.GET_CREDIT_SCORE,
        this.createConsentPayload(user.mobile_number, user.pan, [
          VERIFICATION_DATA_TYPES.CREDIT_SCORE,
        ]),
      ),
      this.callInspectionApi(
        process.env.CB_URL,
        VERIFICATION_ENDPOINTS.GET_EXISTING_EMI,
        this.createConsentPayload(user.mobile_number, user.pan, [
          VERIFICATION_DATA_TYPES.EXISTING_EMIS,
        ]),
      ),
    ]);

    const verificationResponses = [
      salaryVerificationResponse,
      employmentCheckResponse,
      creditScoreResponse,
      existingEmiResponse,
    ];

    await this.userModel
      .updateOne(
        { mobile_number: user.mobile_number },
        {
          $set: {
            account_aggregator_response: salaryVerificationResponse,
            epfo_response: employmentCheckResponse,
            credit_bureau_credit_score_response: creditScoreResponse,
            credit_bureau_existing_emis_response: existingEmiResponse,
          },
        },
      )
      .exec();

    const failedResponses = verificationResponses
      .filter((response) => response.status !== RESPONSE_STATUS.OK)
      .map((response) => response.status ?? RESPONSE_STATUS.ERROR);

    if (failedResponses.includes(INSPECTION_RESPONSE_STATUS.NOT_FOUND)) {
      return ApiResponseHelper.ok(
        RESPONSE_MESSAGES.CHECKS_FAILED,
        [VERIFICATION_FAILURES.DATA_NOT_FOUND],
      );
    }

    if (failedResponses.length > 0) {
      throw new InternalServerErrorException(failedResponses);
    }

    const lessSalaryThanProvided = this.isLessSalaryThanProvided(
      user.salary,
      salaryVerificationResponse.data as AccountAggregatorResponseData,
    );
    const employmentDurationFailed = this.isEmploymentDurationFailed(
      user.current_company_duration,
      employmentCheckResponse.data as EpfoResponseData,
    );

    const flagFailures = [
      ...(lessSalaryThanProvided
        ? [VERIFICATION_FAILURES.SALARY_INCORRECT]
        : []),
      ...(employmentDurationFailed
        ? [VERIFICATION_FAILURES.EMPLOYMENT_DURATION_FAILED]
        : []),
    ];

    if (flagFailures.length > 0) {
      return ApiResponseHelper.ok(RESPONSE_MESSAGES.CHECKS_FAILED, flagFailures);
    }

    return {
      status: RESPONSE_STATUS.OK,
      message: RESPONSE_MESSAGES.VERIFICATION_DETAILS_FETCHED_SUCCESSFULLY,
    };
  }

  private async callInspectionApi<T = unknown>(
    baseUrl: string | undefined,
    endpoint: string,
    payload: unknown,
  ): Promise<InspectionApiResponse<T>> {
    try {
      if (!baseUrl) {
        throw new InternalServerErrorException('Inspection URL is not configured');
      }

      return await this.axiosHelper.post<InspectionApiResponse<T>>(
        `${baseUrl.replace(/\/$/, '')}${endpoint}`,
        payload,
      );
    } catch (error) {
      const axiosError = error as AxiosError<InspectionApiResponse>;
      const errorResponse = axiosError.response?.data;

      return {
        status: errorResponse?.status ?? RESPONSE_STATUS.ERROR,
        message:
          errorResponse?.message ?? RESPONSE_MESSAGES.SOMETHING_WENT_WRONG,
        error: errorResponse?.error ?? error,
      };
    }
  }

  private createConsentPayload(
    mobileNumber: string,
    pan: string,
    dataTypes: string[],
    dataRange?: { from: string; to: string },
  ) {
    return {
      customer: {
        mobile_number: mobileNumber,
        pan,
      },
      consent: {
        purpose: VERIFICATION_CONSENT.PURPOSE,
        status: VERIFICATION_CONSENT.STATUS,
        data_types: dataTypes,
        ...(dataRange
          ? {
            data_range: dataRange,
            frequency: VERIFICATION_CONSENT.FREQUENCY,
          }
          : {}),
      },
    };
  }

  private getSixMonthDateRange() {
    const currentDate = new Date();
    const sixMonthStartDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 5,
      1,
    );

    return {
      from: this.formatDate(sixMonthStartDate),
      to: this.formatDate(currentDate),
    };
  }

  private formatDate(date: Date) {
    return date.toISOString().slice(0, 10);
  }

  private isLessSalaryThanProvided(
    providedSalary: number | undefined,
    accountAggregatorData: AccountAggregatorResponseData | undefined,
  ) {
    if (typeof providedSalary !== 'number') {
      return true;
    }

    const salaryTransactions =
      accountAggregatorData?.transactions
        ?.filter(
          (transaction) =>
            transaction.type?.toUpperCase() === 'CREDIT' &&
            transaction.description
              ?.toLowerCase()
              .startsWith('salary credited'),
        )
        .slice(0, 3) ?? [];

    if (salaryTransactions.length === 0) {
      return true;
    }

    return !salaryTransactions.some(
      (transaction) =>
        typeof transaction.amount === 'number' &&
        transaction.amount >= providedSalary,
    );
  }

  private isEmploymentDurationFailed(
    currentCompanyDuration: number | undefined,
    epfoData: EpfoResponseData | undefined,
  ) {
    if (typeof currentCompanyDuration !== 'number') {
      return true;
    }

    const pfCredits = epfoData?.pf_credits ?? [];
    const topDurationRecords = pfCredits.slice(0, currentCompanyDuration);
    const hasSameCompany = this.hasSameCompanyForDuration(
      topDurationRecords,
      currentCompanyDuration,
    );
    const hasConsecutiveTopSixMonths = this.hasConsecutiveMonths(pfCredits, 6);

    return !hasSameCompany || !hasConsecutiveTopSixMonths;
  }

  private hasSameCompanyForDuration(
    pfCredits: EpfoPfCredit[],
    currentCompanyDuration: number,
  ) {
    if (pfCredits.length < currentCompanyDuration) {
      return false;
    }

    const firstCompany = this.normalizeCompanyName(pfCredits[0]?.company);

    if (!firstCompany) {
      return false;
    }

    return pfCredits.every(
      (pfCredit) => this.normalizeCompanyName(pfCredit.company) === firstCompany,
    );
  }

  private hasConsecutiveMonths(pfCredits: EpfoPfCredit[], count: number) {
    const topRecords = pfCredits.slice(0, count);

    if (topRecords.length < count) {
      return false;
    }

    for (let index = 1; index < topRecords.length; index += 1) {
      const previousMonthIndex = this.getMonthIndex(topRecords[index - 1].date);
      const currentMonthIndex = this.getMonthIndex(topRecords[index].date);

      if (
        previousMonthIndex === null ||
        currentMonthIndex === null ||
        previousMonthIndex - currentMonthIndex !== 1
      ) {
        return false;
      }
    }

    return true;
  }

  private getMonthIndex(date?: string) {
    if (!date) {
      return null;
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return null;
    }

    return parsedDate.getFullYear() * 12 + parsedDate.getMonth();
  }

  private normalizeCompanyName(company?: string) {
    return company?.trim().toLowerCase() ?? '';
  }
}
