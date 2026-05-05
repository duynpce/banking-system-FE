import Button from "../../../../../shared/component/Button";
import addIcon from "../../../../../assets/icon/add.svg";
import InputWithLabel from "../../../../../shared/component/InputWithLabel";
import LoadingSpinner from "../../../../../shared/component/LoadingSpinner";
import Modal from "../../../../../shared/component/Modal";
import SelectWithLabel from "../../../../../shared/component/SelectWithLabel";
import { LoanType } from "../../../../loan/domain/loan.type";
import type { LoanPolicyDto } from "../../../../loan/policy/loan.policy.type";
import { useCreateLoanSection } from "../hook/useCreateLoanSection";

const loanTypeOptions = Object.values(LoanType);

const CreateLoanSection = () => {
  const {
    isCreateLoanModalOpen,
    setIsCreateLoanModalOpen,
    onCloseCreateLoanModal,
    handleSmartSubmit,
    handleCreateLoan,
    register,
    registerLoanType,
    registerPolicyId,
    policies,
    isPoliciesLoading,
    selectedPolicy,
    isCreatingLoanPending,
  } = useCreateLoanSection();

  return (
    <div>
      <button
        type="button"
        className="inline-flex items-center gap-3 whitespace-nowrap rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600 hover:shadow-md"
        onClick={() => setIsCreateLoanModalOpen(true)}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <img src={addIcon} alt="Add Loan" className="h-4 w-4" />
        </span>
        <span>Create New Loan</span>
      </button>

      {isCreateLoanModalOpen && (
        <Modal
          isOpen={isCreateLoanModalOpen}
          onClose={onCloseCreateLoanModal}
          title="Create New Loan"
        >
          <form
            onSubmit={handleSmartSubmit((request) => handleCreateLoan(request))}
            className="flex w-full flex-col gap-4"
          >
            <SelectWithLabel<LoanType>
              label="Loan Type"
              data={loanTypeOptions}
              getOptionLabel={(item) => `${item[0]}${item.slice(1).toLowerCase()}`}
              {...registerLoanType}
            />

            {isPoliciesLoading ? (
              <LoadingSpinner />
            ) : policies && policies.length > 0 ? (
              <>
                <SelectWithLabel<LoanPolicyDto>
                  label="Duration (Months)"
                  data={policies}
                  getOptionValue={(p) => p.id}
                  getOptionLabel={(p) =>
                    `${p.durationMonths} months – ${p.interestRate}% interest`
                  }
                  {...registerPolicyId}
                />
                {selectedPolicy && (
                  <div className="flex flex-col gap-1 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                    <span>
                      Interest Rate: <strong>{selectedPolicy.interestRate}%</strong>
                    </span>
                    <span>
                      Max Amount:{" "}
                      <strong>
                        {selectedPolicy.maxAmount != null
                          ? `$${selectedPolicy.maxAmount}`
                          : "N/A"}
                      </strong>
                    </span>
                    <span>
                      Duration: <strong>{selectedPolicy.durationMonths} months</strong>
                    </span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">
                No policies available for this loan type.
              </p>
            )}

            <InputWithLabel
              label="Amount ($)"
              type="number"
              step={0.01}
              min={0.01}
              placeholder="Enter loan amount"
              {...register("amount", { valueAsNumber: true })}
            />

            <div className="mt-2 flex items-center justify-end gap-3">
              <Button
                type="button"
                content="Cancel"
                className="bg-gray-400 hover:bg-gray-500"
                onClick={onCloseCreateLoanModal}
              />
              <Button
                type="submit"
                content={isCreatingLoanPending ? "Creating..." : "Create Loan"}
                disabled={isCreatingLoanPending || !policies || policies.length === 0}
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CreateLoanSection;
