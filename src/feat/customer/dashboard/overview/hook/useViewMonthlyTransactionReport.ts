import { useState } from "react";
import { TransactionReportType } from "../../../../transaction/transaction.type";
import { useGetTransactionsReportByFilter } from "../../../../transaction/useTransaction";

const now = new Date();

export const useViewMonthlyTransactionReport = () => {
  const [query, setQuery] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });

  const reportQuery = useGetTransactionsReportByFilter({
    reportType: TransactionReportType.MONTH,
    year: query.year,
    month: query.month,
  });

  return {
    query,
    setQuery,
    reports: reportQuery.data ?? [],
    isLoading: reportQuery.isLoading,
    isFetching: reportQuery.isFetching,
  };
};