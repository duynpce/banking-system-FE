import { api } from "../../config/axios/api"
import { AccountType} from "../account/account.type";
import type {  CardDto, CreateCardRequest } from "./card.type";

export const apiMap = {
  [AccountType.BUSINESS]: "business-cards",
  [AccountType.PERSONAL]: "personal-cards",
  [AccountType.GOVERNMENT]: null,// Government accounts do not have cards , validation for this is done in the schema level
}

export const createCard = async(createCardRequest: CreateCardRequest, accountType: AccountType) => {

  const correspondingApi = apiMap[accountType];
  const res = await api.post(`/v1/${correspondingApi}`, createCardRequest, { toastMessageWhenSuccess: true });
  return res.data ?? null ;
}

export const getCard = async() => {
  const res = await api.get<CardDto>("/v1/cards/first"); 
  return res.data ?? null ;
}

export const getCards = async(page: number, limit: number) => {
  const res = await api.get<CardDto[]>("/v1/cards", {
    params: { page, limit }
  });
  return res.data ?? null ;
}

