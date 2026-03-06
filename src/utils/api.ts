import axios from "axios";
import { ROOT_API_URL } from "../shared/constant/constant";

export const api = axios.create({
  baseURL: `${ROOT_API_URL}`,
});