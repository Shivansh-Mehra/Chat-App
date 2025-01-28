import {create} from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'
import { useAuthStore } from './useAuthStore';
{/*object -> ({}) -> state*/}
export const useChatStore = create((set,get) => ({
    messages: [],
    users: [],
    groups: [],
    selectedUser: null,
    selectedGroup: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isGroupsLoading: false,

    createGroup: async (name,members) => { //works
        try {
            const res = await axiosInstance.post('/group/create', {name,members});

            toast.success("Group created successfully");
        } catch(err) {
            toast.error("Failed to create group");
        }
    }, 

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

    getGroupMessages: async (groupId) => {
        set({messages: []});
        set({isMessagesLoading: true});
        try {
            const res = await axiosInstance.get('/group/' + groupId + '/messages');
            set({messages: res.data});
        } catch (err) {
            toast.error("Failed to fetch messages");
        } finally {
            set({isMessagesLoading: false});
        }
    },
    getGroups: async () => {
        set({isGroupsLoading: true});
        try {  
            const res = await axiosInstance.get('/group/get');
            set({groups: res.data});
        } catch(err) {
            res.status(500).send("Error fetching groups");
        } finally {
            set({isGroupsLoading: false});
        }
    },

    setSelectedUser: (userId) => {
        set({selectedUser: userId});
    },

    setSelectedGroup: (groupId) => {
        set({selectedGroup: groupId});
    },

    sendMessage: async(formData) => {
        try {
            const res = await axiosInstance.post('/message/send/' + formData.get('receiverId'), formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const newMessage = res ? res.data : '';
            if(newMessage === '') return;
            const authUser = useAuthStore.getState().authUser; //use this
            newMessage.senderId = {
                _id: authUser._id,
                username: authUser.username,
                profilePic: authUser.profilePic,
            };
            set((state) => ({
                messages: [...state.messages, newMessage],
            }));
        } catch (err) {
            toast.error("Failed to send message");
        } 
    },

    sendGroupMessage: async (formData) => {
        try {
            const res = await axiosInstance.post('/group/' + formData.get('groupId') + '/message', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const newMessage = res ? res.data : '';
            if(newMessage === '') return;
            const authUser = useAuthStore.getState().authUser;
            newMessage.senderId = {
                _id: authUser._id,
                username: authUser.username,
                profilePic: authUser.profilePic,
            };
            set((state) => ({
                messages: [...state.messages, newMessage],
            }));
        } catch (err) {
            console.log(err);
            toast.error("Failed to send message");
        }
    },

    subscribeToMessages: () => {
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage",(msg) => {
            const isMessageSentFromSelectedUser = msg.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;


            set({messages: [...get().messages, msg]});
        })
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
}))