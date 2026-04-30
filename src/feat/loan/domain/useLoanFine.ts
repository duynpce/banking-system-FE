import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../config/userQuery.config";
import type { PaginationDto } from "../../../shared/dto/request.dto";
import { createLoanFine, getLoanFineById, getLoanFinesByPage, updateLoanFine } from "./loan.fine.service";
import type { CreateLoanFineRequest, UpdateLoanFineRequest } from "./loan.fine.type";

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
