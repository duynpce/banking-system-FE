import { api } from "../../../config/axios/api";
import type { PaginationDto } from "../../../shared/dto/request.dto";
import type { LoanFineType } from "../domain/loan.fine.type";
import type { CreateLoanFinePolicyRequest, LoanFinePolicyDto, UpdateLoanFinePolicyRequest } from "./loan.fine.policy.type";

export const createLoanFinePolicy = async (request: CreateLoanFinePolicyRequest) => {
  const res = await api.post<string>("/v1/loan-fine-policies", request, { toastMessageWhenSuccess: true });
  return res.data ?? null;
};

export const updateLoanFinePolicy = async (request: UpdateLoanFinePolicyRequest) => {
  const res = await api.put<string>("/v1/loan-fine-policies", request, { toastMessageWhenSuccess: true });
  return res.data ?? null;
};

export const getLoanFinePolciesByPage = async (
  paginationDto: PaginationDto,
  loanFineType: LoanFineType,
  signal?: AbortSignal,
) => {
  const res = await api.get<LoanFinePolicyDto[]>("/v1/loan-fine-policies", {
    signal,
    params: {
      "paginationDto.page": paginationDto.page,
      "paginationDto.limit": paginationDto.limit,
      loanFineType,
    },
  });
  return res.data ?? [];
};

export const getLoanFinePolicyById = async (id: number, signal?: AbortSignal) => {
  const res = await api.get<LoanFinePolicyDto>(`/v1/loan-fine-policies/${id}`, { signal });
  return res.data ?? null;
};
