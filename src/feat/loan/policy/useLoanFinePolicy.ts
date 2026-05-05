import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../config/userQuery.config";
import type { PaginationDto } from "../../../shared/dto/request.dto";
import type { LoanFineType } from "../domain/loan.fine.type";
import { createLoanFinePolicy, getLoanFinePolicyById, getLoanFinePolciesByPage, updateLoanFinePolicy } from "./loan.fine.policy.service";
import type { CreateLoanFinePolicyRequest, UpdateLoanFinePolicyRequest } from "./loan.fine.policy.type";

export const useCreateLoanFinePolicy = () => {
  return useMutation({
    mutationKey: ["create-loan-fine-policy"],
    mutationFn: (request: CreateLoanFinePolicyRequest) => createLoanFinePolicy(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loan-fine-policies"] });
    },
  });
};

export const useUpdateLoanFinePolicy = () => {
  return useMutation({
    mutationKey: ["update-loan-fine-policy"],
    mutationFn: (request: UpdateLoanFinePolicyRequest) => updateLoanFinePolicy(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loan-fine-policies"] });
    },
  });
};

export const useGetLoanFinePolciesWithPagination = (
  paginationDto: PaginationDto,
  loanFineType: LoanFineType,
) => {
  return useQuery({
    queryKey: ["loan-fine-policies", paginationDto.page, paginationDto.limit, loanFineType],
    queryFn: ({ signal }) => getLoanFinePolciesByPage(paginationDto, loanFineType, signal),
    enabled: Number.isFinite(paginationDto.page) && paginationDto.page >= 0 && Number.isFinite(paginationDto.limit) && paginationDto.limit > 0,
  });
};

export const useGetLoanFinePolicyById = (id: number) => {
  return useQuery({
    queryKey: ["loan-fine-policies", id],
    queryFn: ({ signal }) => getLoanFinePolicyById(id, signal),
    enabled: Number.isFinite(id) && id > 0,
  });
};
