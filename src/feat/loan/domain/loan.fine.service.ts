import { api } from "../../../config/axios/api";
import type { PaginationDto } from "../../../shared/dto/request.dto";
import type { CreateLoanFineRequest, LoanFineDto, UpdateLoanFineRequest } from "./loan.fine.type";

export const createLoanFine = async (request: CreateLoanFineRequest) => {
  const res = await api.post<string>("/v1/loan-fines", request, { toastMessageWhenSuccess: true });
  return res.data ?? null;
};

export const updateLoanFine = async (request: UpdateLoanFineRequest) => {
  const res = await api.put<string>("/v1/loan-fines", request, { toastMessageWhenSuccess: true });
  return res.data ?? null;
};

export const getLoanFinesByPage = async (paginationDto: PaginationDto, signal?: AbortSignal) => {
  const res = await api.get<LoanFineDto[]>("/v1/loan-fines", {
    signal,
    params: {
      "paginationDto.page": paginationDto.page,
      "paginationDto.limit": paginationDto.limit,
    },
  });
  return res.data ?? [];
};

export const getLoanFineById = async (id: number, signal?: AbortSignal) => {
  const res = await api.get<LoanFineDto>(`/v1/loan-fines/${id}`, { signal });
  return res.data ?? null;
};
