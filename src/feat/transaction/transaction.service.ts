import { api } from "../../config/axios/api";

export interface Transaction {
  id: string;
  fromAccountNumber: string;
  toAccountNumber: string;
  type: string;
  status: string;
  transferredAmount: number;
  postedBalance: number;
  createdAt: string;
}

type DateInput = Date | string;

const toDate = (value: DateInput): Date => {
  const parsed = typeof value === "string" ? new Date(value) : new Date(value.getTime());
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid date input");
  }
  return parsed;
};

// Convert DateInput to "YYYY-MM-DD" format for API query parameters.
export const toLocalDateString = (value: DateInput): string => {
  const date = toDate(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getTransactionsByDateRange = async (startDate: DateInput, endDate: DateInput) => {
  const res = await api.get<Transaction[]>(`/v1/transactions`, {
    params: {
      startDate: toLocalDateString(startDate),
      endDate: toLocalDateString(endDate),
    },
  });
  return res.data;
};

export const getWeeklyTransactions = async (endDate: DateInput) => {
  const end = toDate(endDate);
  const start = new Date(end.getTime());
  start.setDate(start.getDate() - 7);
  return getTransactionsByDateRange(start, end);
};

export const getMonthlyTransactions = async (endDate: DateInput) => {
  const end = toDate(endDate);
  const start = new Date(end.getTime());
  start.setMonth(start.getMonth() - 1);
  return getTransactionsByDateRange(start, end);
};

export const getYearlyTransactions = async (endDate: DateInput) => {
  const end = toDate(endDate);
  const start = new Date(end.getTime());
  start.setFullYear(start.getFullYear() - 1);
  return getTransactionsByDateRange(start, end);
};
