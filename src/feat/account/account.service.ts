import { api } from "../../config/axios/api"
import type {AccountDto, BusinessAccountDto, GovernmentAccountDto, PersonalAccountDto , CreateAccountRequest, UpdateAccountRequest} from "./account.type";
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

