import { api } from "../../config/axios/api"
import type {AccountDto, CreateAccountRequest, UpdateAccountRequest} from "./account.type";
import { AccountType } from './account.type';
import { type UniqueDetailObj } from "../../shared/types/unique-detail.type";
import _ from "lodash";

export type UniqueField = "username" | "email" | "phoneNumber" | "idCardNumber" | "taxIdNumber";
export type UniqueDetail = Record<UniqueField, UniqueDetailObj>;

const apiMap = {
    [AccountType.BUSINESS]: "business-accounts",
    [AccountType.PERSONAL]: "personal-accounts",
    [AccountType.GOVERNMENT]: "government-accounts",
  };

export const uniqueDetailsMap = {
  username: "accounts",
  phoneNumber: "accounts",
  email: "accounts",
  idCardNumber: "personal-accounts",
  taxIdNumber: "business-accounts",
};

export const createAccount = async (createAccountRequest: CreateAccountRequest) => {
  
  const correspondingApi = apiMap[createAccountRequest.type];
  return await api.post(`/v1/${correspondingApi}`, createAccountRequest, { toastMessageWhenSuccess: true });

 
}

export const updateAccount = async (updateAccountRequest: UpdateAccountRequest) => {
  const correspondingApi = apiMap[updateAccountRequest.type];
  return await api.put(`/v1/${correspondingApi}`, updateAccountRequest, { toastMessageWhenSuccess: true });
};

export const editPassword = async(currentPassword: string, newPassword: string) => {
  return await api.put(`/v1/accounts/password`, { currentPassword, newPassword }, { toastMessageWhenSuccess: true });
}

export const checkUniqueField = async (fieldName: UniqueField, value: string) => {
  if (!(fieldName in uniqueDetailsMap)) {
    throw new Error(`Field ${fieldName} is not a unique field`);
  }

  if (!value) {
    return false;
  }

  const correspondingApi = uniqueDetailsMap[fieldName];
  const exists = (
    await api.get<boolean>(`/v1/${correspondingApi}/exists/${_.kebabCase(fieldName)}/${value}`)
  ).data;

  return exists;
};

export const getAccount = async (signal?: AbortSignal) => {
  const res = await api.get<AccountDto>("/v1/accounts", { signal });
  return res.data ?? null ;
}

export const getAccountNameByAccountNumber = async (accountNumber: string, signal?: AbortSignal) => {
    const res = await api.get<string>(`/v1/accounts/account-number/${accountNumber}`, { signal });
    return res.data ;
}

