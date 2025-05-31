import axios from 'axios'; 
import type { 
  AxiosInstance,
  AxiosResponse, 
  AxiosError, 
  InternalAxiosRequestConfig, 
  AxiosHeaders 
} from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import { useAuthStore } from '../store/authStore'; 

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
    const token = useAuthStore.getState().token; 
    if (token) {
      
      
      (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => {
    
    return Promise.reject(error);
  }
);


apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error("API Error: Unauthorized (401). Token might be invalid or expired.");
      
      
      
      
    }
    return Promise.reject(error);
  }
);

export default apiClient;
