import { toast } from "react-toastify";
import { api } from "../../config/api"
import type { MyCardData } from "./Mycard"

export const getCard = async() => {
  try {
    const res = await api.get<MyCardData>("/v1/card/first", { skipGlobalErrorHandler: true });
    return res.data ;  
  } catch {
    toast.error("Failed to fetch card data");
  }
  
}
