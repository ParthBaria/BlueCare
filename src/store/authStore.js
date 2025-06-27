import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../lib/api';
import toast from 'react-hot-toast';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.login(email, password);
          const { token, user } = response.data;

          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));

          set({
            user,
            token,
            isLoading: false,
          });

          toast.success('Login successful!');
        } catch (error) {
          set({ isLoading: false });
          const message = error.response?.data?.message || 'Login failed';
          toast.error(message);
          throw error;
        }
      },

      logout: async () => {
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          set({ user: null, token: null });
          toast.success('Logged out successfully');
        } catch (error) {
          toast.error('Logout failed');
        }
      },

      register: async (userData, password) => {
        set({ isLoading: true });
        try {
          await authAPI.register(userData, password);
          toast.success('Registration successful! Please login to continue.');
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          const message = error.response?.data?.message || 'Registration failed';
          toast.error(message);
          throw error;
        }
      },

      initializeAuth: () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
          try {
            set({
              token,
              user: JSON.parse(user),
            });
          } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      },
      setUser: async (data) => {
        const user = JSON.parse(localStorage.getItem('user'));

        const updatedUser = { ...user, ...data }


        localStorage.setItem('user', JSON.stringify(updatedUser));

      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);