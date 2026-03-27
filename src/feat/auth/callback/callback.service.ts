import { CALLBACK_URL } from "../../../shared/constant/constant";
import { api, setAccessToken } from "../../../config/axios/api";
import type { NavigateFunction } from "react-router-dom";

export interface CallbackDto{
 accessToken: string;
 idToken: string;
}

export const handleCallback = async (code : string, navigate: NavigateFunction, signal: AbortSignal) => {
      try {
        const res = await api.get<CallbackDto>(`/${CALLBACK_URL}?code=${encodeURIComponent(code)}`, {
          toastMessageWhenSuccess: true,
          signal,
        });
        setAccessToken(res.data.accessToken);
        sessionStorage.setItem("idToken", res.data.idToken);

        const Path = sessionStorage.getItem("previousPath") || "/";
        sessionStorage.removeItem("previousPath"); 
        navigate(Path, { replace: true });
      } catch{
        if(signal.aborted) {
          return;
        }

        navigate("/login", {replace: true});
      }
    };
  