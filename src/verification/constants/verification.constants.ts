export const VERIFICATION_CONSENT = {
  PURPOSE: 'Loan underwriting',
  STATUS: 'Token',
  FREQUENCY: 'ONETIME',
} as const;

export enum IdentityProofType {
  AADHAR_CARD = 'AADHAR_CARD',
  PAN_CARD = 'PAN_CARD',
  VOTER_ID_CARD = 'VOTER_ID_CARD',
}

export const VERIFICATION_DATA_TYPES = {
  BANK_STATEMENT: 'BANK_STATEMENT',
  EMPLOYMENT_HISTORY: 'EMPLOYMENT_HISTORY',
  CREDIT_SCORE: 'CREDIT_SCORE',
  EXISTING_EMIS: 'EXISTING_EMIS',
} as const;

export const VERIFICATION_ENDPOINTS = {
  SALARY_VERIFICATION: '/api/v1/salary-verification',
  EMPLOYMENT_CHECK: '/api/v1/employment-check',
  GET_CREDIT_SCORE: '/api/v1/get-credit-score',
  GET_EXISTING_EMI: '/api/v1/get-existing-emi',
} as const;

export const INSPECTION_RESPONSE_STATUS = {
  NOT_FOUND: 'not found',
} as const;

export const VERIFICATION_FAILURES = {
  DATA_NOT_FOUND: {
    errCode: 'ERR01',
    message: 'Data not found. Details provided are incorrect.',
  },
  SALARY_INCORRECT: {
    errCode: 'SAL01',
    message: 'Salary provided is incorrect.',
  },
  EMPLOYMENT_DURATION_FAILED: {
    errCode: 'EMP01',
    message: 'Employment Duration is less than minimum threshold.',
  },
} as const;

export const DOB_VERIFICATION_FAILURES = {
  AGE_INCORRECT: {
    errCode: 'AGE01',
    message: 'Age input is incorrect',
  },
} as const;

export const DOB_VERIFICATION_SUCCESS = {
  status: 'Validated',
  message: 'Age is validated',
} as const;
