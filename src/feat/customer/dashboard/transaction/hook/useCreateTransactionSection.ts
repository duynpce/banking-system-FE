import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateTransaction } from '../../../../transaction/useTransaction';
import { useFormCustom } from '../../../../../shared/hook/useFormCustom';
import { useGetAccountNameByAccountNumberQuery } from '../../../../account/useAccount';
import {
  type CreateTransactionRequest,
  CreateTransactionRequestSchema,
  TransactionType,
} from '../../../../transaction/transaction.type';

export const useCreateTransactionSection = () => {
  const [isCreateTransactionModalOpen, setIsCreateTransactionModalOpen] = useState(false);
  const [debouncedReceiverAccountNumber, setDebouncedReceiverAccountNumber] = useState('');
  const createTransactionMutation = useCreateTransaction();

  const {
    handleSmartSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { isSubmitting: isCreatingTransaction },
  } = useFormCustom<CreateTransactionRequest>({
    defaultValues: {
      description: "",
      transferredAmount: 0,
      type: TransactionType.TRANSFER,
      receiverAccountNumber: "",
    },
    resolver: zodResolver(CreateTransactionRequestSchema),
  });

  const selectedTransactionType = watch('type');
  const receiverAccountNumber = watch('receiverAccountNumber') ?? '';

  const isReceiverAccountRequired =
    selectedTransactionType === TransactionType.TRANSFER ||
    selectedTransactionType === TransactionType.PAYMENT;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedReceiverAccountNumber(receiverAccountNumber.trim());
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [receiverAccountNumber]);

  const effectiveDebouncedReceiverAccountNumber =
    isReceiverAccountRequired ? debouncedReceiverAccountNumber : '';

  const {
    data: receiverAccountName,
    isFetching: isReceiverAccountNameFetching,
  } = useGetAccountNameByAccountNumberQuery(effectiveDebouncedReceiverAccountNumber);

  const isReceiverAccountNumberFormatValid = /^\d{12}$/.test(effectiveDebouncedReceiverAccountNumber);
  const shouldShowReceiverAccountLookupState =
    isReceiverAccountRequired && effectiveDebouncedReceiverAccountNumber.length > 0;
  const isReceiverAccountNameLoading =
    shouldShowReceiverAccountLookupState &&
    isReceiverAccountNumberFormatValid &&
    isReceiverAccountNameFetching;
  const isReceiverAccountNotFound =
    shouldShowReceiverAccountLookupState &&
    isReceiverAccountNumberFormatValid &&
    !isReceiverAccountNameFetching &&
    !receiverAccountName;

  const registerTransactionType = register('type', {
    onChange: (event) => {
      const nextType = event.target.value as TransactionType;

      if (nextType !== TransactionType.TRANSFER && nextType !== TransactionType.PAYMENT) {
        setValue('receiverAccountNumber', '');
        setDebouncedReceiverAccountNumber('');
      }
    },
  });

  const resetCreateTransactionForm = () => {
    reset({
      description: '',  
      transferredAmount: 0,
      type: TransactionType.TRANSFER,
      receiverAccountNumber: '',
    });
    setDebouncedReceiverAccountNumber('');
  }

  const handleCreateTransaction = (request: CreateTransactionRequest) => {

    createTransactionMutation.mutate(request, {
      onSuccess: () => {
        resetCreateTransactionForm();
        setIsCreateTransactionModalOpen(false);
      },
    });
  };

  const onCloseCreateTransactionModal = () => {
    resetCreateTransactionForm();
    setIsCreateTransactionModalOpen(false);
  }



  return {
    isCreateTransactionModalOpen,
    setIsCreateTransactionModalOpen,
    handleSmartSubmit,
    handleCreateTransaction,
    register,
    registerTransactionType,
    isReceiverAccountRequired,
    receiverAccountName,
    isReceiverAccountNameLoading,
    isReceiverAccountNotFound,
    isReceiverAccountNumberFormatValid,
    debouncedReceiverAccountNumber: effectiveDebouncedReceiverAccountNumber,
    isCreatingTransaction,
    onCloseCreateTransactionModal,
  };
};

