
export const getErrorMessage = (error: string | null): string => {
    if (!error) return "";
    if (error === "invalid-credentials") {
      return "Not existed account or incorrect password";
    } else if (error === "authentication-failed") {
      return "Authentication failed";
    } else {  
      return "unknown error";
    }
  };