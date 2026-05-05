import { useState } from "react";
import { TransactionReportType } from "../../../../transaction/transaction.type";
import { useGetTransactionsReportByFilter } from "../../../../transaction/useTransaction";

const now = new Date();

export const useViewYearlyTransactionReport = () => {
  const [query, setQuery] = useState({
    year: now.getFullYear(),
  });

  const reportQuery = useGetTransactionsReportByFilter({
    reportType: TransactionReportType.YEAR,
    year: query.year,
  });

  return {
    query,
    setQuery,
    reports: reportQuery.data ?? [],
    isLoading: reportQuery.isLoading,
    isFetching: reportQuery.isFetching,
  };
};