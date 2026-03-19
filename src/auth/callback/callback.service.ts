import axios from "axios";
import { CALLBACK_URL } from "../../shared/constant/constant";
import { api, setAccessToken } from "../../utils/api";
import type { NavigateFunction } from "react-router-dom";
import { toast } from "react-toastify";

export const handleCallback = async (code : string, navigate: NavigateFunction, signal: AbortSignal) => {
      try {
        const res = await api.get<string>(`/${CALLBACK_URL}?code=${encodeURIComponent(code)}`, {skipGlobalErrorHandler: true, signal});

        setAccessToken(res.data);
        toast.success("Login successful!");
        navigate("/" , {replace: true});
      } catch(err){
        if (axios.isCancel(err)) {
          toast.error("Request canceled.");
          return;
        }

        navigate("/login", {replace: true});
      }
    };
  