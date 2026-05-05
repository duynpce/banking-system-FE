import { useCreateTransactionSection } from "../hook/useCreateTransactionSection";
import Button from "../../../../../shared/component/Button";
import Modal from "../../../../../shared/component/Modal";
import InputWithLabel from "../../../../../shared/component/InputWithLabel";
import SelectWithLabel from "../../../../../shared/component/SelectWithLabel";
import { TransactionType } from "../../../../transaction/transaction.type";

const CreateTransactionSection = () => {
  const {
    isCreateTransactionModalOpen,
    setIsCreateTransactionModalOpen,
    handleSmartSubmit,
    handleCreateTransaction,
    register,
    registerTransactionType,
    isReceiverAccountRequired,
    userAccountNumber,
    receiverAccountName,
    isReceiverAccountNameLoading,
    isReceiverAccountNotFound,
    isReceiverAccountNumberFormatValid,
    debouncedReceiverAccountNumber,
    isCreatingTransaction,
    onCloseCreateTransactionModal
   } = useCreateTransactionSection();

   // Filter out the DEPOSIT option for the transaction type select, because deposit is for admin only
  const transactionTypeOptions = Object.values(TransactionType).filter(value => value !== TransactionType.DEPOSIT);

  return (
    
    <div>
      <button
        type="button"
        className="inline-flex items-center gap-3 whitespace-nowrap rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600 hover:shadow-md"
        onClick={() => setIsCreateTransactionModalOpen(true)}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <img src="/src/assets/icon/add.svg" alt="Add Transaction" className="h-4 w-4" />
        </span>
        <span>Create New Transaction</span>
      </button>

      {
        isCreateTransactionModalOpen && (
          <Modal
        isOpen={isCreateTransactionModalOpen}
        onClose={onCloseCreateTransactionModal}
        title="Create New Transaction"
      >
        <form
          onSubmit={handleSmartSubmit((request) => handleCreateTransaction(request))}
          className="flex flex-col gap-4"
        >
          <SelectWithLabel<TransactionType>
            label="Transaction Type"
            data={transactionTypeOptions}
            getOptionLabel={(item) => `${item[0]}${item.slice(1).toLowerCase()}`}
            {...registerTransactionType}
          />

          <InputWithLabel
            label="Description"
            placeholder="Enter description"
            {...register("description")}
          />

          <InputWithLabel
            label="Amount"
            type="number"
            step={0.0001}
            min={1}
            {...register("transferredAmount", { valueAsNumber: true })}
          />

          {isReceiverAccountRequired && (
            <div className="flex flex-col gap-1">
              <InputWithLabel
              label="Receiver Account Number"
              placeholder="Enter 12-digit account number"
              maxLength={12}
              pattern="[0-9]{12}"              
              {...register("receiverAccountNumber")}
            />

            {debouncedReceiverAccountNumber.length > 0 && !isReceiverAccountNumberFormatValid && (
              <span className="text-xs text-amber-600">Receiver account number must contain exactly 12 digits.</span>
            )}

            {isReceiverAccountNameLoading && (
              <span className="text-xs text-gray-500">Checking receiver account...</span>
            )}

            {!isReceiverAccountNameLoading && receiverAccountName && debouncedReceiverAccountNumber !== userAccountNumber && (
              <span className="text-xs text-green-600">Receiver: {receiverAccountName}</span>
            )}

            {isReceiverAccountNotFound && (
              <span className="text-xs text-red-600">
                No account found with account number: {debouncedReceiverAccountNumber}
              </span>
            )}



            {
              debouncedReceiverAccountNumber === userAccountNumber && (
                <span className="text-xs text-red-600">
                  Receiver account number cannot be the same as your account number.
                </span>
              )
            }
            </div>
            
          )}

          <div className="mt-2 flex items-center justify-end gap-3">
            <Button
              type="button"
              content="Cancel"
              className="bg-gray-400 hover:bg-gray-500"
              onClick={onCloseCreateTransactionModal}
            />
            <Button
              type="submit"
              content={isCreatingTransaction ? "Creating..." : "Create Transaction"}
              disabled={isCreatingTransaction}
            />
          </div>
        </form>
      </Modal>
        )
      }
    </div>
    
    
    
    
  )};
  
  
  



export default CreateTransactionSection;