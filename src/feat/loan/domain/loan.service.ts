import { api } from "../../../config/axios/api";
import type {
  CreateLoanRequest,
  LoanDto,
  LoanFilter,
  LoanReportDto,
  LoanStatus,
} from "./loan.type";

export const createLoan = async (request: CreateLoanRequest) => {
  const res = await api.post<string>("/v1/loans", request, { toastMessageWhenSuccess: true });
  return res.data ?? null;
};

export const getLoansByFilter = async (filter: LoanFilter, signal?: AbortSignal) => {
  const res = await api.get<LoanDto[]>("/v1/loans", {
    signal,
    params: {
      "paginationDto.page": filter.paginationDto.page,
      "paginationDto.limit": filter.paginationDto.limit,
      "status": filter.status,
      "loanType": filter.loanType,
      "startDate": filter.startDate,
      "endDate": filter.endDate,
    },
  });
  return res.data ?? [];
};

export const getLoanById = async (id: number, signal?: AbortSignal) => {
  const res = await api.get<LoanDto>(`/v1/loans/${id}`, { signal });
  return res.data ?? null;
};

export const getLoanReport = async (loanStatus?: LoanStatus, signal?: AbortSignal) => {
  const res = await api.get<LoanReportDto>("/v1/loans/reports", {
    signal,
    params: { loanStatus },
  });
  return res.data ?? null;
};
