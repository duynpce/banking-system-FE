import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipGlobalErrorHandler?: boolean;
  }

  export interface InternalAxiosRequestConfig {
    skipGlobalErrorHandler?: boolean;
    _retry?: boolean;
  }
}
