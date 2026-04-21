import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createTransaction,
  getRelativeStartDate,
  getTransactionsByFilter,
  toLocalDateString,
} from "./transaction.service";
import { TransactionGroup, TransactionStatus, TransactionType, type CreateTransactionRequest } from './transaction.type';


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
