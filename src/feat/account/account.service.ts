import { api } from "../../config/axios/api"
import type {AccountDto, CreateAccountRequest, UpdateAccountRequest} from "./account.type";
import { AccountType } from './account.type';

const apiMap = {
    [AccountType.BUSINESS]: "business-accounts",
    [AccountType.PERSONAL]: "personal-accounts",
    [AccountType.GOVERNMENT]: "government-accounts",
  };

export const createAccount = async (createAccountRequest: CreateAccountRequest) => {
  
  const correspondingApi = apiMap[createAccountRequest.type];
  return await api.post(`/v1/${correspondingApi}`, createAccountRequest, { toastMessageWhenSuccess: true });

 
}

export const updateAccount = async (updateAccountRequest: UpdateAccountRequest) => {
  const correspondingApi = apiMap[updateAccountRequest.type];
  return await api.put(`/v1/${correspondingApi}`, updateAccountRequest, { toastMessageWhenSuccess: true });
};

export const getAccount = async (signal?: AbortSignal) => {
  const res = await api.get<AccountDto>("/v1/accounts", { signal });
  return res.data ?? null ;
}

export const getAccountNameByAccountNumber = async (accountNumber: string, signal?: AbortSignal) => {
    const res = await api.get<string>(`/v1/accounts/account-number/${accountNumber}`, { signal });
    return res.data ;
}

