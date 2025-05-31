import { create } from 'zustand';

type ThemeState = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: localStorage.getItem('theme') as 'light' | 'dark' || 'light', 
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.remove(state.theme);
    document.documentElement.classList.add(newTheme);
    return { theme: newTheme };
  }),
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('light', 'dark'); 
    document.documentElement.classList.add(theme);
    set({ theme });
  },
}));