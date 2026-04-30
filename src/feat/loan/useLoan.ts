import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../config/userQuery.config";
import type { PaginationDto } from "../../shared/dto/request.dto";
import { createLoanFine, updateLoanFine, getLoanFinesByPage, getLoanFineById } from "./domain/loan.fine.service";
import type { CreateLoanFineRequest, UpdateLoanFineRequest, LoanFineType } from "./domain/loan.fine.type";
import { createLoan, getLoansByFilter, getLoanById, getLoanReport } from "./domain/loan.service";
import type { CreateLoanRequest, LoanStatus, LoanType, LoanFilter } from "./domain/loan.type";
import { createLoanFinePolicy, updateLoanFinePolicy, getLoanFinePolciesByPage, getLoanFinePolicyById } from "./policy/loan.fine.policy.service";
import type { CreateLoanFinePolicyRequest, UpdateLoanFinePolicyRequest } from "./policy/loan.fine.policy.type";
import { createLoanPolicy, updateLoanPolicy, getLoanPoliciesByPage, getLoanPolicyById } from "./policy/loan.policy.service";
import type { CreateLoanPolicyRequest, UpdateLoanPolicyRequest } from "./policy/loan.policy.type";


// Loans
export const useCreateLoan = () => {
  return useMutation({
    mutationKey: ["create-loan"],
    mutationFn: (request: CreateLoanRequest) => createLoan(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
    },
  });
};

export const useGetLoansWithPagination = (
  page: number,
  limit: number,
  status?: LoanStatus,
  loanType?: LoanType,
  startDate?: Date,
  endDate?: Date,
) => {
  const startDateString = startDate ? startDate.toISOString().split("T")[0] : undefined;
  const endDateString = endDate ? endDate.toISOString().split("T")[0] : undefined;

  return useQuery({
    queryKey: ["loans", "pagination", page, limit, status, loanType, startDateString, endDateString],
    queryFn: ({ signal }) =>
      getLoansByFilter(
        {
          paginationDto: { page, limit },
          status,
          loanType,
          startDate: startDateString,
          endDate: endDateString,
        } satisfies LoanFilter,
        signal,
      ),
    enabled: Number.isFinite(page) && page >= 0 && Number.isFinite(limit) && limit > 0,
  });
};

export const useGetLoanById = (id: number) => {
  return useQuery({
    queryKey: ["loans", id],
    queryFn: ({ signal }) => getLoanById(id, signal),
    enabled: Number.isFinite(id) && id > 0,
  });
};

export const useGetLoanReport = (loanStatus?: LoanStatus) => {
  return useQuery({
    queryKey: ["loans", "reports", loanStatus],
    queryFn: ({ signal }) => getLoanReport(loanStatus, signal),
  });
};

// Loan Policies
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

// Loan Fines
export const useCreateLoanFine = () => {
  return useMutation({
    mutationKey: ["create-loan-fine"],
    mutationFn: (request: CreateLoanFineRequest) => createLoanFine(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loan-fines"] });
    },
  });
};

export const useUpdateLoanFine = () => {
  return useMutation({
    mutationKey: ["update-loan-fine"],
    mutationFn: (request: UpdateLoanFineRequest) => updateLoanFine(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loan-fines"] });
    },
  });
};

export const useGetLoanFinesWithPagination = (paginationDto: PaginationDto) => {
  return useQuery({
    queryKey: ["loan-fines", paginationDto.page, paginationDto.limit],
    queryFn: ({ signal }) => getLoanFinesByPage(paginationDto, signal),
    enabled: Number.isFinite(paginationDto.page) && paginationDto.page >= 0 && Number.isFinite(paginationDto.limit) && paginationDto.limit > 0,
  });
};

export const useGetLoanFineById = (id: number) => {
  return useQuery({
    queryKey: ["loan-fines", id],
    queryFn: ({ signal }) => getLoanFineById(id, signal),
    enabled: Number.isFinite(id) && id > 0,
  });
};

// Loan Fine Policies
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
