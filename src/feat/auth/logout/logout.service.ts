import { api, setAccessToken } from "../../../config/axios/api"
import { LOGOUT_URL, ROOT_API_URL } from "../../../shared/constant/constant";

export const logout = async () => {
  await api.post("v1/auth/logout", null, {});
  setAccessToken(null);
  const idToken = sessionStorage.getItem("idToken");
  sessionStorage.removeItem("idToken");
  window.location.replace(`${ROOT_API_URL}/${LOGOUT_URL}?id_token_hint=${encodeURIComponent(idToken ?? "")}`);
  
}
  