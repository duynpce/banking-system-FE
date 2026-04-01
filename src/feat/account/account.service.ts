import { api } from "../../config/axios/api"
import { getDataFromForm } from "../../shared/utils/util";
import type {AccountDto, BusinessAccountDto, GovernmentAccountDto, PersonalAccountDto, UpdateAccountRequest } from "./account.type";
import { AccountType } from './account.type';

const apiMap = {
    [AccountType.BUSINESS]: "business-accounts",
    [AccountType.PERSONAL]: "personal-accounts",
    [AccountType.GOVERNMENT]: "government-accounts",
  };

export const createAccount = async (formData: FormData, accountType: AccountType) => {
  
  const correspondingApi = apiMap[accountType];
  const data = getDataFromForm(formData);
  return await api.post(`/v1/${correspondingApi}`, data, { toastMessageWhenSuccess: true });

 
}

export const updateAccount = async (formData: FormData, accountType: AccountType) => {
  const correspondingApi = apiMap[accountType];
  const data = getDataFromForm<UpdateAccountRequest>(formData) ;
  return await api.put(`/v1/${correspondingApi}`, data, { toastMessageWhenSuccess: true });
};

export const getAccount = async () => {
  const res = await api.get<AccountDto>("/v1/accounts")
  return res.data ?? null ;
}

export const convertDataToDto = (accountDto: AccountDto) => {
  if(accountDto.type === AccountType.BUSINESS){
    return accountDto as BusinessAccountDto
  } 
  else if(accountDto.type === AccountType.PERSONAL){
    return accountDto as PersonalAccountDto
  }
    else if(accountDto.type === AccountType.GOVERNMENT){
      return accountDto as GovernmentAccountDto
    }
    else{
      throw new Error("Unknown account type");
    }
}

