import { useState } from "react";
import { TransactionReportType } from "../../../../transaction/transaction.type";
import { useGetTransactionsReportByFilter } from "../../../../transaction/useTransaction";

const now = new Date();

export const useViewDailyTransactionReport = () => {
  const [query, setQuery] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  });

  const reportQuery = useGetTransactionsReportByFilter({
    reportType: TransactionReportType.DAY,
    year: query.year,
    month: query.month,
    day: query.day,
  });

  return {
    query,
    setQuery,
    reports: reportQuery.data ?? [],
    isLoading: reportQuery.isLoading,
    isFetching: reportQuery.isFetching,
  };
};