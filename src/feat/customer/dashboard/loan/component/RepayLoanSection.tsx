import { Button } from "@headlessui/react";
import { inputClass } from "../../../../../shared/constant/className.costant";
import type { LoanDto } from "../../../../loan/domain/loan.type";
import { useRepayLoanSection } from "../hook/useRepayLoanSection";

type RepayLoanSectionProps = {
  loan: LoanDto;
};


const statusColorClass = (status: LoanDto["status"]) => {
  if (status === "OVERDUE_PAYMENT") return "text-red-500";
  if (status === "DONE_PAYMENT") return "text-green-500";
  return "text-blue-500";
};

const RepayLoanSection = ({ loan }: RepayLoanSectionProps) => {
  const { repayMonths, setRepayMonths, monthlyInstallment, repayingAmount, handleRepay } =
    useRepayLoanSection(loan);

  return (
    <div className="flex w-full flex-col gap-4 text-sm text-gray-700">
      <div className="grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">Loan ID</span>
          <span className="font-semibold">{loan.id}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">Type</span>
          <span className="font-semibold">{loan.type}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">Total Amount</span>
          <span className="font-semibold">${loan.totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">Left to Repay</span>
          <span className="font-semibold text-red-500">${loan.leftAmount.toLocaleString()}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">Duration</span>
          <span className="font-semibold">{loan.durationMonths} months</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">Monthly Installment</span>
          <span className="font-semibold">${monthlyInstallment.toFixed(4)}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">Due Date</span>
          <span className="font-semibold">
            {new Date(loan.dueDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">Status</span>
          <span className={`font-semibold ${statusColorClass(loan.status)}`}>
            {loan.status.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600">Number of Months to Repay</label>
        <input
          type="number"
          aria-label="Number of months to repay"
          className={inputClass}
          value={repayMonths}
          min={0}
          max={loan.durationMonths}
          onChange={(e) => setRepayMonths(Math.max(0, Number(e.target.value)))}
        />
      </div>

      <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4">
        <span className="text-sm text-gray-600">Total Repay Amount</span>
        <span className="text-lg font-bold text-blue-600">${repayingAmount.toFixed(4)}</span>
        <Button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={() => handleRepay()}>Repay</Button>
      </div>
    </div>
  );
};

export default RepayLoanSection;
