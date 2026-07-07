export type InspectionApiResponse<T = unknown> = {
  status: string;
  message?: string;
  data?: T;
  error?: unknown;
};

export type AccountAggregatorTransaction = {
  date?: string;
  description?: string;
  type?: string;
  amount?: number;
};

export type AccountAggregatorResponseData = {
  transactions?: AccountAggregatorTransaction[];
};

export type EpfoPfCredit = {
  amount?: number;
  company?: string;
  date?: string;
};

export type EpfoResponseData = {
  pf_credits?: EpfoPfCredit[];
};
