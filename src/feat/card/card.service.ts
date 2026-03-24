import { api } from "../../config/axios/api"
import { AccountType, type AccountDto } from "../account/account.type";
import { getTrimmedDataFromForm } from "../../shared/utils/util";
import type {  CardDto } from "./card.type";
import { queryClient } from "../../config/userQuery.config";

export const apiMap = {
  [AccountType.BUSINESS]: "business-cards",
  [AccountType.PERSONAL]: "personal-cards",
  [AccountType.GOVERNMENT]: null,// Government accounts do not have cards
}

export const createCard = async(formData: FormData) => {
  const data = getTrimmedDataFromForm(formData);
  const {type: accountType} = queryClient.getQueryData(["my-account"]) as AccountDto;
  const correspondingApi = apiMap[accountType];
  
  if (!correspondingApi) {
    throw new Error("government accounts do not support card creation");
  }

  const res = await api.post(`/v1/${correspondingApi}`, data);
  return res.data ;
}

export const getCard = async() => {
  const res = await api.get<CardDto>("/v1/cards/first");
  return res.data ;
}

export const getCards = async(page: number, limit: number) => {
  const res = await api.get<CardDto[]>("/v1/cards", {
    params: { page, limit }
  });
  return res.data ;
}

