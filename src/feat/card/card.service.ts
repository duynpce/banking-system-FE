import { api } from "../../config/axios/api"
import { AccountType} from "../account/account.type";
import type {  CardDto, CreateCardRequest } from "./card.type";

export const apiMap = {
  [AccountType.BUSINESS]: "business-cards",
  [AccountType.PERSONAL]: "personal-cards",
  [AccountType.GOVERNMENT]: null,// Government accounts do not have cards , validation for this is done in the schema level
}

export const createCard = async(createCardRequest: CreateCardRequest) => {

  const correspondingApi = apiMap[createCardRequest.forAccountType];
  return await api.post(`/v1/${correspondingApi}`, createCardRequest, { toastMessageWhenSuccess: true });
  
}

export const getCard = async(signal?: AbortSignal) => {
  const res = await api.get<CardDto>("/v1/cards/first", { signal }); 
  return res.data ?? null ;
}

export const getCards = async(page: number, limit: number, signal?: AbortSignal) => {
  const res = await api.get<CardDto[]>("/v1/cards", {
    signal,
    params: { page, limit }
  });
  return res ?? [] ;
}

