import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import axios from 'axios';

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const r = await axiosInstance.get('/auth/isLoggedIn');
            set({authUser: r.data});
        } catch (err) {
            set({authUser: null});
        } finally {
            set({isCheckingAuth: false});
        }
    }
}))