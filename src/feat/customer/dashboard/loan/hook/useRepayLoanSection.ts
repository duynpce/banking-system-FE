import { useMemo, useState } from "react";
import { RepayLoanRequestSchema, type LoanDto, type RepayLoanRequest } from "../../../../loan/domain/loan.type";
import { useRepayLoan } from "../../../../loan/domain/useLoan";
import { toast } from "react-toastify";

export const useRepayLoanSection = (loan: LoanDto) => {
  const [repayMonths, setRepayMonths] = useState(0);
  
  const monthlyInstallment = loan.totalAmount / loan.durationMonths;
  const repayingAmount = useMemo(() => repayMonths * monthlyInstallment, [repayMonths, monthlyInstallment]);
  const repayMutation = useRepayLoan(loan.id, repayingAmount);

  const handleRepay = () => {
    const request: RepayLoanRequest = {
      loanId: loan.id,
      amount: repayingAmount,
    };

    if(!repayMonths || repayMonths > loan.durationMonths) {
      toast.error(`Please enter a valid number of months to repay (1-${loan.durationMonths})`);
      return;
    }

    if(repayingAmount > loan.leftAmount) {
      toast.error(`Repay amount cannot exceed the left amount of $${loan.leftAmount.toFixed(2)}`);
      return;
    }
    
    RepayLoanRequestSchema.parse(request);
    repayMutation.mutate();
  }

  return {
    repayMonths,
    setRepayMonths,
    monthlyInstallment,
    repayMutation,
    handleRepay,
    repayingAmount
  };
};
