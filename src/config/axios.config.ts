import 'axios';

declare module 'axios' {

  interface MetaDto{
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number; 
}

export interface ResponseDto<T>{
  success: boolean
  message?: string
  data: T
  metaData?: MetaDto
}

  // override the AxiosInstance type to return our custom ResponseDto
  // T is the expected data type 
  // promise Promise<ResponseDto<T>> --> promise the response  is responseDto with data of type T
  export interface AxiosInstance {
    request<T>(config: AxiosRequestConfig): Promise<ResponseDto<T>>;
    get<T >(url: string, config?: AxiosRequestConfig): Promise<ResponseDto<T>>;
    post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ResponseDto<T>>;
    put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ResponseDto<T>>;
    delete<T>(url: string, config?: AxiosRequestConfig): Promise<ResponseDto<T>>;
  }
}