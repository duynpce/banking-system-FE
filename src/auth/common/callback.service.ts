import { AxiosError } from "axios";
import { CALLBACK_URL } from "../../shared/constant/constant";
import { api } from "../../utils/api";
import type { NavigateFunction } from "react-router-dom";

  export const handleCallback = async (code : string, navigate: NavigateFunction, signal: AbortSignal) => {
      try {
        
        const res = await api.get(
          `/${CALLBACK_URL}?code=${encodeURIComponent(code)}`,{signal}
        );

        //temp
        api.defaults.headers.common["Authorization"] =`Bearer ${res.data}`;

        navigate("/");
      } catch(err){
        const error = err as AxiosError

        if (error.name === "AbortError" ||error.name === "CanceledError" || error.code === "ERR_CANCELED") {
          return;
        }

        navigate("/login");
      }
    };
  