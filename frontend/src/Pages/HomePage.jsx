import React, { useState } from 'react';
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

// import {initializeSocket} from '../store/useChatStore.js';
import Sidebar from "../Components/Sidebar";
import NoChatSelected from "../Components/NoChatSelected";
import ChatContainer from "../Components/ChatContainer";
export default function HomePage() {
    const { selectedUser, selectedGroup,initializeSocket } = useChatStore();
    const { authUser } = useAuthStore();
    React.useEffect(() => {
        if(authUser) {
            initializeSocket();
        }
    },[authUser,initializeSocket]);
    return (
        <div className="h-screen bg-base-200">
            <div className="flex items-center justify-center pt-20 px-4">
                <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
                    <div className="flex h-full rounded-lg overflow-hidden">
                        <Sidebar />
                        <div className="flex flex-col flex-1">
                            
                            {!selectedUser && !selectedGroup ? <NoChatSelected /> : <ChatContainer />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}