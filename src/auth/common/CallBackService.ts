import axios, { AxiosError } from "axios";
import { ROOT_API_URL, CALLBACK_URL } from "../../shared/Constant";
import type { NavigateFunction } from "react-router-dom";

  export const handleCallback = async (code : string, navigate: NavigateFunction, signal: AbortSignal) => {
      try {
        
        const res = await axios.get(
          `${ROOT_API_URL}/${CALLBACK_URL}?code=${encodeURIComponent(code)}`,{signal}
        );

        //temp
        axios.defaults.headers.common["Authorization"] =`Bearer ${res.data}`;

        navigate("/");
      } catch(err){
        const error = err as AxiosError

        if (error.name === "AbortError" ||error.name === "CanceledError" || error.code === "ERR_CANCELED") {
          return;
        }

        navigate("/login");
      }
    };
  