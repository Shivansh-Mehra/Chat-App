import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import {io} from 'socket.io-client';

const BASE_URL = "http://localhost:8080";

export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const r = await axiosInstance.get('/auth/isLoggedIn');
            set({authUser: r.data});
            get().connectSocket();
        } catch (err) {
            set({authUser: null});
        } finally {
            set({isCheckingAuth: false});
        }
    },

    signup: async (data) => {
        set({isSigningUp: true});
        try {
            const signedUp = await axiosInstance.post('/auth/signup', data);
            toast.success("Signed up!");
            set({authUser: signedUp.data});
            get().connectSocket();
        } catch (err) {
            toast.error("Failed to sign up");
        } finally {
            set({isSigningUp: false});
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.get('/auth/logout');
            toast.success("Logged out!");
            set({authUser: null});
            get().disconnectSocket();
        } catch (err) {
            toast.error("Failed to log out");
        }
    },

    login: async (data) => {
        set({isLoggingIn: true});
        try {
            const res = await axiosInstance.post('/auth/login', {
                email: data.email,
                password: data.password,
            });
            toast.success("Logged in!");
            set({authUser: res.data});
            get().connectSocket();
        } catch (err) {
            console.error(err);
            toast.error("Failed to log in");
        } finally {
            set({isLoggingIn: false});
        }
    },

    updateProfile: async (file) => {
        set({isUpdatingProfile: true});
        try  {
            const formData = new FormData();
            formData.append('image', file);
            const res = await axiosInstance.post('/auth/update-profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success("Profile updated!");
            set({authUser: res.data});
        } catch (err) {
            toast.error(err.response.data);
        } finally {
            set({isUpdatingProfile: false});
        }
    },
    connectSocket: () => {
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL,{
            query: {
                userId: authUser._id,
            }
        });
        socket.connect();

        set({socket: socket});

        socket.on("getOnlineUsers",(userIds) => {
            set({onlineUsers: userIds});
        });
    },
    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();
    },
}))