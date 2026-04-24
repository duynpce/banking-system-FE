import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createTransaction,
  getRelativeStartDate,
  getTransactionReportsByFilter,
  getTransactionsByFilter,
  toLocalDateString,
} from "./transaction.service";
import { TransactionGroup, TransactionStatus, TransactionType, type CreateTransactionRequest, type TransactionReportFilter } from './transaction.type';
import { queryClient } from "../../config/userQuery.config";


type TransactionPeriod = "week" | "month" | "year" ;

export const useCreateTransaction = () => {
  return useMutation({
    mutationKey: ["create-transaction"],
    mutationFn: (request: CreateTransactionRequest) => createTransaction(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useGetTransactionsQueryByPeriod = (
  transactionPeriod: TransactionPeriod,
  transactionEndDate: Date,
) => {
  const endDateString = toLocalDateString(transactionEndDate);

  return useQuery({
    queryKey: [
      "transactions",
      transactionPeriod,
      endDateString,
    ],
    queryFn: async ({ signal }) => {
      const startDate = getRelativeStartDate(transactionEndDate, transactionPeriod);
      const res = await getTransactionsByFilter(
        {
          paginationDto: { page: 0, limit: 1000},
          transactionGroup: TransactionGroup.ALL,
          startDate: toLocalDateString(startDate),
          endDate: endDateString,
        },
        signal,
      );
      return res.data;
    },
    enabled:  !Number.isNaN(transactionEndDate.getTime()),
  });
};

export const useGetTransactionsQueryByDateRange = (startDate: Date, endDate: Date) => {
  return useQuery({
    queryKey: ["transactions", "date-range", toLocalDateString(startDate), toLocalDateString(endDate)],
    queryFn: async ({ signal }) => {
      const res = await getTransactionsByFilter(
        {
          paginationDto: { page: 0, limit: 1000 },
          transactionGroup: TransactionGroup.ALL,
          startDate: toLocalDateString(startDate),
          endDate: toLocalDateString(endDate),
        },
        signal,
      );
      return res.data;
    },
    enabled: !Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime()),
  });
}

export const useGetTransactionsWithPagination = (page: number, limit: number,transactionGroup?:
   TransactionGroup, type?: TransactionType, status?: TransactionStatus, startDate? :Date, endDate?: Date

) => {
  const startDateString = startDate ? toLocalDateString(startDate) : undefined;
  const endDateString = endDate ? toLocalDateString(endDate) : undefined;
  const effectiveTransactionGroup = transactionGroup ?? TransactionGroup.ALL;

  return useQuery({
    queryKey: ["transactions", "pagination", page, limit, effectiveTransactionGroup, type, status, startDateString, endDateString],
    queryFn: ({ signal }) =>
      getTransactionsByFilter(
        {
          paginationDto: { page, limit },
          transactionGroup: effectiveTransactionGroup,
          type,
          status,
          startDate: startDateString,
          endDate: endDateString,
        },
        signal,
      ),
    enabled: Number.isFinite(page) && page >= 0 && Number.isFinite(limit) && limit > 0,
  });
};

export const useGetTransactionsReportByFilter = (transactionReportFilter: TransactionReportFilter) => {
  const isValidYear = Number.isFinite(transactionReportFilter.year) && Number(transactionReportFilter.year) >= 2000;
  const isValidMonth = Number.isFinite(transactionReportFilter.month) && Number(transactionReportFilter.month) >= 1 && Number(transactionReportFilter.month) <= 12;
  const isValidWeek = Number.isFinite(transactionReportFilter.week) && Number(transactionReportFilter.week) >= 1 && Number(transactionReportFilter.week) <= 5;
  const isValidDay = Number.isFinite(transactionReportFilter.day) && Number(transactionReportFilter.day) >= 1 && Number(transactionReportFilter.day) <= 31;

  const isEnabled = (() => {
    if (transactionReportFilter.reportType === "DAY") {
      return isValidYear && isValidMonth && isValidDay;
    }

    if (transactionReportFilter.reportType === "WEEK") {
      return isValidYear && isValidMonth && isValidWeek;
    }

    if (transactionReportFilter.reportType === "MONTH") {
      return isValidYear && isValidMonth;
    }

    return isValidYear;
  })();

  return useQuery({
    queryKey: [
      "transactions", "reports",
      transactionReportFilter.reportType,
      transactionReportFilter.year,
      transactionReportFilter.month,
      transactionReportFilter.week,
      transactionReportFilter.day,
    ],
    queryFn: async ({ signal }) => {  
      const res = await getTransactionReportsByFilter(
        transactionReportFilter, signal  
      );
      return res.data;
    },
    enabled: isEnabled,
  });
};
