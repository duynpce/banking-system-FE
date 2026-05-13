import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ROOT_API_URL } from "../../shared/constant/constant";
import { toast } from "react-toastify";
import type { getTokenDto } from "../../feat/auth/callback/callback.service";
import qs from 'qs';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipGlobalErrorHandler?: boolean;

  //string --> toast that string, true --> toast res's message 
  toastMessageWhenSuccess?: boolean | string | null; 
};

let accessToken: string | null = null;

// Use a separate client for refresh to avoid recursive interceptor calls.
const refreshApi = axios.create({
  baseURL: `${ROOT_API_URL}`,
  withCredentials: true,
});

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const api = axios.create({
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: 'repeat', allowDots: true });
  },
  baseURL: `${ROOT_API_URL}`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }
  else{
    config.headers.delete("Authorization");
  }

  return config;
});
    
refreshApi.interceptors.response.use(
  (response) => {   

    // becasue api will return AxiosResponse<ResponseDto<T>>
    // response.data is to take out the ResponseDto<T>
    return response.data;
  }
);


api.interceptors.response.use(
  (response) => {   

    const originalRequest = response.config as RetryableRequestConfig | undefined;
    const toastMessageWhenSuccess = originalRequest?.toastMessageWhenSuccess ?? null;
    if (toastMessageWhenSuccess) {
      // Use provided string; fall back to API response message for boolean true.
      const successMessage = typeof toastMessageWhenSuccess === "string"
        ? toastMessageWhenSuccess
        : response.data?.message;

      if (successMessage) {
        toast.success(successMessage);
      }
    }
    // becasue api will return AxiosResponse<ResponseDto<T>>
    // response.data is to take out the ResponseDto<T>
    return response.data;
  },
  // Global error handler for API responses.
  async (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const skipGlobalErrorHandler = Boolean(originalRequest?.skipGlobalErrorHandler);
    
    // If the request config has skipGlobalErrorHandler set, by pass the global error handling logic.
    if (skipGlobalErrorHandler) {
      return Promise.reject(error);
    }


    if (error.response?.status === 401 && originalRequest) {
      // Retry at most once after refresh to prevent infinite loops.
      
      
      if(originalRequest._retry) {
        toast.error("expried sesssion or not logged in", {
          toastId: "session-expired",
          onClose: () => window.location.assign("/login"),
          autoClose: 2000, 
        });
        delete api.defaults.headers.common["Authorization"];
        setAccessToken(null);
        sessionStorage.setItem("previousPath", window.location.pathname);
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const res = await refreshApi.post<getTokenDto>("/v1/auth/refresh-token",null);
      
        setAccessToken(res.data.accessToken);
        sessionStorage.setItem("idToken", res.data.idToken);

        // Remove stale per-request auth header so interceptor can apply the new token.
        if (originalRequest.headers) {
          delete (originalRequest.headers as Record<string, string>).Authorization;
        }

        return api(originalRequest);
      } catch (refreshError) {
        toast.error("expried sesssion or not logged in", {
          toastId: "session-expired",
          onClose: () => window.location.assign("/login"),
          autoClose: 2000,
        });
        delete api.defaults.headers.common["Authorization"];
        setAccessToken(null);
        sessionStorage.setItem("previousPath", window.location.pathname);
        return Promise.reject(refreshError);
      }
     
    } else if (error.response?.status === 403 && !error.response.data.message) {
      toast.error("You don't have permission to access this resource.", {
        toastId: "forbidden-error",
      });
    } else if(error.response?.status === 408) {
      toast.error("Request timeout. Please try again.", {
        toastId: "timeout-error",
      });  
    }
    else if(axios.isCancel(error)) {
      Promise.reject(error);
    }
    else if (error.code === 'ERR_NETWORK') {
      toast.error("Please check your connection.",{
        toastId: "network-error",
      });
    }
    else {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.", {
          toastId: "generic-error",
        }
      );
    }

    return Promise.reject(error);
  }
);