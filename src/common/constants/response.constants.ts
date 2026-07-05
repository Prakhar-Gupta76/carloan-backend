export const RESPONSE_STATUS = {
  OK: 'ok',
  ERROR: 'error',
  INTERNAL_SERVER_ERROR: 'internal server error',
} as const;

export const RESPONSE_MESSAGES = {
  OTP_GENERATED_SUCCESSFULLY: 'OTP Generated Successfully',
  OTP_GENERATED_FAILED: 'OTP Generated Failed',
  OTP_VERIFIED_SUCCESSFULLY: 'OTP verified successfully.',
  VALID_OTP: 'Valid OTP',
  INVALID_OTP: 'Invalid OTP',
  VALIDATION_FAILED: 'Validation failed',
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try later',
  USER_NOT_FOUND: 'User not found',
  USER_DETAILS_FETCHED_SUCCESSFULLY: 'User details fetched successfully',
  USER_RECORD_CREATED: 'User record created successfully',
  BANK_LOAN_DETAILS_FETCHED_SUCCESSFULLY:
    'Bank Loan Details Fetched Successfully',
} as const;

export const OTP_VERIFICATION_STATUS = {
  VALID: 'valid',
  INVALID: 'invalid',
} as const;
