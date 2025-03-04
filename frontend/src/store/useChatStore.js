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
    showMembers: false,
    members: [],
    isMembersLoading: false,

    initializeSocket: () => {
        const socket = useAuthStore.getState().socket;
        socket.on("join-group",(groupId) => {
            // socket.join(groupId);
            console.log("Joining group",groupId);
            socket.emit("join-group",groupId);
        })
    },

    createGroup: async (name,members) => { //works
        try {
            await axiosInstance.post('/group/create', {name,members});
            // console.log(res);
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
    getGroupMembers: async(groupId) => {
        set({isMembersLoading: true});
        try {
            const res = await axiosInstance.get('/group/'+groupId+'/members');
            set({members: res.data});
        } catch(err) {
            toast.error("Failed to fetch members");
        } finally {
            set({isMembersLoading: false});
        }
    },

    setSelectedUser: (userId) => {
        set({selectedUser: userId});
    },

    setSelectedGroup: (groupId) => {
        set({selectedGroup: groupId});
    },
    setShowMembers: (val) => {
        set({showMembers: val});
    },

    sendMessage: async(formData) => {
        const {selectedUser,messages} = get();
        try {
            const res = await axiosInstance.post('/message/send/' + formData.get('receiverId'), formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            set({messages: [...messages, res.data]});
        } catch (err) {
            console.log(err);
            toast.error("Failed to send message");
        } 
    },

    sendGroupMessage: async (formData) => {
        try {
            await axiosInstance.post('/group/' + formData.get('groupId') + '/message', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (err) {
            console.log(err);
            toast.error("Failed to send message");
        }
    },

    subscribeToMessages: () => {
        const { selectedUser, selectedGroup,messages } = get();
        const socket = useAuthStore.getState().socket;

        if (selectedUser) {
            socket.on("newMessage", (msg) => {
                console.log("here rn");
                const isMessageSentFromSelectedUser = msg.senderId._id === selectedUser._id;
                if (!isMessageSentFromSelectedUser) return;

                set({ messages: [...get().messages, msg] });
            });
        } else if (selectedGroup) {
            socket.on("newGroupMessage", (msg) => {
                const isMessageSentFromSelectedGroup = msg.groupId === selectedGroup._id;
                if (!isMessageSentFromSelectedGroup) return;

                set({ messages: [...get().messages, msg] });
            });
        }
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
        socket.off("newGroupMessage");
    },
}))