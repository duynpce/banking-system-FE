import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleCallback } from "./callback.service";

const CallBack = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const controller = new AbortController();
    const signal = controller.signal;
    
    if (!code) {
      navigate("/login", {replace: true});  
      return;
    }


    handleCallback(code ,navigate, signal);
    
    return () => {
      controller.abort();
    }
  },[navigate]);

  return null;
}

export default CallBack;