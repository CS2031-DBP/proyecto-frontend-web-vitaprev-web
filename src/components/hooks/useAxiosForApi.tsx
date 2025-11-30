import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import constants from "../common/constants";
import { useAuth } from "../auth/useAuth";
import { useEffect, useRef } from "react";

export function useAxiosForApi() {
  const { token, logout } = useAuth();


  const controllerRef = useRef<AbortController | null>(null);


  const axiosApi = axios.create({
    baseURL: constants.API_HOST,
    withCredentials: true,
  });

  axiosApi.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
    
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

 
      controllerRef.current = new AbortController();
      config.signal = controllerRef.current.signal;

      return config;
    },
    (error) => Promise.reject(error)
  );


  axiosApi.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
     
      if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
        return Promise.reject(error);
      }

      if (error.response?.status === 401) {
        logout();
      }

      return Promise.reject(error);
    }
  );


  useEffect(() => {
    return () => {

      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  return [axiosApi] as const;
}
