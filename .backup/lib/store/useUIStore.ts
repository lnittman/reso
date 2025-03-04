import { create } from 'zustand';

interface UIState {
  // Mobile sidebar state
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Active tab for various sections
  activeProfileTab: string;
  setActiveProfileTab: (tab: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  
  isDarkMode: true,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  activeProfileTab: 'favorites',
  setActiveProfileTab: (tab) => set({ activeProfileTab: tab }),
})); 