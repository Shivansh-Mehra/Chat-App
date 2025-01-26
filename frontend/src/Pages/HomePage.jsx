import React, { useState } from 'react';
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

import Sidebar from "../Components/Sidebar";
import NoChatSelected from "../Components/NoChatSelected";
import ChatContainer from "../Components/ChatContainer";
import CreateGroup from "../Components/CreateGroup";

export default function HomePage() {
    const { selectedUser, selectedGroup,createGroup } = useChatStore();
    const { authUser } = useAuthStore();
    const [showCreateGroup, setShowCreateGroup] = useState(false);

    return (
        <div className="h-screen bg-base-200">
            <div className="flex items-center justify-center pt-20 px-4">
                <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
                    <div className="flex h-full rounded-lg overflow-hidden">
                        <Sidebar />
                        <div className="flex flex-col flex-1">
                            <div className="flex justify-end p-4">
                                <button
                                    onClick={() => setShowCreateGroup(true)}
                                    className="p-2 bg-blue-500 text-white rounded-full"
                                >
                                    Create Group
                                </button>
                            </div>
                            {showCreateGroup && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                                        <button
                                            onClick={() => setShowCreateGroup(false)}
                                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                        >
                                            &times;
                                        </button>
                                        <CreateGroup />
                                    </div>
                                </div>
                            )}
                            {!selectedUser && !selectedGroup ? <NoChatSelected /> : <ChatContainer />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}