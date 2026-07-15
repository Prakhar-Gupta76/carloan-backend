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
  USER_DETAILS_NOT_FOUND: 'User details not found',
  USER_DETAILS_FETCHED_SUCCESSFULLY: 'User details fetched successfully',
  USER_RECORD_CREATED: 'User record created successfully',
  BANK_LOAN_DETAILS_FETCHED_SUCCESSFULLY:
    'Bank Loan Details Fetched Successfully',
  CHECKS_FAILED: 'Checks failed',
  DATA_FIELDS_PROVIDED_NOT_CORRECT: 'Data Field(s) provided not correct',
  VERIFICATION_DETAILS_FETCHED_SUCCESSFULLY:
    'Verification details fetched successfully',
  DOB_CHECKS_FAILED: 'checks failed',
  DOB_CHECKS_PASSED: 'checks passed',
  IDENTITY_PROOF_REQUIRED: 'Identity proof image is required',
  INVALID_IDENTITY_PROOF_FILE: 'Identity proof file must be an image',
  DOB_EXTRACTION_FAILED: 'Date of birth could not be extracted from image',
  USER_AGE_NOT_FOUND: 'User age is not available',
  DRIVING_LICENSE_REQUIRED: 'Driving license file is required',
  INVALID_DRIVING_LICENSE_FILE: 'Driving license file must be an image',
  PAYMENT_SESSION_CREATED: 'Payment session created successfully',
  LOAN_MONTHLY_EMI_NOT_FOUND: 'Loan monthly EMI is not available',
} as const;

export const OTP_VERIFICATION_STATUS = {
  VALID: 'valid',
  INVALID: 'invalid',
} as const;
