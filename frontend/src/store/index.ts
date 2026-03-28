import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar_url?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setUser: (user) => set({ user }),

  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
      set({ token, isAuthenticated: true });
    } else {
      localStorage.removeItem('token');
      set({ token: null, isAuthenticated: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  hydrate: () => {
    const token = localStorage.getItem('token');
    if (token) {
      set({ token, isAuthenticated: true });
    }
  },
}));

interface UIStore {
  isMobileMenuOpen: boolean;
  isLoading: boolean;
  notification: { type: string; message: string } | null;
  toggleMobileMenu: () => void;
  setLoading: (loading: boolean) => void;
  showNotification: (type: string, message: string) => void;
  clearNotification: () => void;
}

export const useUI = create<UIStore>((set) => ({
  isMobileMenuOpen: false,
  isLoading: false,
  notification: null,

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  setLoading: (loading) => set({ isLoading: loading }),

  showNotification: (type, message) =>
    set({ notification: { type, message } }),

  clearNotification: () => set({ notification: null }),
}));
