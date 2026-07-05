export type QuoteDetails = {
  bank: string;
  interest_rate: number;
};

export type QuotesApiResponse = {
  status: string;
  message?: string;
  data?: QuoteDetails[];
  error?: unknown;
};
