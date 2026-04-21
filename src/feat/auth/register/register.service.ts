import { api } from "../../../config/axios/api";
import { type UniqueDetailObj } from "../../../shared/types/unique-detail.type";
import _ from "lodash";

// Types
export type UniqueField = "username" | "email" | "phoneNumber" | "idCardNumber" | "taxIdNumber";
export type UniqueDetail = Record<UniqueField, UniqueDetailObj>;


// Unique details mapping to check which endpoint to use for validation
export const uniqueDetailsMap = {
  "username": "accounts",
  "phoneNumber": "accounts",
  "email": "accounts",
  "idCardNumber": "personal-accounts",
  "taxIdNumber": "business-accounts"
};

export const checkUniqueField = async (
  fieldName: string,
  value: string
) => {
  if (!(fieldName in uniqueDetailsMap)) {
    throw new Error(`Field ${fieldName} is not a unique field`);
  }

  if(!value) {
    return;
  }

  const correspondingApi = uniqueDetailsMap[fieldName as keyof typeof uniqueDetailsMap];
  const exists = (
    await api.get<boolean>(`/v1/${correspondingApi}/exists/${_.kebabCase(fieldName)}/${value}`)
  ).data;

  return exists;
};
