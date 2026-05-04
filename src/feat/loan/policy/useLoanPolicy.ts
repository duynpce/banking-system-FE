import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../config/userQuery.config";
import type { PaginationDto } from "../../../shared/dto/request.dto";
import type { LoanType } from "../domain/loan.type";
import { createLoanPolicy, getByLoanType, getLoanPoliciesByPage, getLoanPolicyById, updateLoanPolicy } from "./loan.policy.service";
import type { CreateLoanPolicyRequest, UpdateLoanPolicyRequest } from "./loan.policy.type";

export const useCreateLoanPolicy = () => {
  return useMutation({
    mutationKey: ["create-loan-policy"],
    mutationFn: (request: CreateLoanPolicyRequest) => createLoanPolicy(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loan-policies"] });
    },
  });
};

export const useUpdateLoanPolicy = () => {
  return useMutation({
    mutationKey: ["update-loan-policy"],
    mutationFn: (request: UpdateLoanPolicyRequest) => updateLoanPolicy(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loan-policies"] });
    },
  });
};

export const useGetLoanPoliciesWithPagination = (
  paginationDto: PaginationDto,
  loanType: LoanType,
) => {
  return useQuery({
    queryKey: ["loan-policies", paginationDto.page, paginationDto.limit, loanType],
    queryFn: ({ signal }) => getLoanPoliciesByPage(paginationDto, loanType, signal),
    enabled: Number.isFinite(paginationDto.page) && paginationDto.page >= 0 && Number.isFinite(paginationDto.limit) && paginationDto.limit > 0,
  });
};

export const useGetLoanPolicyById = (id: number) => {
  return useQuery({
    queryKey: ["loan-policies", id],
    queryFn: ({ signal }) => getLoanPolicyById(id, signal),
    enabled: Number.isFinite(id) && id > 0,
  });
};

export const useGetLoanPoliciesByLoanType = (loanType: LoanType) => {
  return useQuery({
    queryKey: ["loan-policies", "by-loan-type", loanType],  
    queryFn: ({ signal }) => getByLoanType(loanType, signal),
    enabled: Boolean(loanType),
  });
}
