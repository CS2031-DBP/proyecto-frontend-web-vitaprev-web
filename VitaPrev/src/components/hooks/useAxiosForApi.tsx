import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import constants from "../common/constants";
import { useAuth } from "../auth/useAuth";
import { useEffect, useRef } from "react";

export function useAxiosForApi() {
  const { token, logout } = useAuth();


  const controllerRef = useRef<AbortController | null>(null);

  // Creamos la instancia local de axios
  const axiosApi = axios.create({
    baseURL: constants.API_HOST,
    withCredentials: true,
  });

  axiosApi.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Attach token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Crear un nuevo controlador para esta request
      controllerRef.current = new AbortController();
      config.signal = controllerRef.current.signal;

      return config;
    },
    (error) => Promise.reject(error)
  );


  axiosApi.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      // Si la solicitud fue cancelada, no tratamos esto como error
      if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
        return Promise.reject(error);
      }

      // Manejo de 401
      if (error.response?.status === 401) {
        logout();
      }

      return Promise.reject(error);
    }
  );


  useEffect(() => {
    return () => {
      // Cancela la request activa si el componente se desmonta
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  return [axiosApi] as const;
}
