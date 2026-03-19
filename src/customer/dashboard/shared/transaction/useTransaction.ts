import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getMonthlyTransactions,
  getTransactionsByDateRange,
  getWeeklyTransactions,
  getYearlyTransactions,
  toLocalDateString,
} from "./transaction.service";

type TransactionPeriod = "week" | "month" | "year" | "range";

export const useTransaction = () => {
  const [transactionPeriod, setTransactionPeriod] = useState<TransactionPeriod>("week");
  const [transactionEndDate, setTransactionEndDate] = useState<Date>(new Date());
  const [transactionStartDate, setTransactionStartDate] = useState<Date>(() => {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    return start;
  });

  const useGetTransactionsQuery = useQuery({
    queryKey: [
      "transactions",
      transactionPeriod,
      toLocalDateString(transactionStartDate),
      toLocalDateString(transactionEndDate),
    ],
    queryFn: () => {
      if (transactionPeriod === "week") {
        return getWeeklyTransactions(transactionEndDate);
      }

      if (transactionPeriod === "month") {
        return getMonthlyTransactions(transactionEndDate);
      }

      if (transactionPeriod === "year") {
        return getYearlyTransactions(transactionEndDate);
      }

      return getTransactionsByDateRange(transactionStartDate, transactionEndDate);
    },
  });

  return {
    transactionPeriod,
    transactionStartDate,
    transactionEndDate,
    setTransactionPeriod,
    setTransactionStartDate,
    setTransactionEndDate,
    useGetTransactionsQuery,
  };
};