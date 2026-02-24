import axios, { AxiosError } from "axios";
import { AccountType } from "../../types/AccountType";
import { ROOT_API_URL } from "../../shared/Constant";
import { toKebab } from "../../utils/util";
import { type UniqueDetailObj } from "../../types/UniqueDetailObj";

// Types
export type UniqueField = "username" | "email" | "phoneNumber" | "idCardNumber" | "taxIdNumber";
export type UniqueDetail = Record<UniqueField, UniqueDetailObj>;

export const apiMap = {
  [AccountType.BUSINESS]: "business-accounts",
  [AccountType.PERSONAL]: "personal-accounts",
  [AccountType.GOVERNMENT]: "government-accounts",
};

// Unique details mapping to check which endpoint to use for validation
export const uniqueDetailsMap = {
  "username": "accounts",
  "phoneNumber": "accounts",
  "email": "accounts",
  "idCardNumber": "personal-accounts",
  "taxIdNumber": "business-accounts"
};

export const handleRegister = async (
  accountType: AccountType,
  formData: FormData
): Promise<string> => {
  const correspondingApi = apiMap[accountType];
  const data = Object.fromEntries(formData.entries());
  
  try {
    const res = await axios.post(`${ROOT_API_URL}/v1/${correspondingApi}`, data);
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    throw new Error(error.message);
  }
};

export const checkUniqueField = async (
  fieldName: string,
  value: string
): Promise<boolean> => {
  if (!(fieldName in uniqueDetailsMap)) {
    throw new Error(`Field ${fieldName} is not a unique field`);
  }

  const correspondingApi: string = uniqueDetailsMap[fieldName as keyof typeof uniqueDetailsMap];

  try {
    const exists: boolean = (
      await axios.get(`${ROOT_API_URL}/v1/${correspondingApi}/exists/${toKebab(fieldName)}/${value}`)
    ).data;
    return exists;
  } catch (err) {
    const error = err as AxiosError;
    throw new Error(error.message);
  }
};
