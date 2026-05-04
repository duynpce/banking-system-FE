import Card from "../../../../../shared/component/Card";
import LoadingSpinner from "../../../../../shared/component/LoadingSpinner";
import Modal from "../../../../../shared/component/Modal";
import PaginationBar from "../../../../../shared/component/PaginationBar";
import { LoanStatus } from "../../../../loan/domain/loan.type";
import CreateLoanSection from "./CreateLoanSection";
import RepayLoanSection from "./RepayLoanSection";
import { useViewLoanSection } from "../hook/useViewLoanSection";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return Number.isNaN(date.getTime()) ? dateStr : date.toLocaleDateString();
};

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Current Payment", value: LoanStatus.CURRENT_PAYMENT },
  { label: "Overdue Payment", value: LoanStatus.OVERDUE_PAYMENT },
  { label: "Done Payment", value: LoanStatus.DONE_PAYMENT },
] as const;

const ViewLoanSection = () => {
  const {
    page,
    setPage,
    loanStatus,
    setLoanStatus,
    loans,
    totalPage,
    isLoansLoading,
    isLoansFetching,
    loanReport,
    repayingLoan,
    isRepayModalOpen,
    openRepayModal,
    closeRepayModal,
  } = useViewLoanSection();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <CreateLoanSection />
        <select
          aria-label="Loan status filter"
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none focus:ring-2 focus:ring-blue-300"
          value={loanStatus ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            setLoanStatus(val === "" ? undefined : (val as LoanStatus));
            setPage(1);
          }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2 grid grid-cols-8 px-4 text-sm font-semibold text-blue-600">
        <span>ID</span>
        <span>Loan Money</span>
        <span>Left to Repay</span>
        <span>Duration</span>
        <span>Interest Rate</span>
        <span>Installment</span>
        <span>Due Date</span>
        <span>Repay</span>
      </div>

      {(isLoansLoading || isLoansFetching) && <LoadingSpinner />}

      {!isLoansLoading && !isLoansFetching && loans.length === 0 && (
        <p className="p-4 text-sm text-gray-500">No loans found.</p>
      )}

      {!isLoansLoading && !isLoansFetching && loans.length > 0 && (
        <Card className="flex flex-col" innerClassName="bg-white">
          {loans.map((loan) => (
            <div
              key={loan.id}
              className="grid grid-cols-8 items-center border-b border-gray-100 px-4 py-4 text-sm text-gray-700 last:border-b-0"
            >
              <span>{loan.id}</span>
              <span>${loan.totalAmount.toLocaleString()}</span>
              <span>${loan.leftAmount.toLocaleString()}</span>
              <span>{loan.durationMonths} months</span>
              <span>{loan.interestRate}%</span>
              <span>${(loan.totalAmount / loan.durationMonths + (loan.totalAmount * loan.interestRate / 100)).toFixed(4)} / month</span>
              <span>{formatDate(loan.dueDate)}</span>
              <button
                type="button"
                className="w-fit rounded-full border border-blue-500 px-5 py-1.5 text-sm text-blue-600 transition-colors hover:bg-blue-50"
                onClick={() => openRepayModal(loan)}
              >
                Repay
              </button>
            </div>
          ))}

          {loanReport && (
            <div className="grid grid-cols-8 items-center px-4 py-4 text-sm font-semibold text-red-500">
              <span>Total</span>
              <span>${loanReport.totalAmount.toLocaleString()}</span>
              <span>${loanReport.leftAmount.toLocaleString()}</span>
              <span />
              <span />
              <span>${loanReport.monthlyInstallment.toFixed(4)} / month</span>
              <span />
              <span />
            </div>
          )}
        </Card>
      )}

      <PaginationBar totalPage={totalPage} setPage={setPage} currentPage={page} />

      <Modal isOpen={isRepayModalOpen} onClose={closeRepayModal} title="Repay Loan">
        {repayingLoan && <RepayLoanSection loan={repayingLoan} />}
      </Modal>
    </div>
  );
};

export default ViewLoanSection;
