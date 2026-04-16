import { api } from "../../config/axios/api";
import type {
	CardPrivilegeDto,
	CreateCardPrivilegeRequest,
	DeleteCardPrivilegeRequest,
	GetCardPrivilegesQueryRequest,
	UpdateCardPrivilegeRequest,
} from "./card.privilege.type";

export const createCardPrivilege = async (createCardPrivilegeRequest: CreateCardPrivilegeRequest) => {
	return await api.post<string>("/v1/card-privileges", createCardPrivilegeRequest, {
		toastMessageWhenSuccess: true,
	});
	
};

export const updateCardPrivilege = async (updateCardPrivilegeRequest: UpdateCardPrivilegeRequest) => {
	return await api.put<string>("/v1/card-privileges", updateCardPrivilegeRequest, {
		toastMessageWhenSuccess: true,
	});
	
};

export const getCardPrivilegesByCodeAndAccountTypeAndCardTypeQuery = async (request: GetCardPrivilegesQueryRequest) => {
	const res = await api.get<CardPrivilegeDto>("/v1/card-privileges", {
		params: request,
	});
	return res.data ?? [];
};

export const getCardPrivilegeById = async (id: number) => {
	const res = await api.get<CardPrivilegeDto>(`/v1/card-privileges/${id}`);
	return res.data ?? null;
};

export const getCardPrivilegesWithPagination = async (page: number, limit: number) => {
	const res = await api.get<CardPrivilegeDto[]>("/v1/card-privileges", {
		params: { page, limit },
	});
	return res.data ?? [];
};

export const getCardPrivilegesByCardTypeAndAccountTypeQuery = async (accountType: string, cardType: string) => {
	const res = await api.get<CardPrivilegeDto[]>("/v1/card-privileges", {
		params: { accountType, cardType },
	});
	return res.data ?? [];
}

export const deleteCardPrivilege = async (request: DeleteCardPrivilegeRequest) => {
	const res = await api.delete<string>("/v1/card-privileges", {
		params: request,
		toastMessageWhenSuccess: true,
	});
	return res.data ?? null;
};

export const deleteCardPrivilegeById = async (id: number) => {
	const res = await api.delete<string>(`/v1/card-privileges/${id}`, {
		toastMessageWhenSuccess: true,
	});
	return res.data ?? null;
};
