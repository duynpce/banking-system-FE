import { useMutation, useQuery } from "@tanstack/react-query";
import {
	createCardPrivilege,
	deleteCardPrivilege,
	deleteCardPrivilegeById,
	getCardPrivilegeById,
	getCardPrivilegesByCardTypeAndAccountTypeQuery,
	getCardPrivilegesByCodeAndAccountTypeAndCardTypeQuery,
	getCardPrivilegesWithPagination,
	updateCardPrivilege,
} from "./card.privilege.service";
import type {
	CreateCardPrivilegeRequest,
	DeleteCardPrivilegeRequest,
	GetCardPrivilegesQueryRequest,
	UpdateCardPrivilegeRequest,
} from "./card.privilege.type";

export const useCreateCardPrivilege = () => {
	return useMutation({
		mutationKey: ["create-card-privilege"],
		mutationFn: (createCardPrivilegeRequest: CreateCardPrivilegeRequest) =>
			createCardPrivilege(createCardPrivilegeRequest),
	});
};

export const useUpdateCardPrivilege = () => {
	return useMutation({
		mutationKey: ["update-card-privilege"],
		mutationFn: (updateCardPrivilegeRequest: UpdateCardPrivilegeRequest) =>
			updateCardPrivilege(updateCardPrivilegeRequest),
	});
};

export const useDeleteCardPrivilege = () => {
	return useMutation({
		mutationKey: ["delete-card-privilege"],
		mutationFn: (deleteCardPrivilegeRequest: DeleteCardPrivilegeRequest) =>
			deleteCardPrivilege(deleteCardPrivilegeRequest),
	});
};

export const useDeleteCardPrivilegeById = () => {
	return useMutation({
		mutationKey: ["delete-card-privilege-by-id"],
		mutationFn: (id: number) => deleteCardPrivilegeById(id),
	});
};

export const useGetCardPrivilegeByIdQuery = (id: number) => {
	return useQuery({
		queryKey: ["card-privilege", id],
		queryFn: () => getCardPrivilegeById(id),
		enabled: Number.isFinite(id) && id >= 0,
	});
};

export const useGetCardPrivilegesByCodeAndAccountTypeAndCardTypeQuery = (request: GetCardPrivilegesQueryRequest) => {
	return useQuery({
		queryKey: ["card-privileges", request.code, request.accountType, request.cardType],
		queryFn: () => getCardPrivilegesByCodeAndAccountTypeAndCardTypeQuery(request),
		enabled: request.code.trim().length > 0,
	});
};

export const useGetCardPrivilegesByAccountTypeAndCardTypeQuery = (accountType: string, cardType: string) => {
	return useQuery({
		queryKey: ["card-privileges", accountType, cardType],
		queryFn: () => getCardPrivilegesByCardTypeAndAccountTypeQuery(accountType, cardType),
		enabled: accountType.trim().length > 0 && cardType.trim().length > 0,
	});
}

export const useGetCardPrivilegesQueryWithPagination = ( page: number, limit: number) => {
	return useQuery({
		queryKey: ["card-privileges", page, limit],
		queryFn: () => getCardPrivilegesWithPagination(page, limit),
		enabled: Number.isFinite(page) && page >= 0 && Number.isFinite(limit) && limit > 0,
	});
}


