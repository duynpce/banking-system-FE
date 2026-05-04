import { useState } from "react";
import { LoanStatus, type LoanDto } from "../../../../loan/domain/loan.type";
import { useGetLoanReport, useGetLoansWithPagination } from "../../../../loan/domain/useLoan";

const LOAN_LIMIT = 5;

export const useViewLoanSection = () => {
  const [page, setPage] = useState(1);
  const [loanStatus, setLoanStatus] = useState<LoanStatus | undefined>(undefined);
  const [repayingLoan, setRepayingLoan] = useState<LoanDto | undefined>(undefined);
  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);

  const {

    data: loansData,
    isLoading: isLoansLoading,
    isFetching: isLoansFetching,
  } = useGetLoansWithPagination(page - 1, LOAN_LIMIT, loanStatus); 

  const loans = loansData?.data ?? [];
  const totalPage = loansData?.metaData?.totalPages ?? 1;

  const { data: loanReport, isLoading: isLoanReportLoading } = useGetLoanReport(loanStatus);

  const openRepayModal = (loan: LoanDto) => {
    setRepayingLoan(loan);
    setIsRepayModalOpen(true);
  };

  const closeRepayModal = () => {
    setRepayingLoan(undefined);
    setIsRepayModalOpen(false);
  };

  return {
    page,
    setPage,
    loanStatus,
    setLoanStatus,
    loans,
    totalPage,
    isLoansLoading,
    isLoansFetching,
    loanReport,
    isLoanReportLoading,
    repayingLoan,
    isRepayModalOpen,
    openRepayModal,
    closeRepayModal,
  };
};
