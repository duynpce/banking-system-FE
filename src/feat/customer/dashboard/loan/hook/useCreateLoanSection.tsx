import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormCustom } from "../../../../../shared/hook/useFormCustom";
import { useGetLoanPoliciesByLoanType } from "../../../../loan/policy/useLoanPolicy";
import { LoanType, CreateLoanRequestSchema, type CreateLoanRequest } from "../../../../loan/domain/loan.type";
import type { LoanPolicyDto } from "../../../../loan/policy/loan.policy.type";
import { useCreateLoan } from "../../../../loan/domain/useLoan";


export const useCreateLoanSection = () => {
  const [isCreateLoanModalOpen, setIsCreateLoanModalOpen] = useState(false);
  const [loanType, setLoanType] = useState<LoanType>(LoanType.MORTGAGE);
  const [selectedPolicy, setSelectedPolicy] = useState<LoanPolicyDto | undefined>();
  const [prevPolicies, setPrevPolicies] = useState<LoanPolicyDto[] | undefined>();

  const { data: policies, isLoading: isPoliciesLoading } = useGetLoanPoliciesByLoanType(loanType);
  const createLoanMutation = useCreateLoan();

  const {
    handleSmartSubmit,
    register,
    setValue,
    reset,
    formState: { isSubmitting: isCreatingLoan },
  } = useFormCustom<CreateLoanRequest>({
    defaultValues: {
      amount: 0,
      type: LoanType.MORTGAGE,
      policyId: 0,
    },
    resolver: zodResolver(CreateLoanRequestSchema),
  });

  if (policies !== prevPolicies) {
    setPrevPolicies(policies);
    const firstPolicy = policies?.[0];
    setSelectedPolicy(firstPolicy);
    setValue("policyId", firstPolicy?.id ?? 0);
  }

  const registerLoanType = register("type", {
    onChange: (event) => {
      setLoanType(event.target.value as LoanType);
    },
  });

  const registerPolicyId = register("policyId", {
    valueAsNumber: true,
    onChange: (event) => {
      const nextPolicyId = Number(event.target.value);
      setSelectedPolicy(policies?.find((p) => p.id === nextPolicyId));
    },
  });

  const handleCreateLoan = (request: CreateLoanRequest) => {
    createLoanMutation.mutate(request, {
      onSuccess: () => {
        reset({ amount: 0, type: LoanType.MORTGAGE, policyId: 0 });
        setLoanType(LoanType.MORTGAGE);
        setIsCreateLoanModalOpen(false);
      },
    });
  };

  const onCloseCreateLoanModal = () => {
    reset({ amount: 0, type: LoanType.MORTGAGE, policyId: 0 });
    setLoanType(LoanType.MORTGAGE);
    setIsCreateLoanModalOpen(false);
  };

  return {
    isCreateLoanModalOpen,
    setIsCreateLoanModalOpen,
    onCloseCreateLoanModal,
    handleSmartSubmit,
    handleCreateLoan,
    register,
    registerLoanType,
    registerPolicyId,
    loanType,
    policies,
    isPoliciesLoading,
    selectedPolicy,
    isCreatingLoan,
    isCreatingLoanPending: createLoanMutation.isPending,
  };
};
