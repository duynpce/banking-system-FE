import { api } from "../../../config/axios/api";
import type { PaginationDto } from "../../../shared/dto/request.dto";
import type { LoanType } from "../domain/loan.type";
import type { CreateLoanPolicyRequest, LoanPolicyDto, UpdateLoanPolicyRequest } from "./loan.policy.type";

export const createLoanPolicy = async (request: CreateLoanPolicyRequest) => {
  const res = await api.post<string>("/v1/loan-policies", request, { toastMessageWhenSuccess: true });
  return res.data ?? null;
};

export const updateLoanPolicy = async (request: UpdateLoanPolicyRequest) => {
  const res = await api.put<string>("/v1/loan-policies", request, { toastMessageWhenSuccess: true });
  return res.data ?? null;
};

export const getLoanPoliciesByPage = async (
  paginationDto: PaginationDto,
  loanType: LoanType,
  signal?: AbortSignal,
) => {
  const res = await api.get<LoanPolicyDto[]>("/v1/loan-policies", {
    signal,
    params: {
      "paginationDto.page": paginationDto.page,
      "paginationDto.limit": paginationDto.limit,
      loanType,
    },
  });
  return res.data ?? [];
};

export const getLoanPolicyById = async (id: number, signal?: AbortSignal) => {
  const res = await api.get<LoanPolicyDto>(`/v1/loan-policies/${id}`, { signal });
  return res.data ?? null;
};

export const getByLoanType = async (loanType: LoanType, signal?: AbortSignal) => {
  const res = await api.get<LoanPolicyDto[]>(`/v1/loan-policies`, { signal, params: { loanType } });
  return res.data ?? [];
}
