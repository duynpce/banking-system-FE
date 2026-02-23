import { useEffect } from "react";
import { CALLBACK_URI, ROOT_API_URL } from "../../shared/Constant";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

const CallBack = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const controller = new AbortController();
    const signal = controller.signal;
    
    if (!code) {
      navigate("/login");
      return;
    }

    const handleCallback = async () => {
      try {
        
        const res = await axios.get(
          `${ROOT_API_URL}/${CALLBACK_URI}?code=${encodeURIComponent(code)}`,{signal}
        );

        axios.defaults.headers.common["Authorization"] =`Bearer ${res.data}`;
        alert("success");

        navigate("/");
      } catch(err){
        const error = err as AxiosError

        if (error.name === "AbortError" ||error.name === "CanceledError" || error.code === "ERR_CANCELED") {
          return;
        }

        navigate("/login");
      }
    };

    handleCallback();
    
    return () => {
      controller.abort();
    }
  },[navigate]);

  return null;
}

export default CallBack;