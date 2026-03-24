import axios from "axios";
import { CALLBACK_URL } from "../../../shared/constant/constant";
import { api, setAccessToken } from "../../../config/axios/api";
import type { NavigateFunction } from "react-router-dom";

export const handleCallback = async (code : string, navigate: NavigateFunction, signal: AbortSignal) => {
      try {
        const res = await api.get<string>(`/${CALLBACK_URL}?code=${encodeURIComponent(code)}`, {
          toastMessageWhenSuccess: "Login successful!",
          signal,
        });

        setAccessToken(res.data);
        navigate("/" , {replace: true});
      } catch(err){
        if (axios.isCancel(err)) {
          return;
        }

        navigate("/login", {replace: true});
      }
    };
  