import {create} from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'
import messageModel from '../../../backend/models/message.model';
{/*object -> ({}) -> state*/}
export const useChatStore = create((set,get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({isUsersLoading: true});
        try {
            const res = await axiosInstance.get('/message/users');
            set({users: res.data});
        } catch (err) {
            toast.error("Failed to fetch users");
        } finally {
            set({isUsersLoading: false});
        }
    },

    getMessages: async (id) => {
        set({isMessagesLoading: true});
        try {
            const res = await axiosInstance.get('/message/' + id);
            set({messages: res.data});
        } catch (err) {
            toast.error("Failed to fetch messages");
        } finally {
            set({isMessagesLoading: false});
        }
    },

    setSelectedUser: (userId) => {
        set({selectedUser: userId});
    },

    sendMessage: async(formData) => {
        try {
            const res = await axiosInstance.post('/message/send/' + formData.get('receiverId'), formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const newMessage = res ? res.data : '';
            set((state) => ({
                messages: [...state.messages, newMessage],
            }));
            await get().getMessages(formData.get('receiverId'));
        } catch (err) {
            toast.error(err.response.data);
        } 
    }
}))