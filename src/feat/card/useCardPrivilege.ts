import { useMutation, useQuery } from "@tanstack/react-query";
import {
	createCardPrivilege,
	deleteCardPrivilege,
	deleteCardPrivilegeById,
	getCardPrivilegeById,
	getCardPrivileges,
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

export const useGetCardPrivilegesQuery = (query: GetCardPrivilegesQueryRequest) => {
	return useQuery({
		queryKey: ["card-privileges", query.page, query.limit, query.code, query.accountType, query.cardType],
		queryFn: () => getCardPrivileges(query),
		enabled: query.code.trim().length > 0,
	});
};
