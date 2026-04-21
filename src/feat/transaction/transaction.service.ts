import { api } from "../../config/axios/api";
import type { CreateTransactionRequest, TransactionDto, TransactionFilter } from "./transaction.type";


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


export const createTransaction = async (request: CreateTransactionRequest) => {
  return await api.post<string>("/v1/transactions", request, {
    toastMessageWhenSuccess: true,
  });
};

export const getTransactionsByFilter = async (transactionFilter: TransactionFilter, signal?: AbortSignal) => {
  return await api.get<TransactionDto[]>("/v1/transactions", {
    signal,
    params: {
      "paginationDto.page": transactionFilter.paginationDto.page,
      "paginationDto.limit": transactionFilter.paginationDto.limit,
      "transactionGroup": transactionFilter.transactionGroup,
      "type": transactionFilter.type,
      "status": transactionFilter.status,
      "startDate": transactionFilter.startDate,
      "endDate": transactionFilter.endDate,
    },
  });
};

export const getRelativeStartDate = (endDate: DateInput, period: "week" | "month" | "year") => {
  const end = toDate(endDate);
  const start = new Date(end.getTime());

  if (period === "week") {
    start.setDate(start.getDate() - 7);
    return start;
  }

  if (period === "month") {
    start.setMonth(start.getMonth() - 1);
    return start;
  }

  start.setFullYear(start.getFullYear() - 1);
  return start;
};