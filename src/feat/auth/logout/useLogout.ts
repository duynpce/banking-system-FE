import { useMutation } from "@tanstack/react-query"
import { logout } from "./logout.service";

export const useLogout = () => {
  return useMutation({
    mutationKey: ["logout"],
    mutationFn:  () =>{
      return logout();
    } 
  });
}