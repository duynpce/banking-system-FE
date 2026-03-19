import { useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getErrorMessage } from "./login.service";

export const useLogin = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const message = getErrorMessage(searchParams.get("error"));
  
  useEffect(() => {
      const savedUsername = sessionStorage.getItem("username");
      if (savedUsername && usernameRef.current) {
        usernameRef.current.value = savedUsername;
      }
    }, []);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    
    const trimUsername = username.trim();

    if (trimUsername) {
      sessionStorage.setItem("username", trimUsername);
    }
  };

  return {
    message,
    usernameRef,
    handleSubmit,
  }
}
