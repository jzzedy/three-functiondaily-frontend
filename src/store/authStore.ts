import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; 
import apiClient from '../services/apiService'; 
interface User { 
  id: string;
  email: string;
  username?: string | null;
}
interface PasswordActionResponse {
    success: boolean;
    message: string;
}
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean; 
  error: string | null; 

  isPasswordResetLoading: boolean; 
  passwordResetError: string | null;
  passwordResetSuccessMessage: string | null;

  login: (email: string, password: string) => Promise<boolean>; 
  register: (email: string, password: string, username?: string) => Promise<boolean>; 
  logout: () => void;
  fetchCurrentUser: () => Promise<void>; 
  requestPasswordReset: (email: string) => Promise<PasswordActionResponse>; 
  resetPassword: (token: string, newPassword: string) => Promise<PasswordActionResponse>;
  clearAuthError: () => void;
  clearPasswordResetMessages: () => void; 
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isPasswordResetLoading: false,
      passwordResetError: null,
      passwordResetSuccessMessage: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null, passwordResetError: null, passwordResetSuccessMessage: null });
        try {
          const response = await apiClient.post('/auth/login', { email, password });
          const { user, token } = response.data;
          set({ 
            isAuthenticated: true, 
            user, 
            token, 
            isLoading: false, 
            error: null 
          });
          return true;
        } catch (err: unknown) { 
          let errorMessage = 'Login failed. Please try again.';
          if (typeof err === "object" && err !== null && "response" in err) {
            const responseError = err.response as { data?: { message?: string } };
            if (responseError.data?.message) { errorMessage = responseError.data.message; }
          } else if (err instanceof Error) { errorMessage = err.message; }
          set({ isLoading: false, error: errorMessage, isAuthenticated: false, user: null, token: null });
          return false;
        }
      },

      register: async (email, password, username) => {
        set({ isLoading: true, error: null, passwordResetError: null, passwordResetSuccessMessage: null });
        try {
          const response = await apiClient.post('/auth/register', { email, password, username });
          const { user, token } = response.data;
          set({ 
            isAuthenticated: true, 
            user, 
            token, 
            isLoading: false, 
            error: null 
          });
          return true;
        } catch (err: unknown) { 
          let errorMessage = 'Registration failed. Please try again.';
           if (typeof err === "object" && err !== null && "response" in err) {
            const responseError = err.response as { data?: { message?: string } };
            if (responseError.data?.message) { errorMessage = responseError.data.message; }
          } else if (err instanceof Error) { errorMessage = err.message; }
          set({ isLoading: false, error: errorMessage, isAuthenticated: false, user: null, token: null });
          return false;
        }
      },

      logout: () => {
        set({ 
          isAuthenticated: false, 
          user: null, 
          token: null, 
          error: null, 
          isLoading: false,
          passwordResetError: null,
          passwordResetSuccessMessage: null 
        });
      },

      fetchCurrentUser: async () => {
        const token = get().token;
        if (!token) {
            set({ isAuthenticated: false, user: null, token: null, isLoading: false });
            return;
        }
        set({ isLoading: true, error: null }); 
        try {
            const response = await apiClient.get('/auth/me');
            set({ isAuthenticated: true, user: response.data.user, isLoading: false, error: null });
        } catch (error: unknown) { 
            console.error("Failed to fetch current user or token invalid:", error);
            set({ isAuthenticated: false, user: null, token: null, isLoading: false, error: 'Session expired. Please log in again.' });
        }
      },
      clearAuthError: () => set({ error: null }), 

      requestPasswordReset: async (email: string): Promise<PasswordActionResponse> => {
        set({ isPasswordResetLoading: true, passwordResetError: null, passwordResetSuccessMessage: null });
        try {
          const response = await apiClient.post('/auth/request-password-reset', { email });
          set({ isPasswordResetLoading: false, passwordResetSuccessMessage: response.data.message });
          return { success: true, message: response.data.message };
        } catch (err: unknown) {
          let errorMessage = 'Failed to request password reset. Please try again.';
          if (typeof err === "object" && err !== null && "response" in err) {
            const responseError = err.response as { data?: { message?: string } };
            if (responseError.data?.message) { errorMessage = responseError.data.message; }
          } else if (err instanceof Error) { errorMessage = err.message; }
          set({ isPasswordResetLoading: false, passwordResetError: errorMessage });
          return { success: false, message: errorMessage };
        }
      },

      resetPassword: async (token: string, newPassword: string): Promise<PasswordActionResponse> => {
        set({ isPasswordResetLoading: true, passwordResetError: null, passwordResetSuccessMessage: null });
        try {
          const response = await apiClient.post(`/auth/reset-password/${token}`, { newPassword });
          set({ isPasswordResetLoading: false, passwordResetSuccessMessage: response.data.message });
          return { success: true, message: response.data.message };
        } catch (err: unknown) {
          let errorMessage = 'Failed to reset password. Please try again.';
          if (typeof err === "object" && err !== null && "response" in err) {
            const responseError = err.response as { data?: { message?: string } };
            if (responseError.data?.message) { errorMessage = responseError.data.message; }
          } else if (err instanceof Error) { errorMessage = err.message; }
          set({ isPasswordResetLoading: false, passwordResetError: errorMessage });
          return { success: false, message: errorMessage };
        }
      },
      clearPasswordResetMessages: () => set({ passwordResetError: null, passwordResetSuccessMessage: null }),
    }),
    {
      name: 'auth-storage', 
      storage: createJSONStorage(() => localStorage), 
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }), 
    }
  )
);