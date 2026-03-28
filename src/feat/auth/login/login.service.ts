import { getAlertConfig } from "../../../shared/utils/util";

export const getMessage = (searchparams?: URLSearchParams): string => {
  if (!searchparams) return "";

  const params = Array.from(searchparams.entries());
  if (params.length === 0) return "";

  const [type, value] = params[0];
  if (!value) return "";

  if (type === "error") {
    if (value === "invalid-credentials") {
      return "Not existed account or incorrect password";
    } else if (value === "authentication-failed") {
      return "Authentication failed";
    }
  }

  return getAlertConfig(searchparams) || "";
};