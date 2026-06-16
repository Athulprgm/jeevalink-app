import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import api from './api';

// ─── Interfaces ────────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: 'donor' | 'volunteer';
  bloodGroup: string;
  city: string;
  district: string;
  address?: string;
  weight?: number;
  dateOfBirth?: string;
  lastDonatedDate?: string;
  profilePicture?: string;
  availableForDonation: boolean;
  rewardPoints: number;
  livesSaved: number;
  totalDonations: number;
  status: 'Active' | 'Pending Approval' | 'Suspended';
}

export interface BloodRequest {
  _id: string;
  patientName: string;
  bloodGroup: string;
  unitsRequired: number;
  hospitalName: string;
  hospitalAddress?: string;
  location: string;
  contactNumber: string;
  contactPersonName?: string;
  requiredByDate?: string;
  urgencyLevel: 'Normal' | 'Urgent' | 'Emergency SOS';
  additionalNotes?: string;
  status: 'Pending' | 'Fulfilled';
  createdAt: string;
}

export interface AppNotification {
  _id: string;
  title: string;
  message: string;
  type: 'SOS' | 'Reward' | 'Match' | 'Fulfilled';
  read: boolean;
  createdAt: string;
}

interface AppState {
  currentUser: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  
  setCurrentUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  
  // Auth methods
  login: (credential: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loadProfile: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  toggleAvailability: () => Promise<void>;
  
  // Blood requests
  bloodRequests: BloodRequest[];
  fetchBloodRequests: () => Promise<void>;
  addBloodRequest: (request: BloodRequest) => void;
  createBloodRequest: (requestData: any) => Promise<{ success: boolean; error?: string }>;
  updateBloodRequest: (id: string, updates: Partial<BloodRequest>) => void;
  fulfillBloodRequest: (id: string) => Promise<{ success: boolean; error?: string }>;
  
  // Notifications
  notifications: AppNotification[];
  fetchNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  // Donors
  donors: User[];
  searchDonors: (params?: { bloodGroup?: string; district?: string; city?: string }) => Promise<void>;
  
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const isProfileComplete = (user: User | null): boolean => {
  if (!user) return false;
  return !!(
    user.fullName &&
    user.bloodGroup &&
    user.city &&
    user.district
  );
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
// Cleared mock donor/volunteer data. Now relying fully on backend endpoints.

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      token: null,
      loading: false,
      error: null,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      
      setCurrentUser: (user) => set({ currentUser: user }),
      updateUser: (updates) =>
        set((state) => ({
          currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null,
        })),

      // Auth actions
      login: async (credential, password) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post('/auth/login', { credential, password });
          const { token, user } = res.data.data;
          set({ token, currentUser: user, loading: false });
          return { success: true };
        } catch (err: any) {
          const errMsg = err.response?.data?.message || 'Invalid credentials. Try again.';
          set({ loading: false, error: errMsg });
          return { success: false, error: errMsg };
        }
      },

      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post('/auth/register', userData);
          const { token, user } = res.data.data;
          set({ token, currentUser: user, loading: false });
          return { success: true };
        } catch (err: any) {
          const errMsg = err.response?.data?.message || 'Registration failed.';
          set({ loading: false, error: errMsg });
          return { success: false, error: errMsg };
        }
      },

      logout: () => {
        set({ token: null, currentUser: null, error: null, bloodRequests: [], notifications: [] });
      },

      loadProfile: async () => {
        if (!get().token) return;
        set({ loading: true });
        try {
          const res = await api.get('/auth/me');
          const { user } = res.data.data;
          set({ currentUser: user, loading: false });
        } catch (err) {
          set({ loading: false });
        }
      },

      updateProfile: async (updates) => {
        set({ loading: true });
        try {
          const res = await api.patch('/auth/profile', updates);
          const { user } = res.data.data;
          set({ currentUser: user, loading: false });
          return { success: true };
        } catch (err: any) {
          const errMsg = err.response?.data?.message || 'Profile update failed.';
          set({ loading: false });
          return { success: false, error: errMsg };
        }
      },

      toggleAvailability: async () => {
        const user = get().currentUser;
        if (!user) return;
        try {
          const newAvailability = !user.availableForDonation;
          await api.patch('/auth/toggle-availability');
          set((state) => ({
            currentUser: state.currentUser
              ? { ...state.currentUser, availableForDonation: newAvailability }
              : null,
          }));
        } catch (err: any) {
          if (err?.response?.status !== 401) console.error('Failed to toggle availability', err);
        }
      },

      // Blood requests actions
      bloodRequests: [],
      fetchBloodRequests: async () => {
        if (!get().token) return;
        try {
          const res = await api.get('/requests');
          if (res.data.success) {
            set({ bloodRequests: res.data.data.requests || [] });
          }
        } catch (err: any) {
          if (err?.response?.status !== 401) console.error('Failed to fetch blood requests', err);
        }
      },

      addBloodRequest: (request) =>
        set((state) => ({ bloodRequests: [request, ...state.bloodRequests] })),
        
      createBloodRequest: async (requestData) => {
        try {
          const res = await api.post('/requests', requestData);
          if (res.data.success) {
            const newReq = res.data.data.request;
            set((state) => ({ bloodRequests: [newReq, ...state.bloodRequests] }));
            return { success: true };
          }
          return { success: false };
        } catch (err: any) {
          const errMsg = err.response?.data?.message || 'Failed to create request.';
          return { success: false, error: errMsg };
        }
      },

      updateBloodRequest: (id, updates) =>
        set((state) => ({
          bloodRequests: state.bloodRequests.map((r) =>
            r._id === id ? { ...r, ...updates } : r
          ),
        })),

      fulfillBloodRequest: async (id) => {
        try {
          const res = await api.patch(`/requests/${id}/fulfill`);
          if (res.data.success) {
            const updatedReq = res.data.data.request;
            set((state) => ({
              bloodRequests: state.bloodRequests.map((r) =>
                r._id === id ? updatedReq : r
              ),
            }));
            return { success: true };
          }
          return { success: false };
        } catch (err: any) {
          const errMsg = err.response?.data?.message || 'Failed to fulfill request.';
          return { success: false, error: errMsg };
        }
      },

      // Notifications actions
      notifications: [],
      fetchNotifications: async () => {
        if (!get().token) return;
        try {
          const res = await api.get('/notifications');
          if (res.data.success) {
            set({ notifications: res.data.data.notifications || [] });
          }
        } catch (err: any) {
          if (err?.response?.status !== 401) console.error('Failed to fetch notifications', err);
        }
      },

      markNotificationRead: async (id) => {
        if (!get().token) return;
        try {
          const res = await api.patch(`/notifications/${id}/read`);
          if (res.data.success) {
            set((state) => ({
              notifications: state.notifications.map((n) =>
                n._id === id ? { ...n, read: true } : n
              ),
            }));
          }
        } catch (err: any) {
          if (err?.response?.status !== 401) console.error('Failed to mark notification as read', err);
        }
      },

      markAllNotificationsRead: async () => {
        if (!get().token) return;
        try {
          const res = await api.patch('/notifications/read-all');
          if (res.data.success) {
            set((state) => ({
              notifications: state.notifications.map((n) => ({ ...n, read: true })),
            }));
          }
        } catch (err: any) {
          if (err?.response?.status !== 401) console.error('Failed to mark all notifications as read', err);
        }
      },

      // Donors actions
      donors: [],
      searchDonors: async (params) => {
        if (!get().token) return;
        try {
          const queryParams: any = {};
          if (params?.bloodGroup && params.bloodGroup !== 'All') {
            queryParams.bloodGroup = params.bloodGroup;
          }
          if (params?.district) {
            queryParams.district = params.district;
          }
          if (params?.city) {
            queryParams.city = params.city;
          }
          const res = await api.get('/donors/search', { params: queryParams });
          if (res.data.success) {
            set({ donors: res.data.data.donors || [] });
          }
        } catch (err: any) {
          if (err?.response?.status !== 401) console.error('Failed to search donors', err);
        }
      },
    }),
    {
      name: 'jeevalink-app-storage',
      storage: createJSONStorage(() =>
        Platform.OS === 'web' ? localStorage : AsyncStorage
      ),
      partialize: (state) => ({
        currentUser: state.currentUser,
        token: state.token,
      }),
      onRehydrateStorage: (state) => {
        return (state, error) => {
          if (!error) {
            state?.setHasHydrated(true);
          }
        };
      },
    }
  )
);
