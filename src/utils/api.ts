import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ROOT_API_URL } from "../shared/constant/constant";
import { toast } from "react-toastify";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipGlobalErrorHandler?: boolean;
};

let accessToken: string | null = null;

// Use a separate client for refresh to avoid recursive interceptor calls.
const refreshApi = axios.create({
  baseURL: `${ROOT_API_URL}`,
  withCredentials: true,
});

export const setAccessToken = (token: string) => {
  accessToken = token;
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
};

export const api = axios.create({
  baseURL: `${ROOT_API_URL}`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {

    // becasue api will return AxiosResponse<ResponseDto<T>>
    // response.data is to take out the ResponseDto<T>
    return response.data;
  },
  // Global error handler for API responses.
  async (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const skipGlobalErrorHandler = Boolean(originalRequest?.skipGlobalErrorHandler);
    
    // If the request config has skipGlobalErrorHandler set, bypass the global error handling logic.
    if (skipGlobalErrorHandler) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Retry at most once after refresh to prevent infinite loops.
      originalRequest._retry = true;

      try {
        const res = await refreshApi.post<string>("/v1/auth/refresh-token");
        setAccessToken(res.data);

        // Remove stale per-request auth header so defaults can apply the new token.
        if (originalRequest.headers) {
          delete (originalRequest.headers as Record<string, string>).Authorization;
        }

        return api(originalRequest);
      } catch {
        delete api.defaults.headers.common["Authorization"];
        accessToken = null;
        window.location.assign("/login");
      }
    } else if (error.response?.status === 403) {
      toast.error("You don't have permission to access this resource.");
    } else if(error.response?.status === 408) {
      toast.error("Request timeout. Please try again.");  
    } else {
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    }
  }
);