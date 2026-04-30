import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../config/userQuery.config";
import { createLoan, getLoanById, getLoanReport, getLoansByFilter } from "./loan.service";
import type { CreateLoanRequest, LoanFilter, LoanStatus, LoanType } from "./loan.type";

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


