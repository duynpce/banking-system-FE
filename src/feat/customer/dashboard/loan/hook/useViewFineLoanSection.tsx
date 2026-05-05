import { useState } from "react";
import { useGetLoanFinesWithPagination } from "../../../../loan/domain/useLoanFine";

const FINE_LIMIT = 5;

export const useViewFineLoanSection = () => {
  const [page, setPage] = useState(1);

  const {
    data: finesData,
    isLoading: isFinesLoading,
    isFetching: isFinesFetching,
  } = useGetLoanFinesWithPagination({ page: page - 1, limit: FINE_LIMIT });

  const fines = finesData?.data ?? [];
  const totalPage = finesData?.metaData?.totalPages ?? 1;

  return {
    page,
    setPage,
    fines,
    totalPage,
    isFinesLoading,
    isFinesFetching,
  };
};


