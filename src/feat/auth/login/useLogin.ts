import { useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getMessage } from "./login.service";
import { toast } from "react-toastify";

export const useLogin = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const message = getMessage(searchParams);
  
  useEffect(() => {
    // Populate username field from sessionStorage if available
      const savedUsername = sessionStorage.getItem("username");
      if (savedUsername && usernameRef.current) {
        usernameRef.current.value = savedUsername;
      }

      // Display message if it exists
      if(message){
        if(message.includes("error")) {
          toast.error(message);
        } else {
          toast.success(message);
        }
      }
    }, [message]);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    
    const trimUsername = username.trim();

    if (trimUsername) {
      sessionStorage.setItem("username", trimUsername);
    }
  };

  return {
    usernameRef,
    handleSubmit,
  }
}
