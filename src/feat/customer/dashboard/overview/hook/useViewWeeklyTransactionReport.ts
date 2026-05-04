import { useState } from "react";
import { TransactionReportType } from "../../../../transaction/transaction.type";
import { useGetTransactionsReportByFilter } from "../../../../transaction/useTransaction";

const now = new Date();

export const useViewWeeklyTransactionReport = () => {
  const [query, setQuery] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    week: 1,
  });

  const reportQuery = useGetTransactionsReportByFilter({
    reportType: TransactionReportType.WEEK,
    year: query.year,
    month: query.month,
    week: query.week,
  });

  return {
    query,
    setQuery,
    reports: reportQuery.data ?? [],
    isLoading: reportQuery.isLoading,
    isFetching: reportQuery.isFetching,
  };
};