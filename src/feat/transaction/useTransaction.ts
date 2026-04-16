import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createTransaction,
  getMonthlyTransactions,
  getTransactionByPage,
  getTransactionsByDateRange,
  getWeeklyTransactions,
  getYearlyTransactions,
  toLocalDateString,
} from "./transaction.service";
import type { CreateTransactionRequest } from "./transaction.type";

type TransactionPeriod = "week" | "month" | "year" ;

export const useCreateTransaction = () => {
  return useMutation({
    mutationKey: ["create-transaction"],
    mutationFn: (request: CreateTransactionRequest) => createTransaction(request),
  });
};

export const useGetTransactionsQueryByPeriod = (
  transactionPeriod: TransactionPeriod,
  transactionEndDate: Date,
) => {
  return useQuery({
    queryKey: [
      "transactions",
      transactionPeriod,
      toLocalDateString(transactionEndDate),
    ],
    queryFn: ({ signal }) => {
      if (transactionPeriod === "week") {
        return getWeeklyTransactions(transactionEndDate, signal);
      }

      if (transactionPeriod === "month") {
        return getMonthlyTransactions(transactionEndDate, signal);
      }

      if (transactionPeriod === "year") {
        return getYearlyTransactions(transactionEndDate, signal);
      }

    },
    enabled:  !Number.isNaN(transactionEndDate.getTime()),
  });
};

export const useGetTransactionsQueryByDateRange = (startDate: Date, endDate: Date) => {
  return useQuery({
    queryKey: ["transactions", "date-range", toLocalDateString(startDate), toLocalDateString(endDate)],
    queryFn: ({ signal }) => getTransactionsByDateRange(startDate, endDate, signal),
    enabled: !Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime()),
  });
}

export const useGetTransactionsWithPagination = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["transactions", "pagination", page, limit],
    queryFn: ({ signal }) => getTransactionByPage(page, limit, signal),
    enabled: Number.isFinite(page) && page >= 0 && Number.isFinite(limit) && limit > 0,
  });
};
