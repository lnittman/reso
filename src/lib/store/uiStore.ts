import { create } from 'zustand';

export interface UIState {
  isSidebarOpen: boolean;
  isPlayerExpanded: boolean;
  theme: 'light' | 'dark' | 'system';
  
  // Actions
  toggleSidebar: () => void;
  togglePlayer: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isPlayerExpanded: false,
  theme: 'system',
  
  toggleSidebar: () => set((state) => ({ 
    isSidebarOpen: !state.isSidebarOpen 
  })),
  
  togglePlayer: () => set((state) => ({ 
    isPlayerExpanded: !state.isPlayerExpanded 
  })),
  
  setTheme: (theme) => set({ theme }),
})); 