import { getAlertConfig } from "../../../shared/utils/util";

export const getMessage = (searchparams: URLSearchParams): string => {
  const params = Array.from(searchparams.entries());
  if (params.length === 0) return "";

  const [type, value] = params[0];
  if (!value) return "";
  
  // Handle specific error messages for login
  if(type == "error") {
    if (value === "invalid-credentials") {
      return "error: Not existed account or incorrect password";
    } else if (value === "authentication-failed") {
      return "error: Authentication failed";
    }
  }

  return getAlertConfig(searchparams) || "";
};